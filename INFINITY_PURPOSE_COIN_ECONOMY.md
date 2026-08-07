# Infinity purpose-coin economy

## Core flow

StarQuest attention data creates an attributable event, not money by itself. A signed company contract defines which verified events qualify and what Infinity settlement amount is owed. That creates a transparent path:

`verified view/share → company Infinity settlement → contracted compensation → participant wallet → purpose coin or merchant purchase`

Examples include Paramount receiving Infinity settlement credits for qualified Paramount content; an actor receiving contracted compensation; and a merchant accepting Infinity under a direct merchant agreement. An actor, worker, vendor, or producer can sponsor a separate purpose coin when it has published issuance and redemption terms.

## Asset roles

- **Infinity:** the network settlement asset used between approved accounts.
- **StarCoin:** StarQuest participation/reward accounting. It is not silently interchangeable with company settlement funds.
- **Company coin:** issued by an enrolled company for its defined products or programs.
- **Actor coin:** a participant or production-access asset whose terms could include booking, membership, voting, merchandise, or another specific benefit.
- **Worker coin:** a role-specific compensation or benefits asset, such as a sandwich-artist program.
- **Vendor coin:** usable for contracted supplies or vendor settlement.
- **Product coin:** released for a specific completed product, service, production, or collection.

A name alone creates no financial promise. Every asset needs an issuer, purpose, supply rule, transfer rule, redemption terms, and activation approval.

## Conversion rules

Conversion never rewrites one coin into another in place. It posts a balanced transaction:

1. Debit the holder's source-asset account.
2. Credit the source treasury or escrow.
3. Debit the destination treasury or escrow.
4. Credit the holder's destination-asset account.

The conversion policy records the rate, fee, effective dates, contract requirements, compliance requirements, and version. This preserves an audit trail from company attention through compensation and later product creation.

## Merchant checkout

A Subway-type merchant can opt in through `merchant_asset_acceptance`. Checkout shows:

- the accepted asset;
- the exact amount and applicable conversion policy;
- what the customer receives;
- whether the merchant keeps Infinity or redeems into another contracted asset;
- a final human-readable confirmation.

Acceptance is contractual and voluntary. It must not be described as Apple Pay integration unless an actual wallet/payment-rail integration exists.

## Cash conversion boundary

GitHub stores and reviews the software; it does not hold funds or exchange assets. ChatGPT can help design and audit the software; it does not custody assets or execute conversions. Any exchange between Infinity and dollars or other cash requires an approved financial/off-ramp provider, identity and sanctions controls where applicable, tax records, and reviewed legal terms.

## Implementation state

The database now supports the registry, double-entry accounts and postings, conversion policies/orders, product releases, merchant acceptance, and compensation allocations. It intentionally gives browsers read-only access to balances and public terms. Server functions, compliance decisions, contracts, custody, merchant onboarding, and real transfers remain deployment work.
