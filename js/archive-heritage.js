/* StarQuest · Copilot Internet Archive catalog revival.
 * Dedicated opt-in research shelf. The current YouTube catalog, wallet,
 * playback mode and existing program mappings remain untouched.
 * Captures exact legacy catalog records BEFORE the YouTube-only gate filters. */
(function(g){
'use strict';
const original=typeof SHOWS!=='undefined'&&Array.isArray(SHOWS)?SHOWS:[];
const allowedId=/^[A-Za-z0-9][A-Za-z0-9._-]{1,127}$/;
const videos=new Map();
for(const show of original){
 if(!show||!Array.isArray(show.episodes))continue;
 for(const ep of show.episodes){
  const id=String(ep.archiveId||show.archiveId||''),file=String(ep.archiveFile||show.archiveFile||'');
  if(!allowedId.test(id)||!file||!/(?:\.mp4|\.m4v|\.webm|\.ogv)$/i.test(file)||file.length>350)continue;
  // Only the old Copilot precise file records. No unverified playlist indexes.
  const key=id+'|'+file;if(videos.has(key))continue;
  videos.set(key,{id,file,title:String(ep.title||show.title||'Untitled').slice(0,120),
    show:String(show.title||'Classic television').slice(0,100),
    year:String(ep.year||show.years||'').slice(0,20),thumb:'https://archive.org/services/img/'+encodeURIComponent(id)});
 }
}
const entries=[...videos.values()];
g.StarQuestArchiveHeritage=Object.freeze({count:entries.length,originCommit:'dbae38cf04622de07540d4b613e35486d8cfd470'});
function make(tag,cl,text){const n=document.createElement(tag);if(cl)n.className=cl;if(text!==undefined)n.textContent=text;return n}
function rights(metadata){
 const m=metadata?.metadata||{},license=String(m.licenseurl||'').trim().toLowerCase();
 // An archived television upload by itself is not a public distribution license.
 return /^https?:\/\/creativecommons\.org\/(?:licenses\/(?:by|by-sa)\/|publicdomain\/zero\/)/.test(license);
}
function direct(id,file){return 'https://archive.org/download/'+encodeURIComponent(id)+'/'+file.split('/').map(encodeURIComponent).join('/')}
function mount(){
 const main=document.getElementById('main-content');if(!main)return;
 const shelf=make('section','content-section sq-archive-vault');shelf.id='sq-archive-vault';shelf.setAttribute('aria-label','Internet Archive historical StarQuest catalog');
 const header=make('div','section-header');header.append(make('h2','section-title','📼 Internet Archive · Copilot Collection'));
 shelf.append(header,make('p','sq-archive-intro',entries.length+' archived video records recovered from the exact-file StarQuest catalog, without changing the current YouTube guide. Select a title to check the original record and documented licensing. A listing alone does not prove permission or playback.'));
 const row=make('div','sq-archive-filters');
 const find=make('input','sq-archive-search');find.type='search';find.placeholder='Find a show or episode';find.setAttribute('aria-label','Search recovered Archive catalog');
 const counter=make('span','sq-archive-count','');row.append(find,counter);shelf.append(row);
 const grid=make('div','sq-archive-grid'),foot=make('div','sq-archive-controls'),more=make('button','sq-archive-button','Load more titles');more.type='button';
 const viewer=make('section','sq-archive-viewer');viewer.hidden=true;viewer.setAttribute('aria-live','polite');
 const watch=make('video','sq-archive-video');watch.controls=true;watch.preload='none';watch.playsInline=true;watch.hidden=true;
 const message=make('p','sq-archive-message','');
 const details=make('a','sq-archive-original','Open source record ↗');details.rel='noopener noreferrer';details.target='_blank';
 const close=make('button','sq-archive-button','Close player');close.type='button';
 viewer.append(message,watch,details,close);
 const filtered=()=>entries.filter(e=>(e.show+' '+e.title+' '+e.year).toLowerCase().includes(find.value.trim().toLowerCase()));
 let limit=12,token=0;
 function stop(){token++;watch.pause();watch.removeAttribute('src');watch.load();watch.hidden=true;viewer.hidden=true}
 close.addEventListener('click',stop);
 async function open(entry){
   stop();const current=++token;viewer.hidden=false;message.textContent='Checking the original Archive record and its license…';
   details.href='https://archive.org/details/'+encodeURIComponent(entry.id);
   viewer.scrollIntoView?.({block:'nearest',behavior:'smooth'});
   try{
    const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),12000);
    let meta;try{const response=await fetch('https://archive.org/metadata/'+encodeURIComponent(entry.id),{signal:ctrl.signal,cache:'no-store'});if(!response.ok)throw Error('source_status_'+response.status);meta=await response.json()}finally{clearTimeout(timer)}
    if(current!==token)return;
    const match=(Array.isArray(meta?.files)?meta.files:[]).find(file=>file?.name===entry.file&&/(?:\.mp4|\.m4v|\.webm|\.ogv)$/i.test(file.name));
    if(!match){message.textContent='The old exact video file is no longer verified. Open the Archive record for details.';return}
    if(!rights(meta)){message.textContent='Original file found, but an eligible open license is not established. This is a research record, not an authorized stream.';return}
    message.textContent=entry.show+' · '+entry.title+' — open-licensed source file verified. Press Play.';
    watch.src=direct(entry.id,entry.file);watch.hidden=false;
   }catch(error){if(current!==token)return;message.textContent='Archive verification unavailable right now. No unverified video was started.';}
 }
 function paint(){
  grid.replaceChildren();const list=filtered();counter.textContent=list.length+' matching records';
  for(const e of list.slice(0,limit)){
   const b=make('button','sq-archive-card');b.type='button';b.setAttribute('aria-label','Inspect '+e.show+' '+e.title);
   const img=make('img');img.src=e.thumb;img.loading='lazy';img.alt='';img.onerror=()=>img.remove();
   b.append(img,make('strong','',e.show),make('span','',e.title),make('small','',e.year+' · Check Archive source →'));
   b.addEventListener('click',()=>void open(e));grid.append(b);
  }
  more.hidden=list.length<=limit;
 }
 find.addEventListener('input',()=>{limit=12;paint()});
 more.addEventListener('click',()=>{limit+=12;paint()});
 foot.append(more);shelf.append(grid,foot,viewer);
 const first=main.querySelector('.content-section');main.insertBefore(shelf,first||null);paint();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})(window);
