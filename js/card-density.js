/* StarQuest presentation repair: hide only truly empty program rows;
 * no catalog mutation, no duplicate menus, no invented wallet credits. */
(function(){
'use strict';
function init(){
 const rows=[...document.querySelectorAll('#main-content .content-section .card-row')];
 const update=row=>{
  const section=row.closest('.content-section');if(!section||section.id==='sq-archive-vault')return;
  const populated=!!row.querySelector('.card, .show-card, [role="listitem"], button:not(.scroll-btn), a, [data-show-id]')||row.children.length>0;
  section.classList.toggle('sq-no-programs',!populated);
 };
 for(const row of rows){update(row);new MutationObserver(()=>update(row)).observe(row,{childList:true,subtree:false})}
 // The fixed header owns browsing. The playback modal has its own menu.
 // Never expose both hamburger controls during one visible player session.
 const nav=document.getElementById('hamburger-btn'),player=document.getElementById('player-hamburger-btn'),page=document.getElementById('player-page');
 if(nav&&player&&page){
  const refresh=()=>{const playing=page.classList.contains('open');nav.hidden=playing;player.hidden=!playing};
  new MutationObserver(refresh).observe(page,{attributes:true,attributeFilter:['class']});refresh();
 }
 const cloud=document.getElementById('unified-wallet-status');
 const updateWallet=()=>{
  if(!cloud)return;
  if(!window.StarQuestCloudLedger?.enabled)cloud.textContent='Cloud StarCoin ledger unavailable — balance not verified.';
 };
 document.addEventListener('starquest:cloud-synced',updateWallet);
 updateWallet();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
