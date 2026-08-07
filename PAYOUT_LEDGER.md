# StarQuest attribution and Infinity payout architecture

StarQuest now distinguishes product analytics from value settlement.

## What the interface counts

A native share that the device reports as completed advances the visible StarCoin cycle from 1/10 through 10/10. A canceled share does not advance. A copied link is useful intent metadata but does not count as a completed share. The current StarCoin is still a local prototype reward until authentication and the server ledger are deployed.

## What the database proves

The migration in `supabase/migrations/20260806_starquest_attribution_ledger.sql` stores:

- content and company attribution;
- view milestones and watched seconds;
- share lifecycle and verification state;
- immutable, deduplicated source events;
- each ten-share StarCoin mint cycle;
- company contracts with explicit Infinity rates;
- payout batches, lines, approval, transaction reference, and reversal status.

Raw views are valuable sales evidence, but they do not automatically become a payable event. A settlement line can only be created from an event covered by an active contract. Contracts should normally require a server-verified event such as a qualified 50% view, completed view, or verified share.

## Safe payout path

1. The browser submits an idempotent event with content and company attribution.
2. A server worker deduplicates it and verifies watch/share eligibility.
3. A nightly or monthly settlement job matches verified events to active contracts.
4. An operator reviews the human-readable company, event count, rate, total, and allowlisted payout address.
5. A separate signer or multisig sends actual Infinity.
6. The transaction reference is written back and the batch becomes `settled`.

The web page must never contain a treasury private key, seed phrase, service-role key, or unrestricted payout function. Company payout addresses must be verified and snapshotted into the approved batch.

## Next deployment work

- Connect Supabase Auth so events have stable user IDs.
- Add content/company IDs to the catalogue.
- Deploy the event-ingestion and verification server functions.
- Define signed contracts and Infinity rates per qualified event.
- Add a protected settlement dashboard and multisig signer integration.
- Backfill old analytics only as historical, unverified events; never silently classify them as payable.
