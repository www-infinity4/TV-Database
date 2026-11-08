/* StarQuest contributor receipts. Never conflate a public credit, a 
 * self-reported play, a verified claimant, or a funded wallet transfer. */
type Database = D1Database;
export class ProductionError extends Error {
 constructor(public status:number,public code:string,message:string){super(message)}
}
type Viewer={id:string};
type Payload=Record<string,unknown>;
const clean=(v:unknown,max=120)=>typeof v==='string'?v.trim().slice(0,max):'';
const validName=(s:string)=>s.length>=2 && s.length<=120 && !/[<>\u0000-\u001f]/.test(s);
const validQid=(s:string)=>/^Q[1-9][0-9]{0,11}$/.test(s);
const cap=(n:unknown,max:number)=>Math.min(max,Math.max(0,Math.floor(Number(n)||0)));
const sourceURL=(raw:unknown)=>{
 try{const u=new URL(clean(raw,700));if(u.protocol!=='https:'||u.username||u.password)return '';
  if(!['www.wikidata.org','wikidata.org','www.imdb.com','www.themoviedb.org','x.com','www.youtube.com','youtube.com','archive.org'].includes(u.hostname))return '';
  return u.href;
 }catch{return ''}
};
const allowedRoles=new Set(['host','guest','actor','director','producer','writer','composer','creator','performer','editor','crew']);
const platformFor=(v:unknown)=>clean(v,30).toLowerCase();
function identity(source:unknown,id:unknown){
 const p=platformFor(source),s=clean(id,120);
 if(p==='youtube'&&/^[A-Za-z0-9_-]{11}$/.test(s))return{platform:p,sourceId:s,contentId:'youtube:'+s,url:'https://www.youtube.com/watch?v='+s};
 if(p==='shoplc'&&s==='live')return{platform:p,sourceId:s,contentId:'shoplc:live',url:'https://www.shoplc.com'};
 if(p==='xspaces'&&/^[A-Za-z0-9]{8,40}$/.test(s))return{platform:p,sourceId:s,contentId:'xspaces:'+s,url:'https://x.com/i/spaces/'+s};
 if(p==='media-star'&&/^[a-zA-Z0-9_-]{6,80}$/.test(s))return{platform:p,sourceId:s,contentId:'media-star:'+s,url:''};
 throw new ProductionError(400,'invalid_production_source','Provide a supported media provider and actual source ID.');
}
// The card owner chooses free-first and curated-next rules. The signed account
// is the publisher; a browser-supplied wallet address can NEVER select a payee.
function parseCreatorSettings(body:Payload) {
 const cfg=body.creatorSettings;
 if(!cfg||typeof cfg!=='object'||Array.isArray(cfg))return null;
 const options=cfg as Payload;
 const requestedChargeMode=options.chargeForNext===true?'one_starcoin':'free';
 const rawCount=Number(options.freeEpisodes);
 if(!Number.isInteger(rawCount)||rawCount<0||rawCount>30)throw new ProductionError(400,'invalid_free_count','Choose 0 to 30 free episodes.');
 const rawEpisodes=Array.isArray(body.episodes)?body.episodes:[];
 if(rawEpisodes.length<1||rawEpisodes.length>30)throw new ProductionError(400,'invalid_creator_episodes','Enter 1 to 30 owned or permitted episode links.');
 const episodes:Array<{title:string,sourceUrl:string}>=[];
 const unique=new Set<string>();
 for(const item of rawEpisodes){
  if(!item||typeof item!=='object')throw new ProductionError(400,'invalid_creator_episode','Every episode needs a title and source.');
  const episode=item as Payload,title=clean(episode.title,160),raw=clean(episode.sourceUrl,700);
  if(title.length<2)throw new ProductionError(400,'invalid_creator_episode','Provide an episode title.');
  let url:URL;
  try{url=new URL(raw)}catch{throw new ProductionError(400,'invalid_creator_episode_url','An HTTPS original episode source is required.')}
  const host=url.hostname.toLowerCase();
  if(url.protocol!=='https:'||url.username||url.password||
   ['localhost','127.0.0.1','::1','quantaphi.org','marvaseater.workers.dev'].includes(host)||
   host.endsWith('.quantaphi.org')||host.endsWith('.marvaseater.workers.dev'))
   throw new ProductionError(400,'invalid_creator_episode_url','Use your authorized public HTTPS media link, not a wallet or internal endpoint.');
  if(unique.has(url.href))throw new ProductionError(400,'duplicate_creator_episode','Do not add the same source twice.');
  unique.add(url.href);episodes.push({title,sourceUrl:url.href});
 }
 return {requestedChargeMode,freeEpisodes:Math.min(rawCount,episodes.length),episodes};
}
async function storeCreatorSettings(db:Database,owner:Viewer,contentId:string,settings:NonNullable<ReturnType<typeof parseCreatorSettings>>,now:number) {
 // Once a reviewed card is visible publicly or a viewer has a locked
 // entitlement, never erase/reassign episode IDs by rewriting its catalog.
 // Future edits need a new reviewed revision and a migration plan.
 const current=await db.prepare('SELECT publish_state FROM media_star_creator_policies WHERE content_id=? AND creator_account_id=?')
  .bind(contentId,owner.id).first<{publish_state:string}>();
 if(current&&current.publish_state!=='draft')
  throw new ProductionError(409,'published_creator_card_immutable','An approved/pending public card needs a new reviewed revision; existing episode links are unchanged.');
 const priorUnlock=await db.prepare('SELECT request_id FROM media_star_curator_unlock_receipts WHERE content_id=? LIMIT 1')
  .bind(contentId).first();
 if(priorUnlock)
  throw new ProductionError(409,'existing_curator_unlocks_immutable','Existing viewer entitlements prevent replacing episode IDs. Create a reviewed new edition.');
 const firstSource=settings.episodes[0]?.sourceUrl||'';
 const publicFirst=settings.requestedChargeMode==='one_starcoin'&&settings.freeEpisodes===0?'':firstSource;
 const writes=[
  db.prepare('UPDATE production_catalog SET source_url=?,updated_at=? WHERE content_id=? AND publisher_account_id=?')
   .bind(publicFirst,now,contentId,owner.id),
  db.prepare(`INSERT INTO media_star_creator_policies
   (content_id,creator_account_id,requested_charge_mode,free_episode_count,price_star_coins,payment_state,publish_state,created_at,updated_at)
   VALUES(?,?,?,?,1,'disabled_pending_verification','draft',?,?)
   ON CONFLICT(content_id) DO UPDATE SET requested_charge_mode=excluded.requested_charge_mode,
   free_episode_count=excluded.free_episode_count,payment_state='disabled_pending_verification',
   publish_state='draft',updated_at=excluded.updated_at
   WHERE media_star_creator_policies.creator_account_id=excluded.creator_account_id`)
    .bind(contentId,owner.id,settings.requestedChargeMode,settings.freeEpisodes,now,now),
  db.prepare('DELETE FROM media_star_creator_episodes WHERE content_id=?').bind(contentId)
 ];
 for(let i=0;i<settings.episodes.length;i++){
  const e=settings.episodes[i];
  writes.push(db.prepare(`INSERT INTO media_star_creator_episodes
    (episode_id,content_id,position,title,source_url,created_at) VALUES(?,?,?,?,?,?)`)
    .bind(contentId+':episode-'+i,contentId,i,e.title,e.sourceUrl,now));
 }
 // The only side effects are publisher-scoped D1 draft metadata.
 // No account balance, minted coin, wallet recipient, or entitlement is changed.
 await db.batch(writes);
}

