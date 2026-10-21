import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const src=readFileSync(new URL('../workers/fred-spaces-ledger/index.js',import.meta.url),'utf8');
const worker=(await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'))).default;
function database({verified=false}={}){
 const state={batches:[],queries:[],attempt:null};
 const db={
   prepare(sql){
     const p={sql,args:[],bind(...values){this.args=values;return this;},
       async run(){state.queries.push(this);return {meta:{changes:1}}},
       async first(){
         state.queries.push(this);
         if(sql.includes('JOIN account_devices'))return {id:'listener'};
         if(sql.includes('FROM media_star_owner_config'))return verified?{id:'platform-owner'}:null;
         if(sql.includes('FROM media_creator_payout_destinations'))return verified?{id:'platform-owner'}:null;
         if(sql.includes('FROM spaces_episode_unlocks'))return {attempt_id:state.attempt,charged_at:123};
         if(sql.includes('SELECT star_coins FROM accounts'))return {star_coins:3};
         return null;
       },
       async all(){return {results:[]}}
     };
     return p;
   },
   async batch(statements){
     state.batches.push(statements);
     const attempt=statements.find(p=>p.sql.includes('INSERT OR IGNORE INTO spaces_episode_unlocks'));
     if(attempt)state.attempt=attempt.args[2];
     return statements.map(()=>({meta:{changes:1}}));
   }
 };
 return {db,state};
}
function request(path='/v1/spaces/unlock',method='POST'){
 return new Request('https://fred.example'+path,{
   method,headers:{origin:'https://quantaphi.org',authorization:'Bearer sq_'+'a'.repeat(32),'content-type':'application/json'},
   ...(method==='POST'?{body:JSON.stringify({episodeId:'fred-0147'})}:{})
 });
}
test('no platform owner payout wallet: zero debits, zero receipts, fail closed',async()=>{
 const {db,state}=database(),r=await worker.fetch(request(),{DB:db});
 const data=await r.json();
 assert.equal(r.status,503);assert.equal(data.error,'owner_payout_not_configured');
 assert.equal(state.batches.length,0);
});
test('configured platform owner beneficiary: one batch with debit and paired creator credit',async()=>{
 const {db,state}=database({verified:true}),r=await worker.fetch(request(),{DB:db});
 const data=await r.json();
 assert.equal(data.ok,true);assert.equal(data.creatorPaid,true);assert.equal(data.recipient,'platform-owner');
 assert.equal(state.batches.length,1);
 const items=state.batches[0];
 const debit=items.find(p=>p.sql.includes("'spaces_episode_unlock',-1"));
 const credit=items.find(p=>p.sql.includes("'spaces_episode_owner_payout',1"));
 const deposit=items.find(p=>p.sql.includes('SET star_coins=star_coins+1'));
 assert.ok(debit&&credit&&deposit,'paired immutable receipts and creator deposit');
 assert.equal(deposit.args[1],'platform-owner');
 assert.equal(credit.args[2],'platform-owner');
 assert.equal(debit.args[4],credit.args[5],'debit and credit share one attempt reference');
 assert.ok(!src.includes("WHERE cfg.creator_key='fred-krueger'"),'third-party attribution cannot select the discovery payout');
});
test('public health advertises payment readiness only when configured platform owner destination exists',async()=>{
 const a=await worker.fetch(new Request('https://fred.example/health'),{DB:database().db});
 const b=await worker.fetch(new Request('https://fred.example/health'),{DB:database({verified:true}).db});
 assert.equal((await a.json()).paymentsReady,false);
 assert.equal((await b.json()).paymentsReady,true);
});
