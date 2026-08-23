# StarQuest Cloud Ledger

This Worker makes Cloudflare D1 authoritative for StarCoins, 1/10 share progress,
share receipts, attribution metadata, and watch history. Browser storage remains
an offline cache only.

The first successful connection imports the signed-in browser's current balance,
including `kris` at 4/10, and existing history. Later requests use a random
per-device bearer token. A one-way proof derived from the StarQuest password
permits another device to join the same account; the password itself is never
sent to Cloudflare.

## Deploy

From this directory after authorizing Wrangler:

1. `npm install`
2. `npm run check`
3. `npm run deploy` (Wrangler automatically provisions the `starquest-ledger` D1 binding.)
4. `npm run migrate:remote`
5. Put the returned `https://...workers.dev` URL in `js/starquest-ledger-config.js`.
6. Open StarQuest on the Android device while signed in as `kris`. Its local
   4/10 and existing history are imported once, then every new share/history
   update is written to D1.

`payout_status` is deliberately `pending_server_review`. A share receipt is a
durable accounting record, not automatic proof that money is owed or payable.
