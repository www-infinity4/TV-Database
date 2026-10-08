const ORIGINS=new Set(["https://quantaphi.org","https://www.quantaphi.org","https://www-infinity4.github.io"]);
const PAID=new Set(["fred-0147","fred-0298","fred-0555","fred-0888"]);
function reply(body,status,origin){return new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json","cache-control":"no-store",...(origin?{"access-control-allow-origin":origin,"vary":"Origin"}:{})}})}
async function userOf(request,db){const auth=/^Bearer\\s+(sq_[A-Za-z0-9_-]{32,})$/.exec(request.headers.get("authorization")||"");if(!auth)return null;const hash=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(auth[1]));const hex=Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,"0")).join("");return db.prepare("SELECT a.id FROM accounts a JOIN account_devices d ON d.account_id=a.id WHERE d.token_hash=?").bind(hex).first();}
async function ensure(db){return db.prepare("CREATE TABLE IF NOT EXISTS spaces_episode_unlocks(account_id TEXT NOT NULL REFERENCES accounts(id),episode_id TEXT NOT NULL,attempt_id TEXT NOT NULL,charged_at INTEGER,created_at INTEGER NOT NULL,PRIMARY KEY(account_id,episode_id))").run();}
export default {async fetch(request,env){
 const u=new URL(request.url),origin=request.headers.get("origin")||"",cors=ORIGINS.has(origin)?origin:"";
 if(request.method==="OPTIONS")return new Response(null,{status:cors?204:403,headers:{"access-control-allow-origin":cors,"access-control-allow-headers":"authorization,content-type","access-control-allow-methods":"GET,POST,OPTIONS"}});
 if(origin&&!cors)return reply({ok:false,error:"origin_not_allowed"},403);
 if(u.pathname==="/health")return reply({ok:true,service:"fred-spaces-ledger",authoritative:"starquest D1"},200,cors);
 if(!["/v1/spaces/unlocks","/v1/spaces/unlock"].includes(u.pathname))return reply({ok:false,error:"not_found"},404,cors);
 try{
 const user=await userOf(request,env.DB);
 if(!user)return reply({ok:false,error:"authorization_required"},401,cors);
 await ensure(env.DB);
 if(request.method==="GET"&&u.pathname==="/v1/spaces/unlocks"){
 const rows=await env.DB.prepare("SELECT episode_id FROM spaces_episode_unlocks WHERE account_id=? AND charged_at IS NOT NULL ORDER BY charged_at DESC").bind(user.id).all();
 const balance=await env.DB.prepare("SELECT star_coins FROM accounts WHERE id=?").bind(user.id).first();
 return reply({ok:true,unlocked:(rows.results||[]).map(x=>x.episode_id),starCoins:balance?.star_coins??0},200,cors);
 }
 if(request.method!=="POST"||u.pathname!=="/v1/spaces/unlock")return reply({ok:false,error:"method_not_allowed"},405,cors);
 if(!request.headers.get("content-type")?.includes("application/json"))return reply({ok:false,error:"json_required"},415,cors);
 const body=await request.json().catch(()=>null),episodeId=String(body?.episodeId||"");
 if(!PAID.has(episodeId))return reply({ok:false,error:"episode_not_billable"},400,cors);
 const now=Date.now(),attempt=crypto.randomUUID();
 await env.DB.batch([
 env.DB.prepare("INSERT OR IGNORE INTO spaces_episode_unlocks(account_id,episode_id,attempt_id,created_at) SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM accounts WHERE id=? AND star_coins>=1)").bind(user.id,episodeId,attempt,now,user.id),
 env.DB.prepare("UPDATE accounts SET star_coins=star_coins-1,updated_at=? WHERE id=? AND star_coins>=1 AND EXISTS(SELECT 1 FROM spaces_episode_unlocks WHERE account_id=? AND episode_id=? AND attempt_id=? AND charged_at IS NULL)").bind(now,user.id,user.id,episodeId,attempt),
 env.DB.prepare("UPDATE spaces_episode_unlocks SET charged_at=? WHERE account_id=? AND episode_id=? AND attempt_id=? AND charged_at IS NULL AND changes()=1").bind(now,user.id,episodeId,attempt),
 env.DB.prepare("INSERT INTO ledger_events(id,account_id,event_type,amount,balance,progress_to_next_coin,shares_per_coin,reference_id,content_id,created_at) SELECT ?,a.id,'spaces_episode_unlock',-1,a.star_coins,a.pending_share_credits,10,u.attempt_id,u.episode_id,? FROM spaces_episode_unlocks u JOIN accounts a ON a.id=u.account_id WHERE u.account_id=? AND u.episode_id=? AND u.attempt_id=? AND u.charged_at=?").bind(crypto.randomUUID(),now,user.id,episodeId,attempt,now),
 env.DB.prepare("DELETE FROM spaces_episode_unlocks WHERE account_id=? AND episode_id=? AND attempt_id=? AND charged_at IS NULL").bind(user.id,episodeId,attempt)
 ]);
 const [r,b]=await Promise.all([env.DB.prepare("SELECT attempt_id,charged_at FROM spaces_episode_unlocks WHERE account_id=? AND episode_id=?").bind(user.id,episodeId).first(),env.DB.prepare("SELECT star_coins FROM accounts WHERE id=?").bind(user.id).first()]);
 if(!r?.charged_at)return reply({ok:false,error:"insufficient_star_coins",message:"Earn 1 full StarCoin to unlock another episode."},409,cors);
 return reply({ok:true,episodeId,charged:r.attempt_id===attempt?1:0,alreadyUnlocked:r.attempt_id!==attempt,starCoins:b?.star_coins??0},200,cors);
 }catch(error){console.error(error);return reply({ok:false,error:"ledger_unavailable",message:"Charge not confirmed; try again."},503,cors)}
 }};
