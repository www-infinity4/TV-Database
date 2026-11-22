'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

function harness(mode) {
 const calls=[],events=[];
 const user={key:'example-user',passwordHash:'a'.repeat(64),tokens:3,pendingShareCredits:2,shareCount:12,shareEvents:[],watchHistory:[]};
 const document={
  addEventListener(){},
  dispatchEvent(e){events.push({type:e.type,detail:e.detail});}
 };
 const cloudState={username:'example-user',starCoins:3};
 const client={
  document,STARQUEST_LEDGER_CONFIG:{endpoint:'https://ledger.example'},
  StarQuestAuth:{currentUser:()=>user,applyCloudState(){},getHistory:()=>[]},
  localStorage:{getItem:()=> 'sq_'+'z'.repeat(43),setItem(){throw Error('unexpected token reset')}},
  crypto:{getRandomValues(b){b.fill(1)}},
  setTimeout,clearTimeout,
  fetch:async url=>{
   const path=String(url);calls.push(path);
   if(path.endsWith('/v1/state')){
    if(mode==='offline')throw Error('network unreachable');
    if(mode==='outage')return {ok:false,status:503,json:async()=>({ok:false,error:'D1_ERROR',message:'Temporary database failure'})};
    if(mode==='wrong-user')return {ok:true,status:200,json:async()=>({ok:true,state:{username:'another-user'}})};
    if(mode==='unauthorized')return {ok:false,status:401,json:async()=>({ok:false,error:'invalid_device_token'})};
    if(mode==='healthy')return {ok:true,status:200,json:async()=>({ok:true,state:cloudState})};
   }
   if(path.endsWith('/v1/bootstrap'))return {ok:true,status:200,json:async()=>({ok:true,importedLocalState:false,state:cloudState})};
   throw Error('unexpected request: '+path);
  }
 };
 client.window=client;
 vm.runInNewContext(fs.readFileSync('js/starquest-cloud-ledger.js','utf8'),{window:client,document,CustomEvent:class CustomEvent{constructor(type,opts){this.type=type;this.detail=opts?.detail}}});
 return {client,calls,events,user};
}

(async()=>{
 for(const mode of ['outage','offline','wrong-user']){
  const {client,calls,events,user}=harness(mode);
  const result=await client.StarQuestCloudLedger.connect();
  assert.equal(result,false,mode+': temporary outage or mismatched identity must not connect');
  assert.equal(calls.filter(x=>x.endsWith('/v1/bootstrap')).length,0,mode+': never attempt registration');
  assert.equal(user.tokens,3,mode+': preserve existing balance snapshot');
  assert.ok(events.some(x=>x.type==='starquest:ledger-error'),mode+': report a retryable connection failure');
 }
 const known=harness('healthy');
 assert.equal(await known.client.StarQuestCloudLedger.connect(),true,'known token recovers');
 assert.equal(known.calls.filter(x=>x.endsWith('/v1/bootstrap')).length,0,'healthy token bypasses bootstrap');
 const newDevice=harness('unauthorized');
 assert.equal(await newDevice.client.StarQuestCloudLedger.connect(),true,'invalid device token retains existing bootstrap path');
 assert.equal(newDevice.calls.filter(x=>x.endsWith('/v1/bootstrap')).length,1,'401 can bootstrap');
 console.log('ledger outage, network failure, identity mismatch, recovery and bootstrap: pass');
})().catch(e=>{console.error(e);process.exitCode=1;});
