// Audit-only observer; never credits, transfers, or mints coins.
const WINDOW=7*86400000,GRACE=120000,LIMIT=1200;
const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
async function init(db){
 await db.prepare("CREATE TABLE IF NOT EXISTS shoplc_reward_watch_results (source_id TEXT PRIMARY KEY,account_id TEXT NOT NULL,issue_type TEXT NOT NULL,first_seen_at INTEGER NOT NULL,changed_at INTEGER NOT NULL,last_checked_at INTEGER NOT NULL,details_json TEXT NOT NULL)").run();
 await db.prepare("CREATE TABLE IF NOT EXISTS shoplc_reward_watch_runs (id INTEGER PRIMARY KEY AUTOINCREMENT,checked_at INTEGER NOT NULL,signals INTEGER NOT NULL,receipts INTEGER NOT NULL,flagged INTEGER NOT NULL,counts_json TEXT NOT NULL)").run();
}
function signalStatus(s){
 if(s.reward_key){
  if(s.reward_credit_at===null||s.reward_credit_at===undefined)return 'receipt_pending';
  if(Number(s.ledger_count||(s.ledger_id?1:0))>1)return 'duplicate_ledger';
  if(!s.ledger_id)return 'receipt_no_ledger';
  return Number(s.ledger_amount)===5&&Number(s.reward_amount)===5?'delivered':'wrong_amount';
 }
 return String(s.click_id||'').startsWith('shoplc-signal-')?'legacy_unlinked':'missing_receipt';
}
function receiptStatus(r){
 if(r.reward_credit_at===null||r.reward_credit_at===undefined)return 'receipt_pending';
 if(Number(r.ledger_count||(r.ledger_id?1:0))>1)return 'duplicate_ledger';
  if(!r.ledger_id)return 'receipt_no_ledger';
 return Number(r.ledger_amount)===5&&Number(r.reward_amount)===5?'delivered':'wrong_amount';
}
async function record(db,id,account,status,now,details){
 await db.prepare("INSERT INTO shoplc_reward_watch_results(source_id,account_id,issue_type,first_seen_at,changed_at,last_checked_at,details_json) VALUES(?1,?2,?3,?4,?4,?4,?5) ON CONFLICT(source_id) DO UPDATE SET issue_type=excluded.issue_type,changed_at=CASE WHEN issue_type<>excluded.issue_type THEN excluded.changed_at ELSE changed_at END,last_checked_at=excluded.last_checked_at,details_json=excluded.details_json").bind(id,account,status,now,JSON.stringify(details)).run();
}
async function check(env,now=Date.now()){
 await init(env.DB);
 const from=now-WINDOW,until=now-GRACE,counts={delivered:0,legacy_unlinked:0,missing_receipt:0,receipt_pending:0,receipt_no_ledger:0,duplicate_ledger:0,wrong_amount:0,ledger_orphan:0,too_many_daily:0};
 const signals=await env.DB.prepare("SELECT s.idempotency_key AS click_id,s.account_id,s.item_id,s.action_type,s.created_at,r.idempotency_key AS reward_key,r.reward_amount,r.credited_at AS reward_credit_at,l.id AS ledger_id,l.amount AS ledger_amount,l.ledger_count FROM shoplc_click_signals s LEFT JOIN shoplc_reward_receipts r ON r.idempotency_key=s.idempotency_key AND r.account_id=s.account_id LEFT JOIN (SELECT account_id,reference_id,COUNT(*) AS ledger_count,MIN(id) AS id,SUM(amount) AS amount FROM ledger_events WHERE event_type='shoplc_click_reward' GROUP BY account_id,reference_id) l ON l.account_id=s.account_id AND l.reference_id=r.idempotency_key WHERE s.action_type IN ('buy','bid') AND s.created_at BETWEEN ?1 AND ?2 ORDER BY s.created_at DESC LIMIT ?3").bind(from,until,LIMIT).all();
 const receipts=await env.DB.prepare("SELECT r.idempotency_key AS reward_key,r.account_id,r.reward_amount,r.credited_at AS reward_credit_at,r.created_at,l.id AS ledger_id,l.amount AS ledger_amount,l.ledger_count FROM shoplc_reward_receipts r LEFT JOIN (SELECT account_id,reference_id,COUNT(*) AS ledger_count,MIN(id) AS id,SUM(amount) AS amount FROM ledger_events WHERE event_type='shoplc_click_reward' GROUP BY account_id,reference_id) l ON l.account_id=r.account_id AND l.reference_id=r.idempotency_key WHERE r.created_at BETWEEN ?1 AND ?2 ORDER BY r.created_at DESC LIMIT ?3").bind(from,until,LIMIT).all();
 const ledger=await env.DB.prepare("SELECT l.id,l.account_id,l.amount,l.created_at FROM ledger_events l LEFT JOIN shoplc_reward_receipts r ON r.account_id=l.account_id AND r.idempotency_key=l.reference_id WHERE l.event_type='shoplc_click_reward' AND l.created_at BETWEEN ?1 AND ?2 AND r.idempotency_key IS NULL ORDER BY l.created_at DESC LIMIT 100").bind(from,until).all();
 const daily=await env.DB.prepare("SELECT account_id,day_key,COUNT(*) AS paid FROM shoplc_reward_receipts WHERE created_at>=?1 AND credited_at IS NOT NULL GROUP BY account_id,day_key HAVING COUNT(*) > 3 LIMIT 100").bind(from).all();
 const matched=new Set();
 for(const s of signals.results||[]){
  const status=signalStatus(s);
  await record(env.DB,'signal:'+s.click_id,s.account_id,status,now,{action:s.action_type,clickedAt:s.created_at,receiptMatched:Boolean(s.reward_key)});
  counts[status]++;matched.add(s.click_id);
 }
 for(const r of receipts.results||[]){
  const status=receiptStatus(r);
  await record(env.DB,'receipt:'+r.reward_key,r.account_id,status,now,{creditedAt:r.reward_credit_at,ledgerMatched:Boolean(r.ledger_id),ledgerCount:Number(r.ledger_count||(r.ledger_id?1:0)),rewardAmount:r.reward_amount});
  if(!matched.has(r.reward_key))counts[status]++;
 }
 for(const l of ledger.results||[]){
  await record(env.DB,'ledger:'+l.id,l.account_id,'ledger_orphan',now,{createdAt:l.created_at,amount:l.amount});counts.ledger_orphan++;
 }
 for(const d of daily.results||[]){
  await record(env.DB,'daily:'+d.account_id+':'+d.day_key,d.account_id,'too_many_daily',now,{day:d.day_key,count:d.paid});counts.too_many_daily++;
 }
 // Old releases generated different click and payout IDs. They merit historical review,
 // but are not proof of a missing payment and must never raise a new-payout alert.
 const flagged=Object.entries(counts).reduce((sum,[k,v])=>sum+(['delivered','legacy_unlinked'].includes(k)?0:v),0);
 const historicalReview=counts.legacy_unlinked;
 await env.DB.prepare("INSERT INTO shoplc_reward_watch_runs(checked_at,signals,receipts,flagged,counts_json) VALUES(?1,?2,?3,?4,?5)").bind(now,signals.results?.length||0,receipts.results?.length||0,flagged,JSON.stringify(counts)).run();
 console.log(JSON.stringify({event:flagged?'shoplc_reward_watch_attention':historicalReview?'shoplc_reward_watch_historical_review':'shoplc_reward_watch_healthy',counts,flagged,historicalReview,signals:signals.results?.length||0,receipts:receipts.results?.length||0}));
 return {checkedAt:now,signals:signals.results?.length||0,receipts:receipts.results?.length||0,flagged,historicalReview,counts};
}
async function latest(db){
 await init(db);
 const r=await db.prepare("SELECT checked_at,signals,receipts,flagged,counts_json FROM shoplc_reward_watch_runs ORDER BY id DESC LIMIT 1").first();
 return r?{checkedAt:r.checked_at,signals:r.signals,receipts:r.receipts,flagged:r.flagged,counts:JSON.parse(r.counts_json),historicalReview:Number(JSON.parse(r.counts_json).legacy_unlinked||0)}:null;
}
export default {
 async fetch(req,env){
  if(req.method!=='GET'||new URL(req.url).pathname!=='/health')return json({ok:false,error:'not_found'},404);
  try{return json({ok:true,service:'shoplc-reward-watch',auditOnly:true,run:await latest(env.DB)})}catch(error){console.error('shoplc_watch_health_failure',String(error));return json({ok:false,error:'audit_unavailable'},503)}
 },
 async scheduled(_controller,env,ctx){
  ctx.waitUntil(check(env).catch(error=>{console.error('shoplc_watch_scan_failure',String(error));throw error}));
 }
};
export {check,signalStatus,receiptStatus};
