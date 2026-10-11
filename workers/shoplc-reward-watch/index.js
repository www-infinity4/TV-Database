/* ShopLC StarCoin observer: scheduled, privacy-preserving, read-only against wallet balances.
 * Writes only audit findings, never StarCoins, receipts, or ledger events.
 */
const HOUR=3600000,LOOKBACK=72*HOUR,GRACE=8*60000;
const LIMIT=1000,AMOUNT=5,DAILY=3;
const json=(body,status=200)=>Response.json(body,{status,headers:{
  'content-type':'application/json; charset=utf-8',
  'cache-control':'no-store','access-control-allow-origin':'https://quantaphi.org',
  'x-content-type-options':'nosniff'
}});
const dayKey=ms=>{
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(ms));
  const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
  return [p.year,p.month,p.day].join('-');
};
const isRewardable=s=>(s.action_type==='buy'||s.action_type==='bid')&&/^(product|auction):[A-Za-z0-9._:-]{3,140}$/.test(s.item_id||'');
const n=x=>Number(x)||0;
const groupKey=(account,day)=>account+'|'+day;
async function ensureAuditTables(db){
  await db.prepare("CREATE TABLE IF NOT EXISTS shoplc_watch_findings (issue_key TEXT PRIMARY KEY,account_id TEXT NOT NULL,day_key TEXT NOT NULL,category TEXT NOT NULL,expected INTEGER NOT NULL,actual INTEGER NOT NULL,status TEXT NOT NULL,first_seen_at INTEGER NOT NULL,last_seen_at INTEGER NOT NULL,details TEXT NOT NULL DEFAULT '')").run();
  await db.prepare("CREATE TABLE IF NOT EXISTS shoplc_watch_runs (run_id TEXT PRIMARY KEY,started_at INTEGER NOT NULL,completed_at INTEGER NOT NULL,scanned_clicks INTEGER NOT NULL,scanned_receipts INTEGER NOT NULL,open_findings INTEGER NOT NULL,shortfall_coins INTEGER NOT NULL,truncated INTEGER NOT NULL DEFAULT 0)").run();
}
async function audit(db,clock=Date.now()){
  const since=clock-LOOKBACK,until=clock-GRACE;
  await ensureAuditTables(db);
  // No account credentials, passwords, names or bearer tokens are fetched by this worker.
  const [clickResult,receiptResult,eventResult]=await Promise.all([
    db.prepare("SELECT account_id,idempotency_key,item_id,action_type,created_at FROM shoplc_click_signals WHERE created_at>=?1 AND created_at<=?2 AND action_type IN ('buy','bid') ORDER BY created_at DESC LIMIT ?3").bind(since,until,LIMIT).all(),
    db.prepare("SELECT account_id,idempotency_key,receipt_id,reward_amount,day_key,created_at,credited_at FROM shoplc_reward_receipts WHERE created_at>=?1 ORDER BY created_at DESC LIMIT ?2").bind(since,LIMIT*2).all(),
    db.prepare("SELECT account_id,reference_id,id,amount,created_at FROM ledger_events WHERE event_type='shoplc_click_reward' AND created_at>=?1 ORDER BY created_at DESC LIMIT ?2").bind(since,LIMIT*2).all()
  ]);
  const clicks=clickResult.results||[],receipts=receiptResult.results||[],events=eventResult.results||[];
  const truncated=Number(clicks.length>=LIMIT||receipts.length>=LIMIT*2||events.length>=LIMIT*2);
  const groups=new Map(),receiptById=new Map(),eventsByRef=new Map();
  for(const click of clicks){
    if(!isRewardable(click))continue;
    const day=dayKey(n(click.created_at)),key=groupKey(click.account_id,day);
    let g=groups.get(key);if(!g){g={account:click.account_id,day,clicks:[]};groups.set(key,g)}
    g.clicks.push(click);
  }
  for(const receipt of receipts)receiptById.set(receipt.idempotency_key,receipt);
  for(const event of events){
    const key=groupKey(event.account_id,String(event.reference_id||''));
    if(!eventsByRef.has(key))eventsByRef.set(key,[]);
    eventsByRef.get(key).push(event);
  }
  const creditedByDay=new Map(),issueMap=new Map();
  for(const receipt of receipts){
    if(receipt.credited_at==null)continue;
    const key=groupKey(receipt.account_id,receipt.day_key);
    creditedByDay.set(key,(creditedByDay.get(key)||0)+1);
    const relevantEvents=eventsByRef.get(groupKey(receipt.account_id,receipt.idempotency_key))||[];
    const valid=relevantEvents.length===1&&n(relevantEvents[0].amount)===AMOUNT&&n(receipt.reward_amount)===AMOUNT;
    if(!valid){
      const issueKey='receipt:'+receipt.idempotency_key;
      issueMap.set(issueKey,{key:issueKey,account:receipt.account_id,day:receipt.day_key,category:'receipt_ledger_mismatch',expected:AMOUNT,actual:relevantEvents.length===1?n(relevantEvents[0].amount):0,details:'Confirmed receipt must have exactly one +5 StarCoin ledger entry'});
    }
  }
  for(const [key,group] of groups){
    const observed=creditedByDay.get(key)||0;
    // Legacy ShopLC versions created distinct click and reward IDs; exact one-to-one
    // assignment is impossible for old rows. Compare account/day totals instead.
    const expected=Math.min(DAILY,group.clicks.length),actual=Math.min(DAILY,observed);
    if(expected>actual){
      const issueKey='shortfall:'+key;
      issueMap.set(issueKey,{key:issueKey,account:group.account,day:group.day,category:'recorded_click_missing_credit',expected,actual,details:'Recorded eligible Buy/Bid click count exceeds credited receipts for this wallet on this Central day. Review unique clicks and item lookup failures before any manual payout.'});
    }
    if(observed>DAILY){
      const issueKey='excess:'+key;
      issueMap.set(issueKey,{key:issueKey,account:group.account,day:group.day,category:'daily_cap_exceeded',expected:DAILY,actual:observed,details:'Credited receipts exceed the configured three-per-day limit.'});
    }
  }
  // A valid ledger reward must never be orphaned from a confirmed receipt.
  for(const event of events){
    const receipt=receiptById.get(event.reference_id);
    if(receipt&&receipt.account_id===event.account_id&&receipt.credited_at!=null)continue;
    const issueKey='orphan:'+event.id;
    issueMap.set(issueKey,{key:issueKey,account:event.account_id,day:dayKey(n(event.created_at)),category:'orphan_reward_ledger_entry',expected:0,actual:n(event.amount),details:'Ledger records a ShopLC reward without a matching credited receipt.'});
  }
  const updates=[];
  for(const issue of issueMap.values()){
    updates.push(db.prepare("INSERT INTO shoplc_watch_findings(issue_key,account_id,day_key,category,expected,actual,status,first_seen_at,last_seen_at,details) VALUES (?1,?2,?3,?4,?5,?6,'OPEN',?7,?7,?8) ON CONFLICT(issue_key) DO UPDATE SET expected=excluded.expected,actual=excluded.actual,status='OPEN',last_seen_at=excluded.last_seen_at,details=excluded.details").bind(issue.key,issue.account,issue.day,issue.category,issue.expected,issue.actual,clock,issue.details));
  }
  // Close findings only if that account/day was reevaluated and the discrepancy vanished.
  // Never automatically close historical failures outside the scanning window.
  const currentIssueKeys=new Set(issueMap.keys());
  const open=await db.prepare("SELECT issue_key,account_id,day_key FROM shoplc_watch_findings WHERE status='OPEN' LIMIT 2000").all();
  const inspected=new Set([...groups.keys(),...receipts.filter(r=>r.credited_at!=null).map(r=>groupKey(r.account_id,r.day_key))]);
  for(const entry of open.results||[]){
    if(!inspected.has(groupKey(entry.account_id,entry.day_key))||currentIssueKeys.has(entry.issue_key))continue;
    updates.push(db.prepare("UPDATE shoplc_watch_findings SET status='RESOLVED',last_seen_at=?2 WHERE issue_key=?1 AND status='OPEN'").bind(entry.issue_key,clock));
  }
  for(let i=0;i<updates.length;i+=30)await db.batch(updates.slice(i,i+30));
  const openCount=await db.prepare("SELECT COUNT(*) AS count FROM shoplc_watch_findings WHERE status='OPEN'").first();
  const shortfallCoins=[...issueMap.values()].filter(v=>v.category==='recorded_click_missing_credit').reduce((total,v)=>total+AMOUNT*Math.max(0,v.expected-v.actual),0);
  const runId='shoplc-watch-'+clock;
  await db.prepare("INSERT INTO shoplc_watch_runs(run_id,started_at,completed_at,scanned_clicks,scanned_receipts,open_findings,shortfall_coins,truncated) VALUES (?1,?2,?3,?4,?5,?6,?7,?8)").bind(runId,clock,Date.now(),clicks.length,receipts.length,n(openCount?.count),shortfallCoins,truncated).run();
  // Account IDs and private transaction identifiers intentionally stay out of the logs.
  const report={runId,at:clock,scannedClicks:clicks.length,scannedReceipts:receipts.length,openFindings:n(openCount?.count),shortfallCoins,truncated:!!truncated};
  if(report.openFindings||truncated)console.error(JSON.stringify({event:'shoplc_reward_robot_attention',...report}));
  else console.log(JSON.stringify({event:'shoplc_reward_watch_healthy',...report}));
  return report;
}
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(request.method!=='GET'||!['/health','/v1/status'].includes(url.pathname))return json({ok:false,error:'not_found'},404);
    if(!env.DB)return json({ok:false,error:'ledger_binding_missing'},503);
    const latest=await env.DB.prepare("SELECT started_at,completed_at,scanned_clicks,scanned_receipts,open_findings,shortfall_coins,truncated FROM shoplc_watch_runs ORDER BY started_at DESC LIMIT 1").first().catch(()=>null);
    return json({ok:true,service:'shoplc-reward-watch',mode:'read-only-wallet-audit',schedule:'every 5 minutes',lastRun:latest?{at:latest.started_at,scannedClicks:latest.scanned_clicks,scannedReceipts:latest.scanned_receipts,openFindings:latest.open_findings,possibleShortfallCoins:latest.shortfall_coins,truncated:!!latest.truncated}:null});
  },
  async scheduled(controller,env,ctx){
    ctx.waitUntil(audit(env.DB).catch(error=>{
      console.error(JSON.stringify({event:'shoplc_reward_watch_failed',error:String(error?.message||error).slice(0,200)}));
    }));
  }
};