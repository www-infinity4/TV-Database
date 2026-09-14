import assert from 'node:assert/strict';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

const workerUrl=pathToFileURL(new URL('../services/rogers-consensus/worker/cloudflare-index.js',import.meta.url).pathname);
const {default:worker}=await import(workerUrl.href);
const origin='https://www-infinity4.github.io';

test('/v1/chat always uses OpenAI',async()=>{
  const originalFetch=globalThis.fetch;
  let called='';
  globalThis.fetch=async(url)=>{
    called=String(url);
    return Response.json({output:[{content:[{type:'output_text',text:'GATEWAY OK'}]}]});
  };
  try{
    const response=await worker.fetch(new Request('https://infinity-rogers.marvaseater.workers.dev/v1/chat',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify({input:'test'})}),{OPENAI_API_KEY:'test-key'});
    assert.equal(response.status,200);
    const body=await response.json();
    assert.equal(body.provider,'openai');
    assert.equal(body.output_text,'GATEWAY OK');
    assert.match(called,/api\.openai\.com\/v1\/responses/);
  }finally{globalThis.fetch=originalFetch;}
});

test('/v1/reason falls back to OpenAI when Anthropic is absent',async()=>{
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async()=>Response.json({output:[{content:[{type:'output_text',text:'COSMO OK'}]}]});
  try{
    const response=await worker.fetch(new Request('https://infinity-rogers.marvaseater.workers.dev/v1/reason',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify({input:'test'})}),{OPENAI_API_KEY:'test-key'});
    assert.equal(response.status,200);
    const body=await response.json();
    assert.equal(body.provider,'openai-fallback');
    assert.equal(body.output_text,'COSMO OK');
  }finally{globalThis.fetch=originalFetch;}
});

test('/share/card exposes exact card metadata to social crawlers',async()=>{
  const target='https://www-infinity4.github.io/Omni-Phi/overview/?q=Hydrogen';
  const image='https://www-infinity4.github.io/Omni-Phi/assets/omni-phi-index-wide.jpg?v=2';
  const requestUrl=new URL('https://infinity-rogers.marvaseater.workers.dev/share/card');
  requestUrl.search=new URLSearchParams({
    title:'Hydrogen source card',
    body:'Exact source-backed card copy for the preview.',
    image,
    domain:'wikipedia.org',
    target,
  }).toString();
  const response=await worker.fetch(new Request(requestUrl),{});
  assert.equal(response.status,200);
  assert.match(response.headers.get('content-type')||'',/text\/html/);
  const html=await response.text();
  assert.match(html,/property="og:title" content="Hydrogen source card"/);
  assert.match(html,/name="twitter:card" content="summary_large_image"/);
  assert.match(html,/Exact source-backed card copy for the preview\./);
  assert.match(html,/www-infinity4\.github\.io\/Omni-Phi\/overview/);
});

test('/health exposes path routing and secret state',async()=>{
  const response=await worker.fetch(new Request('https://infinity-rogers.marvaseater.workers.dev/health'),{OPENAI_API_KEY:'configured'});
  assert.equal(response.status,200);
  const body=await response.json();
  assert.equal(body.openaiConfigured,true);
  assert.equal(body.routes['/share/card'],'public-exact-phi-social-preview');
  assert.equal(body.routes['/v1/chat'],'openai-gpt');
  assert.equal(body.routes['/v1/reason'],'openai-cosmo-fallback');
});
