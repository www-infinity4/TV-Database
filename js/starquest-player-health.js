/* StarQuest Cinema: the source must really be playable before the UI says so.
 * Keeps YouTube's own player, gives a prominent exact-title fallback, and
 * never treats an Internet Archive listing or an iframe load as a movie play. */
(function(){
'use strict';
const frame=document.getElementById('player-frame');
const page=document.getElementById('player-page');
const wrap=document.querySelector('.player-wrap');
const error=document.getElementById('player-error');
const original=document.getElementById('player-error-link');
if(!frame||!page||!wrap)return;
const source=document.createElement('a');
source.className='sq-cinema-original';
source.id='sq-cinema-original';
source.textContent='↗ Watch at original video source';
source.target='_blank';source.rel='noopener noreferrer';source.hidden=true;
wrap.append(source);
const message=document.createElement('p');
message.className='sq-cinema-state';message.id='sq-cinema-state';
message.setAttribute('role','status');message.textContent='Choose a movie to start.';
wrap.append(message);
let generation=0,player=null,scriptPromise=null,activeId='';
const videoId=()=>{
 try{
  const u=new URL(frame.getAttribute('src')||'',location.href);
  if(!['www.youtube.com','www.youtube-nocookie.com'].includes(u.hostname))return '';
  const id=u.pathname.match(/^\/embed\/([A-Za-z0-9_-]{11})$/)?.[1]||'';
  return id;
 }catch{return ''}
};
const linkTo=id=>'https://www.youtube.com/watch?v='+encodeURIComponent(id);
function unhook(){
 if(player){try{player.destroy()}catch{}player=null}
}
function unavailable(){
 message.textContent='This video cannot play here. Use the original source or select another movie.';
 if(error){error.style.display='flex';if(original){original.href=source.href;original.textContent='Open this exact movie on YouTube ↗'}}
 frame.style.display='none';
}
function playerApi(){
 if(window.YT?.Player)return Promise.resolve(true);
 if(scriptPromise)return scriptPromise;
 scriptPromise=new Promise(resolve=>{
  let done=false;
  const finish=ok=>{if(done)return;done=true;clearTimeout(timer);resolve(!!ok)};
  const previous=window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady=()=>{try{previous?.()}catch{}finish(!!window.YT?.Player)};
  const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';
  s.async=true;s.onerror=()=>finish(false);document.head.append(s);
  const timer=setTimeout(()=>finish(!!window.YT?.Player),12000);
 });
 return scriptPromise;
}
async function synchronize(){
 const id=videoId();if(id===activeId&&page.classList.contains('open'))return;
 generation++;const ticket=generation;unhook();activeId=id;
 if(!page.classList.contains('open')||!id){
  source.hidden=true;message.textContent='Choose a movie to start.';if(error)error.style.display='none';
  return;
 }
 const link=linkTo(id);source.href=link;source.hidden=false;
 if(original){original.href=link;original.textContent='Open this exact movie on YouTube ↗'}
 message.textContent='Movie selected. Checking the original video player…';
 const available=await playerApi();
 if(ticket!==generation||!page.classList.contains('open')||videoId()!==id)return;
 if(!available){message.textContent='Press Play in the player. If the embed is blocked, open the original video above.';return}
 try{
  player=new window.YT.Player(frame,{
   events:{
    onReady:()=>{if(ticket===generation)message.textContent='Ready. Press ▶ to play with sound.';},
    onStateChange:event=>{
     if(ticket!==generation)return;
     if(event.data===window.YT.PlayerState?.PLAYING){message.textContent='Now playing · '+(document.getElementById('player-ep-title')?.textContent||'StarQuest movie');if(error)error.style.display='none';}
     else if(event.data===window.YT.PlayerState?.BUFFERING)message.textContent='Buffering video…';
     else if(event.data===window.YT.PlayerState?.PAUSED)message.textContent='Paused · Resume in the player';
    },
    onError:event=>{if(ticket!==generation)return;
     if([2,5,100,101,150].includes(Number(event.data)))unavailable();
    }
   }
  });
 }catch{message.textContent='Use the ▶ button in the player or the original source link.';}
}
const observer=new MutationObserver(()=>{if(!page.classList.contains('open')){generation++;activeId='';source.hidden=true;message.textContent='Player closed.';return}void synchronize()});
observer.observe(frame,{attributes:true,attributeFilter:['src']});
observer.observe(page,{attributes:true,attributeFilter:['class']});
document.addEventListener('starquest:episode-opened',()=>setTimeout(()=>void synchronize(),0));
window.addEventListener('pagehide',()=>{generation++;unhook()});
})();
