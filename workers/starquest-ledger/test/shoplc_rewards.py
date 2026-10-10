import sqlite3,re,pathlib
source=(pathlib.Path(__file__).resolve().parents[1]/'src'/'index.ts').read_text()
assert re.search(r'SHOPLC_REWARD_AMOUNT\s*=\s*5\b',source)
assert re.search(r'SHOPLC_DAILY_REWARD_LIMIT\s*=\s*3\b',source)
assert 'America/Chicago' in source
section=source[source.index('async function saveShopLcReward'):]
queries=re.findall(r'env.DB.prepare\(\s*`([^`]+)`',section)[:4]
assert len(queries)==4
db=sqlite3.connect(':memory:')
db.executescript('''CREATE TABLE accounts(id TEXT PRIMARY KEY,star_coins INTEGER,pending_share_credits INTEGER,updated_at INTEGER);
CREATE TABLE shoplc_reward_receipts(idempotency_key TEXT UNIQUE,receipt_id TEXT,account_id TEXT,item_key TEXT,action_type TEXT,quant_id TEXT,href TEXT,reward_amount INTEGER,day_key TEXT,created_at INTEGER,credited_at INTEGER,UNIQUE(account_id,item_key));
CREATE TABLE ledger_events(id TEXT,account_id TEXT,event_type TEXT,amount INTEGER,balance INTEGER,progress_to_next_coin INTEGER,shares_per_coin INTEGER,reference_id TEXT,content_id TEXT,company_id TEXT,actors_json TEXT,attribution_status TEXT,payout_status TEXT,created_at INTEGER);
INSERT INTO accounts VALUES('a',0,8,0);INSERT INTO accounts VALUES('b',0,0,0);''')
def reward(click,item,day='2026-10-10',account='a'):
 with db:
  db.execute(queries[0],(click,'receipt-'+click,account,item,'buy','quant','https://www.shoplc.com/',5,day,100,3))
  updated=db.execute(queries[1],(account,click,5,100)).rowcount
  db.execute(queries[2],('ledger-'+click,account,click,5,100))
  db.execute(queries[3],(account,click,100))
 return updated
assert reward('c1','item1')==1
assert reward('c1','item1')==0
assert reward('c2','item1')==0
assert reward('c3','item2')==1
assert reward('c4','item3')==1
assert reward('c5','item4')==0
assert db.execute("SELECT star_coins,pending_share_credits FROM accounts WHERE id='a'").fetchone()==(15,8)
assert reward('c6','item4','2026-10-11')==1
assert reward('c7','item1','2026-10-11')==0
assert reward('c8','item1',account='b')==1
assert db.execute('SELECT COUNT(*) FROM ledger_events').fetchone()[0]==5
print('PASS: +5 full coins; 3/day; retry idempotency; once per item; next day; independent accounts; fractional progress preserved')