async function register(db:Database,owner:Viewer,body:Payload) {
 const canonical=identity(body.platform,body.sourceId);
 if(canonical.platform!=='media-star')throw new ProductionError(403,'creator_card_required','Only your own Media Star content may be registered here. Broadcasts are indexed from qualified views.');
 const contentId='media-star:'+owner.id+':'+canonical.sourceId;
 const title=clean(body.title,180),year=clean(body.year,4);
 if(title.length<3)throw new ProductionError(400,'title_required','The Media Star card needs a real title.');
 const source=sourceURL(body.sourceUrl)||clean(body.sourceUrl,700);
 if(source){try{const u=new URL(source);if(u.protocol!=='https:'||u.username||u.password)throw Error()}catch{throw new ProductionError(400,'invalid_source_url','A public HTTPS source URL is required.');}}
 const creatorSettings=parseCreatorSettings(body);
 // Do not put a locked first episode URL in the general catalog source field.
 // Paid URLs remain only in private, publisher-scoped episode records.
 const catalogSource=creatorSettings?.requestedChargeMode==='one_starcoin'&&creatorSettings.freeEpisodes===0?'':source;
 const now=Date.now();
 await db.prepare(`INSERT OR IGNORE INTO production_catalog (content_id,platform,source_id,title,year,source_url,publisher_account_id,created_at,updated_at)
 VALUES(?,?,?,?,?,?,?,?,?)`).bind(contentId,canonical.platform,canonical.sourceId,title,year,catalogSource,owner.id,now,now).run();
 const existing=await db.prepare('SELECT publisher_account_id FROM production_catalog WHERE content_id=?').bind(contentId).first<{publisher_account_id:string}>();
 if(existing?.publisher_account_id!==owner.id)throw new ProductionError(403,'publisher_mismatch','You cannot attach credits to another publisher.');
 if(creatorSettings)await storeCreatorSettings(db,owner,contentId,creatorSettings,now);
 const rawCredits=Array.isArray(body.credits)?body.credits.slice(0,40):[];
 let saved=0;
 for(const person of rawCredits){
  if(!person||typeof person!=='object')continue;
  const c=person as Payload,name=clean(c.name,120),role=clean(c.role,30).toLowerCase(),evidence=sourceURL(c.evidenceUrl);
  if(!validName(name)||!allowedRoles.has(role))continue;
  const key=name.toLowerCase().replace(/\s+/g,' ').trim();
  const receipt=await db.prepare(`INSERT OR IGNORE INTO production_credits
  (credit_id,content_id,person_key,display_name,role,evidence_url,evidence_status,created_at)
  VALUES(?,?,?,?,?,?,?,?)`).bind(crypto.randomUUID(),contentId,key,name,role,evidence,
  evidence?'source_submitted_needs_review':'unverified_submission',now).run();
  saved+=Number(receipt.meta.changes||0);
 }
 await db.prepare(`INSERT OR IGNORE INTO production_research_jobs(content_id,status) VALUES(?,'queued')`).bind(contentId).run();
 return {ok:true,contentId,creditsRecorded:saved,research:'queued',creditState:'not_settled',
  fundingState:'unfunded',cardPaymentsEnabled:false,spendableStarCoins:0,claimableStarCoins:0,
  creatorSettingsStored:!!creatorSettings,creatorEditionPaymentStatus:'disabled_pending_verification'};
}
async function record(db:Database,viewer:Viewer,body:Payload){
 const id=identity(body.platform,body.sourceId);
 let contentId=id.contentId;
 if(id.platform==='media-star'){
  contentId=clean(body.contentId,180);
  if(!/^media-star:[A-Za-z0-9_-]{3,90}:[A-Za-z0-9_-]{6,80}$/.test(contentId)||!contentId.endsWith(':'+id.sourceId))
   throw new ProductionError(400,'creator_content_id_required','Use the registered Media Star contentId.');
  const exists=await db.prepare('SELECT content_id FROM production_catalog WHERE content_id=? AND platform=?')
   .bind(contentId,'media-star').first();
  if(!exists)throw new ProductionError(404,'creator_content_not_registered','Register your own card before logging a qualified view.');
 }
 const observed=cap(body.observedSeconds,7200);
 if(observed<30)throw new ProductionError(400,'short_play','A play requires at least 30 seconds of actual media progress.');
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',
  year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date())
  .filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
 const day=parts.year+'-'+parts.month+'-'+parts.day,now=Date.now();
 const title=clean(body.title,180)||id.sourceId;
 // Plays from unrelated web clients can only create research-pending titles;
 // they cannot name a payee, owner, or mint a token.
 if(id.platform!=='media-star')await db.prepare(`INSERT OR IGNORE INTO production_catalog (content_id,platform,source_id,title,source_url,created_at,updated_at)
 VALUES(?,?,?,?,?,?,?)`).bind(contentId,id.platform,id.sourceId,title,id.url,now,now).run();
 await db.prepare(`INSERT OR IGNORE INTO production_research_jobs(content_id,status) VALUES(?,'queued')`).bind(contentId).run();
 const count=await db.prepare('SELECT COUNT(*) AS n FROM production_play_receipts WHERE viewer_account_id=? AND day_key=?')
 .bind(viewer.id,day).first<{n:number}>();
 const seen=await db.prepare('SELECT receipt_id FROM production_play_receipts WHERE content_id=? AND viewer_account_id=? AND day_key=?')
 .bind(contentId,viewer.id,day).first<{receipt_id:string}>();
 if(!seen && Number(count?.n||0)>=50)throw new ProductionError(429,'daily_receipt_limit','Too many distinct view receipts for one account today.');
 const receipt=crypto.randomUUID();
 const inserted=await db.prepare(`INSERT OR IGNORE INTO production_play_receipts
 (receipt_id,content_id,viewer_account_id,day_key,observed_seconds,recorded_at) VALUES(?,?,?,?,?,?)`)
 .bind(receipt,contentId,viewer.id,day,observed,now).run();
 const credited=Number(inserted.meta.changes||0)===1;
 const row=credited?receipt:seen?.receipt_id;
 // An illustrative ONE-StarCoin pool per qualified distinct play is apportioned
 // to researched credits, BUT these units are NOT funded or spendable.
 if(row){
  await allocate(db,contentId,now);
  // SECOND ledger: Infinity proposes one NEW issuer-funded coin for the
  // verified media owner after independent validation; never debit the viewer.
  // Repeated reports reuse the SAME receipt and cannot double-allocate.
  await db.prepare(`INSERT OR IGNORE INTO media_star_infinity_view_awards
   (receipt_id,content_id,created_at) VALUES(?,?,?)`).bind(row,contentId,now).run();
 }
 return {ok:true,contentId,receiptId:row||null,recorded:credited,duplicate:!credited,
    contributorResearch:'pending_or_unreviewed',proposedPoolMilliStarCoins:1000,
    creditedStarCoins:0,spendableStarCoins:0,paymentStatus:'unfunded',
    playbackProof:'client_reported_not_independently_verified',
    issuerViewAwards:'pending_independent_playback_and_funding',
    creatorCuratorFees:'separate_unconfigured_no_transfer'};
}
async function allocate(db:Database,contentId:string,now=Date.now()){
 const credits=(await db.prepare('SELECT credit_id FROM production_credits WHERE content_id=? ORDER BY credit_id LIMIT 120')
 .bind(contentId).all<{credit_id:string}>()).results;
 if(!credits.length)return;
 const plays=(await db.prepare(`SELECT receipt_id FROM production_play_receipts WHERE content_id=? AND receipt_id NOT IN
 (SELECT receipt_id FROM production_attribution_entries) ORDER BY recorded_at LIMIT 100`).bind(contentId).all<{receipt_id:string}>()).results;
 for(const play of plays){
  const each=Math.floor(1000/credits.length),extra=1000%credits.length;
  await db.batch(credits.map((person,i)=>db.prepare(`INSERT OR IGNORE INTO production_attribution_entries
 (receipt_id,credit_id,proposed_milli_starcoins,funded_milli_starcoins,payout_status,created_at)
 VALUES(?,?,?,0,'unfunded',?)`).bind(play.receipt_id,person.credit_id,each+(i<extra?1:0),now)));
 }
}
async function findByName(db:Database,name:string){
 if(name.length<2||name.length>100)throw new ProductionError(400,'name_required','Search for a contributor using two or more characters.');
 const match='%'+name.replace(/[%_\\]/g,'\\$&')+'%';
 const rows=(await db.prepare(`SELECT c.credit_id,c.display_name,c.role,c.evidence_url,c.evidence_status,
 p.title,p.content_id,p.platform,COUNT(DISTINCT r.receipt_id) AS qualified_plays,
 COALESCE(SUM(a.proposed_milli_starcoins),0) AS proposed_units,
 COALESCE(SUM(a.funded_milli_starcoins),0) AS funded_units
 FROM production_credits c JOIN production_catalog p ON p.content_id=c.content_id
 LEFT JOIN production_attribution_entries a ON a.credit_id=c.credit_id
 LEFT JOIN production_play_receipts r ON r.receipt_id=a.receipt_id
 WHERE c.display_name LIKE ? ESCAPE '\\'
 GROUP BY c.credit_id ORDER BY c.display_name,p.title LIMIT 70`).bind(match).all()).results;
 return {ok:true,query:name,results:rows,disclaimer:'Public credits are research leads, not proof of identity, royalty ownership, cash value or a spendable balance. Proposed units are unfunded; funded units remain zero until verified settlement.'};
}
async function claim(db:Database,account:Viewer,body:Payload){
 const creditId=clean(body.creditId,120),evidence=sourceURL(body.evidenceUrl);
 if(!creditId||!evidence)throw new ProductionError(400,'evidence_required','Provide a credit ID and a public evidence URL.');
 const found=await db.prepare('SELECT credit_id FROM production_credits WHERE credit_id=?').bind(creditId).first();
 if(!found)throw new ProductionError(404,'credit_not_found','This credit has not been recorded.');
 const now=Date.now(),id=crypto.randomUUID();
 const inserted=await db.prepare(`INSERT OR IGNORE INTO production_claim_requests(id,credit_id,claimant_account_id,evidence_url,created_at)
 VALUES(?,?,?,?,?)`).bind(id,creditId,account.id,evidence,now).run();
 return {ok:true,submitted:Number(inserted.meta.changes||0)===1,claimStatus:'pending_identity_and_rights_review',creditedStarCoins:0,withdrawableCash:0};
}
async function myClaims(db:Database,account:Viewer){
 const r=await db.prepare(`SELECT cl.id,cl.credit_id,cl.status,cl.created_at,c.display_name,c.role,p.title
 FROM production_claim_requests cl JOIN production_credits c ON c.credit_id=cl.credit_id
 JOIN production_catalog p ON p.content_id=c.content_id
 WHERE cl.claimant_account_id=? ORDER BY cl.created_at DESC LIMIT 100`).bind(account.id).all();
 return {ok:true,claims:r.results,spendableStarCoinsFromProduction:0,payoutsEnabled:false};
}
// Public-read-only discovery: only cards already approved by a separate
// rights/identity moderator; locked episode links never leave Cloudflare D1.
async function publicMediaStarCards(db:Database){
 const rows=(await db.prepare(`SELECT m.content_id,p.title AS card_title,m.requested_charge_mode,
 m.free_episode_count,m.payment_state,e.episode_id,e.position,e.title AS episode_title,
 CASE WHEN m.requested_charge_mode='free' OR e.position<m.free_episode_count THEN e.source_url ELSE NULL END AS public_source_url
 FROM media_star_creator_policies m
 JOIN production_catalog p ON p.content_id=m.content_id
 JOIN media_star_creator_episodes e ON e.content_id=m.content_id
 WHERE m.publish_state='approved'
 AND m.content_id IN (
  SELECT content_id FROM media_star_creator_policies WHERE publish_state='approved' ORDER BY updated_at DESC LIMIT 40
 )
 ORDER BY m.updated_at DESC,e.position ASC LIMIT 1200`).all<{
  content_id:string;card_title:string;requested_charge_mode:string;free_episode_count:number;
  payment_state:string;episode_id:string;position:number;episode_title:string;public_source_url:string|null;
 }>()).results;
 const cards=new Map<string,{
  contentId:string;title:string;freeEpisodeCount:number;paymentState:string;
  curatedPriceStarCoins:number;episodes:Array<{episodeId:string;position:number;title:string;free:boolean;sourceUrl:string|null;requiresUnlock:boolean}>;
 }>();
 for(const entry of rows){
  let card=cards.get(entry.content_id);
  if(!card){
   card={contentId:entry.content_id,title:entry.card_title,freeEpisodeCount:entry.free_episode_count,
    paymentState:entry.payment_state,curatedPriceStarCoins:entry.requested_charge_mode==='one_starcoin'?1:0,episodes:[]};
   cards.set(entry.content_id,card);
  }
  const free=entry.requested_charge_mode==='free'||entry.position<entry.free_episode_count;
  card.episodes.push({episodeId:entry.episode_id,position:entry.position,title:entry.episode_title,
   free,sourceUrl:free?entry.public_source_url:null,requiresUnlock:!free});
 }
 return {ok:true,cards:[...cards.values()],
  publisherApproval:'moderated_only',checkoutEnabled:false,
  disclosure:'Free original media links are shown; paid links are withheld until authorized entitlements and verified curator checkout exist.'};
}

