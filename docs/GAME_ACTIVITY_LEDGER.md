# StarQuest game activity and rights ledger

## Viewer reward contract

A qualifying game session produces a client receipt worth **0.05 StarCoin** after five minutes of play. A confirmed native share or successful copied game link produces a separate **0.05 StarCoin** receipt. Twenty half-credit receipts mint one whole StarCoin.

Each receipt is idempotent per game, activity kind, viewer device, and UTC day. Client receipts are visible prototypes; server-authoritative settlement requires the StarQuest ledger worker to accept the same fractional activity schema.

## Source admission

Search & Deploy accepts a ROM only when the Internet Archive item:

- is public and unrestricted;
- exposes a direct file matching the selected emulator system;
- includes Creative Commons, public-domain, homebrew, freeware, open-source, or explicit redistribution evidence;
- is not marked as a demo, sample, BIOS, or private file.

Archive hosting alone is not treated as publisher permission.

## Rights-holder settlement

Game play/share receipts record `payoutStatus: pending_contract_settlement`. They do not claim Nintendo, Sony, Sega, a developer, or any other party has been paid. A real payout requires a verified rights owner, an active event-rate contract, server deduplication, an approved payout batch, and a transaction reference.
