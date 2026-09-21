type Env={DB:D1Database}; type J=Record<string,unknown>;
const ORIGINS=new Set(["https://www-infinity4.github.io","http://localhost:8000","http://127.0.0.1:8000"]);
const cors=(r:Request)=>({"Access-Control-Allow-Origin":ORIGINS.has(r.headers.get("Origin")||"")?r.headers.get("Origin")!:"https://www-infinity4.github.io","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Cache-Control":"no-store","Vary":"Origin"});
const json=(r:Request,x:unknown,s=200)=>Response.json(x,{status:s,headers:cors(r)});
const clean=(x:unknown,n=2000)=>String(x??"").trim().slice(0,n);
const list=(x:unknown)=>Array.isArray(x)?x.map(v=>clean(v,120)).filter(Boolean).slice(0,40):[];
const words=(x:string)=>[...new Set(x.toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(w=>w.length>2))];
async function body(r:Request){return await r.json<J>()}
async function upsert(r:Request,e:Env){
 const b=await body(r),now=Date.now(),tokenId=clean(b.tokenId,180),id=clean(b.id,220)||("asset_"+crypto.randomUUID()),query=clean(b.query,1000);
 if(!tokenId)return json(r,{ok:false,error:"token_required"},400);
 const intent=list(b.intent),tags=[...new Set([...list(b.tags),...words(query),...words(clean(b.title,300)),...words(clean(b.description,1000))])].slice(0,40);
 await e.DB.batch([
  e.DB.prepare("INSERT INTO tokens(id,query,holder_id,created_at,updated_at) VALUES(?1,?2,?3,?4,?4) ON CONFLICT(id) DO UPDATE SET query=excluded.query,holder_id=COALESCE(excluded.holder_id,tokens.holder_id),updated_at=excluded.updated_at").bind(tokenId,query,clean(b.holderId,180)||null,now),
  e.DB.prepare("INSERT INTO assets(id,token_id,holder_id,type,title,description,intent_json,tags_json,url,html,provenance_json,reuse_count,created_at,updated_at) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,0,?12,?12) ON CONFLICT(id) DO UPDATE SET title=excluded.title,description=excluded.description,intent_json=excluded.intent_json,tags_json=excluded.tags_json,url=excluded.url,html=excluded.html,provenance_json=excluded.provenance_json,updated_at=excluded.updated_at").bind(id,tokenId,clean(b.holderId,180)||null,clean(b.type,80)||"code-build",clean(b.title,300),clean(b.description,2000),JSON.stringify(intent),JSON.stringify(tags),clean(b.url,2000)||null,clean(b.html,200000)||null,JSON.stringify(b.provenance||{}),now)
 ]); return json(r,{ok:true,id,tokenId,tags});
}
async function search(r:Request,e:Env){
 const u=new URL(r.url),q=clean(u.searchParams.get("q"),1000),dest=clean(u.searchParams.get("token"),180),wanted=words(q).slice(0,16);
 const rows=await e.DB.prepare("SELECT id,token_id,holder_id,type,title,description,intent_json,tags_json,url,html,reuse_count,created_at FROM assets WHERE token_id<>?1 ORDER BY reuse_count DESC,updated_at DESC LIMIT 250").bind(dest||"__none__").all<any>();
 const scored=rows.results.map(a=>{const hay=(a.title+" "+a.description+" "+a.tags_json+" "+a.intent_json).toLowerCase();const score=wanted.reduce((n,w)=>n+(hay.includes(w)?1:0),0);return{...a,score,tags:JSON.parse(a.tags_json||"[]"),intent:JSON.parse(a.intent_json||"[]")}}).filter(a=>a.score>0).sort((a,b)=>b.score-a.score||b.reuse_count-a.reuse_count).slice(0,20);
 return json(r,{ok:true,query:q,results:scored});
}
async function reuse(r:Request,e:Env){
 const b=await body(r),assetId=clean(b.assetId,220),dest=clean(b.destinationTokenId,180);if(!assetId||!dest)return json(r,{ok:false,error:"asset_and_destination_required"},400);
 const a=await e.DB.prepare("SELECT id,token_id,holder_id FROM assets WHERE id=?1").bind(assetId).first<any>();if(!a)return json(r,{ok:false,error:"asset_not_found"},404);if(a.token_id===dest)return json(r,{ok:true,reused:false,reason:"same_token"});
 const id="reuse_"+assetId+"_"+dest,now=Date.now();
 const result=await e.DB.batch([
  e.DB.prepare("INSERT OR IGNORE INTO asset_reuses(id,asset_id,source_token_id,destination_token_id,source_holder_id,star_coin_amount,created_at) VALUES(?1,?2,?3,?4,?5,1,?6)").bind(id,assetId,a.token_id,dest,a.holder_id,now),
  e.DB.prepare("UPDATE assets SET reuse_count=reuse_count+1,updated_at=?2 WHERE id=?1 AND EXISTS(SELECT 1 FROM asset_reuses WHERE id=?3 AND created_at=?2)").bind(assetId,now,id)
 ]);
 const credited=Number(result[0].meta.changes||0)===1;
 return json(r,{ok:true,reused:credited,duplicate:!credited,starCoinCredit:credited?1:0,sourceTokenId:a.token_id,sourceHolderId:a.holder_id});
}
async function route(r:Request,e:Env){const u=new URL(r.url);if(r.method==="OPTIONS")return new Response(null,{status:204,headers:cors(r)});if(r.method==="GET"&&u.pathname==="/health")return json(r,{ok:true,service:"infinity-assets"});if(r.method==="GET"&&u.pathname==="/v1/assets/search")return search(r,e);if(r.method==="POST"&&u.pathname==="/v1/assets")return upsert(r,e);if(r.method==="POST"&&u.pathname==="/v1/assets/reuse")return reuse(r,e);return json(r,{ok:false,error:"not_found"},404)}
export default {async fetch(r:Request,e:Env){try{return await route(r,e)}catch(err){console.error(err);return json(r,{ok:false,error:"server_error"},500)}}} satisfies ExportedHandler<Env>;
