'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../workers/shoplc-reward-watch/worker.js'),'utf8');
async function moduleCode(){return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))}
test('ShopLC watcher differentiates exact, pending, legacy and missing reward records',async()=>{
 const {signalStatus,receiptStatus}=await moduleCode();
 const base={click_id:'shoplc-click-a',reward_key:'shoplc-click-a',reward_credit_at:100,ledger_id:'event-a',ledger_amount:5,reward_amount:5};
 assert.equal(signalStatus(base),'delivered');
 assert.equal(signalStatus({...base,ledger_id:null}),'receipt_no_ledger');
 assert.equal(signalStatus({...base,ledger_amount:1}),'wrong_amount');
 assert.equal(signalStatus({...base,ledger_count:2,ledger_amount:10}),'duplicate_ledger');
 assert.equal(signalStatus({...base,reward_credit_at:null}),'receipt_pending');
 assert.equal(signalStatus({...base,reward_key:null}),'missing_receipt');
 assert.equal(signalStatus({...base,click_id:'shoplc-signal-older',reward_key:null}),'legacy_unlinked');
 assert.equal(receiptStatus(base),'delivered');
 assert.equal(receiptStatus({...base,ledger_id:null}),'receipt_no_ledger');
 assert.equal(receiptStatus({...base,ledger_count:2}),'duplicate_ledger');
 assert.equal(receiptStatus({...base,reward_credit_at:null}),'receipt_pending');
});
test('five-minute watcher matches account and exact click, not username or browser balances',async()=>{
 const {check}=await moduleCode();
 const now=1791700000000,queries=[],writes=[];
 const signals=[
  {click_id:'shoplc-click-paid',account_id:'internal-a',action_type:'buy',item_id:'product:111',created_at:now-200000,reward_key:'shoplc-click-paid',reward_credit_at:now-190000,ledger_id:'ledger-a',ledger_amount:5,reward_amount:5},
  {click_id:'shoplc-click-unpaid',account_id:'internal-a',action_type:'buy',item_id:'product:222',created_at:now-200000,reward_key:null},
  {click_id:'shoplc-signal-old',account_id:'internal-b',action_type:'buy',item_id:'product:333',created_at:now-200000,reward_key:null}
 ];
 const receipts=[{reward_key:'shoplc-click-paid',account_id:'internal-a',reward_credit_at:now-190000,ledger_id:'ledger-a',ledger_amount:5,reward_amount:5}];
 const db={prepare(sql){
  queries.push(sql);
  let params=[];
  const op={
   bind(...args){params=args;return op},
   async all(){
    if(sql.includes('FROM shoplc_click_signals s'))return{results:signals};
    if(sql.includes('FROM shoplc_reward_receipts r LEFT JOIN ('))return{results:receipts};
    if(sql.includes('FROM ledger_events l LEFT JOIN shoplc_reward_receipts r'))return{results:[]};
    if(sql.includes('HAVING COUNT(*) > 3'))return{results:[]};
    throw Error('Unknown read-only query '+sql.slice(0,90))
   },
   async run(){writes.push({sql,params});return{success:true}}
  };return op
 }};
 const old=console.log;console.log=()=>{};
 let result;try{result=await check({DB:db},now)}finally{console.log=old}
 assert.equal(result.signals,3);
 assert.equal(result.receipts,1);
 assert.equal(result.counts.delivered,1,'single paid click not counted twice');
 assert.equal(result.counts.missing_receipt,1);
 assert.equal(result.counts.legacy_unlinked,1);
 assert.equal(result.flagged,1,'only verified modern missing payout is actionable');
 assert.equal(result.historicalReview,1,'older unmatched click remains visible but is not automatically unpaid');
 assert.ok(queries.some(sql=>sql.includes('r.idempotency_key=s.idempotency_key')&&sql.includes('r.account_id=s.account_id')));
 assert.ok(queries.some(sql=>sql.includes('l.account_id=r.account_id')&&sql.includes('l.reference_id=r.idempotency_key')));
 assert.ok(queries.some(sql=>sql.includes('COUNT(*) AS ledger_count')&&sql.includes('GROUP BY account_id,reference_id')),'duplicate ledger rows are counted rather than hidden');
 assert.ok(writes.some(x=>x.params[0]==='signal:shoplc-click-unpaid'&&x.params[2]==='missing_receipt'));
 assert.ok(writes.some(x=>x.params[0]==='signal:shoplc-signal-old'&&x.params[2]==='legacy_unlinked'));
 assert.ok(!queries.some(sql=>/UPDATE accounts|INSERT INTO ledger_events|SET star_coins/i.test(sql)),'watcher must never change coin balances');
});
test('no public user account ids or device tokens in health response',async()=>{
 const {default:worker}=await moduleCode();
 const db={prepare(sql){return{
  async run(){return{}},
  async first(){return{checked_at:200,signals:1,receipts:0,flagged:1,counts_json:'{"missing_receipt":1}'}}
 }}};
 const resp=await worker.fetch(new Request('https://observer.example/health'),{DB:db});
 const body=await resp.json();
 assert.equal(resp.status,200);
 assert.equal(body.auditOnly,true);
 assert.equal(body.run.counts.missing_receipt,1);
 assert.doesNotMatch(JSON.stringify(body),/account_id|username|deviceToken|secret|internal-a/);
 assert.equal((await worker.fetch(new Request('https://observer.example/private'),{DB:db})).status,404);
});

test('all-legacy unmatched clicks do not trigger false missing-payout alarms',async()=>{
 const {check}=await moduleCode();
 const now=1791700000000;
 const log=console.log;console.log=()=>{};
 const db={prepare(sql){const self={bind(){return self},async run(){return{}},async all(){
   if(sql.includes('FROM shoplc_click_signals s'))return{results:[{click_id:'shoplc-signal-old-a',account_id:'a',item_id:'product:1234',action_type:'buy',created_at:now-180000,reward_key:null}]};
   if(sql.includes('FROM shoplc_reward_receipts r LEFT JOIN (')||sql.includes('FROM ledger_events l LEFT JOIN shoplc_reward_receipts r')||sql.includes('HAVING COUNT(*) > 3'))return{results:[]};
   throw Error('Unexpected query');
  }};return self}};
 let result;try{result=await check({DB:db},now)}finally{console.log=log}
 assert.equal(result.counts.legacy_unlinked,1);
 assert.equal(result.historicalReview,1);
 assert.equal(result.flagged,0);
});
