/* StarQuest presentation repair: hide only truly empty program rows;
 * no catalog mutation, no duplicate menus, no invented wallet credits. */
(function(){
'use strict';
function init(){
 const rows=[...document.querySelectorAll('#main-content .content-section .card-row')];
 const update=row=>{
  const section=row.closest('.content-section');if(!section||section.id==='sq-archive-vault')return;
  // Only an actual rendered, playable or inspectable title counts. Blank\n  // placeholders, invisible skeletons, and decorative row wrappers do not.\n  const populated=!!row.querySelector('.show-card, [data-show-id], [data-episode-id], .episode-item');
  section.classList.toggle('sq-no-programs',!populated);
 };
 for(const row of rows){update(row);new MutationObserver(()=>update(row)).observe(row,{childList:true,subtree:false})}
 // One physical green menu button follows the user into the player top bar.
 // Moving the same DOM node keeps its sidebar, account recovery, and wallet actions.
 const nav=document.getElementById('hamburger-btn'),page=document.getElementById('player-page');
 const playerHost=page?.querySelector('.player-topbar__right'),homeHost=nav?.parentElement;
 if(nav&&page&&playerHost&&homeHost){
  const refresh=()=>{
   const destination=page.classList.contains('open')?playerHost:homeHost;
   if(nav.parentElement!==destination)destination.appendChild(nav);
  };
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