export async function productionGet(path:string,url:URL,db:Database){
 if(path==='/v1/production/media-star-cards')return publicMediaStarCards(db);
 if(path==='/v1/production/search')return findByName(db,clean(url.searchParams.get('name'),100));
 if(path==='/v1/production/record'){
  const id=clean(url.searchParams.get('contentId'),180);
  if(!id)throw new ProductionError(400,'content_id_required','Select a production.');
  const p=await db.prepare('SELECT content_id,platform,title,attribution_state,research_state FROM production_catalog WHERE content_id=?').bind(id).first();
  if(!p)throw new ProductionError(404,'production_not_found','No such production is indexed.');
  const credits=(await db.prepare(`SELECT credit_id,display_name,role,evidence_url,evidence_status FROM production_credits
   WHERE content_id=? ORDER BY role,display_name LIMIT 120`).bind(id).all()).results;
  const playCount=await db.prepare('SELECT COUNT(*) AS n FROM production_play_receipts WHERE content_id=?').bind(id).first<{n:number}>();
  return {ok:true,production:p,credits,qualifiedSelfReportedPlays:Number(playCount?.n||0),settledStarCoins:0,
    disclosure:'A public credit is not an actual wallet balance. All proposed per-view units remain unfunded.'};
 }
 return null;
}
export async function productionPost(path:string,db:Database,account:Viewer,body:Payload){
 if(path==='/v1/production/register')return register(db,account,body);
 if(path==='/v1/production/plays')return record(db,account,body);
 if(path==='/v1/production/claim')return claim(db,account,body);
 if(path==='/v1/production/mine')return myClaims(db,account);
 return null;
}
// Light bot research pass; candidate credits have sourced Wikidata references
// and remain UNVERIFIED. No guest, royalty or identity guesses.
export async function researchProductionCredits(db:Database){
 const jobs=(await db.prepare(`SELECT j.content_id,p.title,p.platform
 FROM production_research_jobs j JOIN production_catalog p ON p.content_id=j.content_id
 WHERE j.status='queued' ORDER BY p.created_at LIMIT 2`).all<{content_id:string,title:string,platform:string}>()).results;
 for(const job of jobs){
  const now=Date.now();
  try{
   if(!['youtube','media-star'].includes(job.platform)){
    await db.prepare(`UPDATE production_research_jobs SET status='requires_independent_credits',attempts=attempts+1,last_checked_at=? WHERE content_id=?`).bind(now,job.content_id).run();continue;
   }
   const search='https://www.wikidata.org/w/api.php?action=wbsearchentities&language=en&format=json&limit=5&search='+encodeURIComponent(job.title);
   const ctrl=new AbortController();const tm=setTimeout(()=>ctrl.abort(),6000);
   let data:unknown;try{const response=await fetch(search,{signal:ctrl.signal,headers:{Accept:'application/json'}});if(!response.ok)throw Error('wikidata_unavailable');data=await response.json()}finally{clearTimeout(tm)}
   const choices=(data as {search?:Array<{id:string,label:string}>})?.search||[];
   const exact=choices.filter(x=>x.label?.trim().toLowerCase()===job.title.trim().toLowerCase()&&validQid(x.id));
   // Ambiguous exact titles are NOT assigned another work's cast.
   if(exact.length!==1){
    await db.prepare(`UPDATE production_research_jobs SET status='needs_title_disambiguation',attempts=attempts+1,last_checked_at=? WHERE content_id=?`).bind(now,job.content_id).run();continue;
   }
   const q=exact[0].id;
   const response=await fetch('https://www.wikidata.org/wiki/Special:EntityData/'+q+'.json');
   if(!response.ok)throw Error('wikidata_entity_unavailable');
   const obj=await response.json() as {entities?:Record<string,{claims?:Record<string,Array<{mainsnak?:{datavalue?:{value?:{id?:string}}}}>>}>};
   const claims=obj.entities?.[q]?.claims||{};
   const roles:Record<string,string>={P161:'actor',P57:'director',P162:'producer',P86:'composer',P170:'creator',P58:'writer'};
   const found:Array<{qid:string,role:string}>=[];
   for(const [prop,role] of Object.entries(roles)){
    for(const statement of(claims[prop]||[]).slice(0,14)){
     const id=statement.mainsnak?.datavalue?.value?.id;
     if(id&&validQid(id))found.push({qid:id,role});
    }
   }
   if(!found.length){await db.prepare(`UPDATE production_research_jobs SET status='no_public_credits_found',attempts=attempts+1,last_checked_at=?,evidence_url=? WHERE content_id=?`).bind(now,'https://www.wikidata.org/wiki/'+q,job.content_id).run();continue}
   const ids=[...new Set(found.map(x=>x.qid))].slice(0,40);
   const labelResponse=await fetch('https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&languages=en&props=labels&ids='+encodeURIComponent(ids.join('|')));
   if(!labelResponse.ok)throw Error('wikidata_labels_unavailable');
   const labeled=await labelResponse.json() as {entities?:Record<string,{labels?:{en?:{value?:string}}}>};
   const operations=[];
   for(const one of found.slice(0,40)){
    const name=clean(labeled.entities?.[one.qid]?.labels?.en?.value,120);
    if(!validName(name))continue;
    operations.push(db.prepare(`INSERT OR IGNORE INTO production_credits
     (credit_id,content_id,person_key,display_name,role,evidence_url,evidence_status,created_at)
     VALUES(?,?,?,?,? ,?,'wikidata_candidate_needs_review',?)`).bind(crypto.randomUUID(),job.content_id,
      'wikidata:'+one.qid,name,one.role,'https://www.wikidata.org/wiki/'+q,now));
   }
   if(operations.length)await db.batch(operations);
   // Public provenance only; never assert any royalty entitlement.
   await db.prepare("UPDATE production_catalog SET attribution_state='research_candidates',research_state='source_checked',updated_at=? WHERE content_id=?")
    .bind(now,job.content_id).run();
   await db.prepare(`UPDATE production_research_jobs SET status='candidates_saved',attempts=attempts+1,last_checked_at=?,evidence_url=? WHERE content_id=?`)
   .bind(now,'https://www.wikidata.org/wiki/'+q,job.content_id).run();
   await allocate(db,job.content_id,now);
  }catch{
   await db.prepare(`UPDATE production_research_jobs SET status=CASE WHEN attempts>=2 THEN 'research_retry_needed' ELSE 'queued' END,attempts=attempts+1,last_checked_at=?,note='source_unavailable' WHERE content_id=?`)
   .bind(now,job.content_id).run();
  }
 }
 return jobs.length;
}
