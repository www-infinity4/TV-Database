/* Media Star engagement ledger #317: non-payable observations ONLY.
 * The server authenticates the viewer; it never trusts a client-provided account,
 * address, creator, payee, payment success, or analytics targeting permission.
 * The HMAC secret must be server-side and separately deployed.
 */
type Database=D1Database;
type Viewer={id:string};
type UsageBody=Record<string,unknown>;
export class UsageError extends Error{
 constructor(public status:number,public code:string,message:string){super(message)}
}
const clean=(value:unknown,max=190)=>typeof value==='string'?value.trim().slice(0,max):'';
const ALLOWED_ACTIONS=new Set(['card_open','app_use','episode_play_request']);
function centralDay(now:number){
 const parts=new Intl.DateTimeFormat('en-CA',{
  timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'
 }).formatToParts(new Date(now));
 const obj=Object.fromEntries(parts.map(item=>[item.type,item.value]));
 return [obj.year,obj.month,obj.day].join('-');
}
export async function maskedUsageAlias(accountId:string,contentId:string,secret:string):Promise<string>{
 if(typeof secret!=='string'||secret.length<32)throw new UsageError(503,'usage_alias_secret_unavailable','Usage recording is temporarily unavailable.');
 // Per-content separation: a public card identifier cannot correlate a person's
 // behavior across unrelated creations. Only approved private services may link
 // consented data to an account, never the card publisher.
 const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),
  {name:'HMAC',hash:'SHA-256'},false,['sign']);
 const signature=await crypto.subtle.sign('HMAC',material,new TextEncoder().encode('v1|'+contentId+'|'+accountId));
 const hex=Array.from(new Uint8Array(signature),byte=>byte.toString(16).padStart(2,'0')).join('');
 return 'anon_'+hex.slice(0,32);
}
export async function recordUsageEvent(db:Database,account:Viewer,body:UsageBody,secret?:string){
 if(!account?.id||!/^[A-Za-z0-9_-]{3,100}$/.test(account.id))
  throw new UsageError(401,'authenticated_viewer_required','Sign in to save a usage receipt.');
 const contentId=clean(body.contentId,180);
 if(!/^[a-zA-Z0-9:_-]{6,180}$/.test(contentId))throw new UsageError(400,'invalid_content_id','Select a registered content card.');
 const action=clean(body.action,28);
 if(!ALLOWED_ACTIONS.has(action))throw new UsageError(400,'invalid_usage_action','Select a supported card action.');
 const requestId=clean(body.requestId,96);
 if(!/^[A-Za-z0-9_-]{16,96}$/.test(requestId))throw new UsageError(400,'invalid_usage_receipt','Use a unique per-action request ID.');
 const viewerMask=await maskedUsageAlias(account.id,contentId,secret||'');
 const existing=await db.prepare('SELECT content_id FROM production_catalog WHERE content_id=?')
  .bind(contentId).first<{content_id:string}>();
 if(!existing)throw new UsageError(404,'content_not_registered','This source is not a registered content card.');
 const prior=await db.prepare(`SELECT receipt_id FROM media_star_usage_events
   WHERE content_id=? AND viewer_mask=? AND request_id=?`)
  .bind(contentId,viewerMask,requestId).first<{receipt_id:string}>();
 if(prior)return {ok:true,receiptId:prior.receipt_id,duplicate:true,recorded:false,
  viewerAlias:viewerMask,action,paymentStatus:'not_charged',rewardStatus:'not_payable',
  settledStarCoins:0,rightsHolderAward:'not_issued',curatorFee:'not_transferred'};
 const now=Date.now(),day=centralDay(now);
 const count=await db.prepare(`SELECT COUNT(*) AS total FROM media_star_usage_events
   WHERE viewer_mask=? AND content_id=? AND observed_day=?`)
  .bind(viewerMask,contentId,day).first<{total:number}>();
 if(Number(count?.total||0)>=100)throw new UsageError(429,'daily_usage_limit','Usage events are limited to protect against automated refreshing.');
 const receiptId=crypto.randomUUID();
 const inserted=await db.prepare(`INSERT OR IGNORE INTO media_star_usage_events
  (receipt_id,content_id,viewer_mask,request_id,event_type,observed_day,recorded_at)
  VALUES(?,?,?,?,?,?,?)`).bind(receiptId,contentId,viewerMask,requestId,action,day,now).run();
 const recorded=Number(inserted.meta.changes||0)===1;
 const winner=recorded?receiptId:(await db.prepare(`SELECT receipt_id FROM media_star_usage_events
  WHERE content_id=? AND viewer_mask=? AND request_id=?`)
  .bind(contentId,viewerMask,requestId).first<{receipt_id:string}>())?.receipt_id;
 return {ok:true,receiptId:winner||null,duplicate:!recorded,recorded,
  viewerAlias:viewerMask,action,observationStatus:'client_unverified',paymentStatus:'not_charged',
  rewardStatus:'not_payable',settledStarCoins:0,rightsHolderAward:'not_issued',
  curatorFee:'not_transferred',privacy:'content_scoped_mask_only_no_profile_targeting'};
}
