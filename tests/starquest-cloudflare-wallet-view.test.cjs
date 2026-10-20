'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const adapter = fs.readFileSync('js/infinity-wallet-integration.js','utf8');
const html = fs.readFileSync('index.html','utf8');

function fixture({token=true,mismatch=false,localMismatch=false}={}) {
  const elements = {};
  for (const id of ['unified-wallet-connect','unified-wallet-label','unified-wallet-detail','unified-wallet-status','cloud-unified-wallet-balances']) {
    elements[id] = {
      textContent:'',hidden:false,children:[],handlers:{},
      classList:{toggle(){}},
      addEventListener(name,fn){this.handlers[name]=fn},
      replaceChildren(){this.children=[]},
      appendChild(child){this.children.push(child)}
    };
  }
  function createElement() {
    return {textContent:'',children:[],append(...children){this.children.push(...children)}};
  }
  const listeners={};
  const document={
    visibilityState:'visible',
    getElementById:id=>elements[id]||null,
    createElement,
    addEventListener(name,fn){(listeners[name] ||= []).push(fn)}
  };
  const calls=[];
  const cloudToken='sq_'+'a'.repeat(43);
  const fetch=async (url,opts)=>{
    calls.push({url,opts});
    const isStar=url.includes('starquest-ledger');
    const result=isStar
      ? {ok:true,state:{username:'kris',starCoins:5,pendingShareCredits:3}}
      : {ok:true,user:{id:'account-verified',username:mismatch?'another-account':'kris'},
        balances:{STARCOIN:5.3,QUANT:30,INFINITY:126,MUSIC_QUANT:2000}};
    return {ok:true,json:async()=>result};
  };
  const window={
    StarQuestAuth:{currentUser:()=>({key:localMismatch?'another-account':'kris',username:'kris'})},
    QuantaCloudConnection:{ready:Promise.resolve(),resolveDeviceToken:async()=>token?cloudToken:''}
  };
  const location={href:'https://quantaphi.org/TV-Database/'};
  vm.runInNewContext(adapter,{window,document,location,fetch,AbortSignal,console,Date,Number,String,Promise});
  return {window,document,location,elements,calls,listeners};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));

test('StarQuest displays all four real assets from the same verified D1 account, not its local wallet',async()=>{
  const f=fixture(); await settle();
  assert.equal(f.window.StarQuestInfinityWallet.isConnected(),true);
  assert.match(f.elements['unified-wallet-label'].textContent,/Cloudflare verified/);
  assert.match(f.elements['unified-wallet-status'].textContent,/Live Cloudflare wallet verified for kris/);
  const cells=f.elements['cloud-unified-wallet-balances'].children;
  assert.equal(cells.length,4);
  assert.deepEqual(cells.map(e=>e.children[0].textContent),['StarCoins','Quants','Infinity','Music Quants']);
  assert.deepEqual(cells.map(e=>e.children[1].textContent.replaceAll(',','')),['5.3','30','126','2000']);
  assert.equal(f.calls.length,2);
  assert.ok(f.calls.every(call=>call.opts.headers.Authorization.startsWith('Bearer sq_')));
  f.elements['unified-wallet-connect'].handlers.click();
  assert.equal(f.location.href,'https://quantaphi.org/wallet-recovery.html?returnTo=%2FTV-Database%2F');
});

test('recovery is required after deleting cookies and local device credential',async()=>{
  const f=fixture({token:false}); await settle();
  assert.equal(f.window.StarQuestInfinityWallet.isConnected(),false);
  assert.equal(f.elements['cloud-unified-wallet-balances'].hidden,true);
  assert.equal(f.calls.length,0);
  f.elements['unified-wallet-connect'].handlers.click();
  assert.match(f.location.href,/wallet-recovery.html\?verify=1/);
});

test('a credential linked to a different StarQuest account is never treated as the same wallet',async()=>{
  const f=fixture({mismatch:true}); await settle();
  assert.equal(f.window.StarQuestInfinityWallet.isConnected(),false);
  assert.equal(f.elements['cloud-unified-wallet-balances'].hidden,true);
  assert.match(f.elements['unified-wallet-status'].textContent,/identity mismatch/);
});
test('a locally selected different StarQuest account is not silently overridden',async()=>{
  const f=fixture({localMismatch:true}); await settle();
  assert.equal(f.window.StarQuestInfinityWallet.isConnected(),false);
  assert.match(f.elements['unified-wallet-status'].textContent,/Different StarQuest account selected/);
});
test('the live .org page loads the cloud connection and never claims a local wallet is authoritative',()=>{
  assert.match(html,/https:\/\/quantaphi\.org\/cloud-wallet-client\.js/);
  assert.match(html,/QuantaCloudConnectionDisableAutoRecovery=true/);
  assert.match(html,/id="cloud-unified-wallet-balances"/);
  assert.doesNotMatch(adapter,/wallet\.syncSourceBalance\(/);
  assert.doesNotMatch(adapter,/wallet\.createWallet\(/);
});
