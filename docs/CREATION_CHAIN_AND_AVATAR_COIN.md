# Creation Chain and Avatar Coin

## Purpose

The creation chain is the public history of user-built entertainment worlds, themes, companion identities, layouts, fonts, titles, shelves, and other editable design choices.

It lets people discover, open, use, remix, and improve each other's creations while preserving attribution and version history.

## Main interface

The creations area should show:

1. The five most recently published creations.
2. A continuously scrollable list of all public creations.
3. Search by creator, world name, theme, category, companion name, tag, or version.
4. Filters for newest, most used, most shared, most remixed, and most improved.
5. A detailed creation page with version history, creator attribution, usage activity, and remix ancestry.

## Creation record

Each published design must have a permanent creation ID separate from its editable display name.

```json
{
  "creationId": "creation_01J...",
  "worldId": "world_01J...",
  "creatorId": "user_01J...",
  "displayName": "Moon Dust",
  "version": 4,
  "parentCreationId": null,
  "remixOf": null,
  "publishedAt": 0,
  "updatedAt": 0,
  "theme": "moonDust",
  "font": "editorial",
  "companionName": "Luna",
  "focus": "space films and science fiction",
  "tags": ["space", "film", "science fiction"],
  "usage": {
    "uniqueUsers": 0,
    "verifiedSessions": 0,
    "verifiedUseSeconds": 0,
    "shares": 0,
    "remixes": 0
  }
}
```

## Firing Star shares

A creator gains Firing Star share progress when other verified users actually use the creator's design.

A qualifying use should require:

- A different verified user than the creator.
- The design was actively applied, not merely previewed.
- A minimum meaningful use period.
- Visible interaction with the world, such as watching, searching, opening a shelf, using the companion, or visiting a connected creation.
- Duplicate and automated traffic protections.

The same user should not generate unlimited share progress by repeatedly reopening the same design.

## Avatar Coin

One Avatar Coin is earned when another verified user keeps a creator's design actively applied for 24 continuous hours of qualified use.

The continuous-use clock pauses or resets when the design is no longer actively applied, the session becomes idle beyond policy limits, or integrity checks fail. A later economy policy may define a limited reconnection grace period without changing the 24-hour continuous-use requirement.

Watching a page remain idle in a hidden browser tab does not count. Qualified time should stop when:

- The page is hidden for an extended period.
- The user is inactive beyond the allowed idle window.
- Playback or interaction has stopped.
- The session fails integrity checks.
- The user is the creator using their own design.

### Recommended ledger event

```json
{
  "eventId": "avatar_use_01J...",
  "creationId": "creation_01J...",
  "creatorId": "user_01J...",
  "usingUserId": "user_01K...",
  "qualifiedSeconds": 900,
  "continuousSessionId": "continuous_01J...",
  "integrity": "verified",
  "createdAt": 0
}
```

When one verified continuous-use session reaches 86,400 qualified seconds, one Avatar Coin is minted for the creator and that completed session is closed in the ledger.

## Avatar Coin as a business signal

Avatar Coin is intended to represent a creator reaching a serious level of sustained use, not a casual click or popularity badge.

A creator who earns Avatar Coins has demonstrated that other people did more than view the design. They actively lived inside that creator's entertainment world for a long, verified period. This makes the creator potentially useful to studios, distributors, advertisers, production companies, and other businesses that need trusted audience-building talent.

The intended progression is:

```text
User creates a world
  -> other users apply it
  -> verified use continues
  -> Avatar Coins are minted
  -> creator becomes discoverable to business partners
  -> studios request access, campaigns, licensing, design work, or distribution
```

Companies should be able to search the creation chain for creators with strong Avatar Coin history and inspect auditable evidence such as:

- Number of independently verified 24-hour uses.
- Unique users who adopted the design.
- Repeat adoption.
- Genres and communities where the world succeeds.
- Completion and sharing activity inside the world.
- Version history and improvement rate.
- Attribution for human and bot-assisted work.
- Integrity status and rejected fraudulent sessions.

Avatar Coins should therefore function as a scarce creator-performance credential inside the platform. A company cannot simply purchase a creator's earned history or manufacture it through advertising traffic.

## Studio and business access

A company such as a movie studio may want Avatar Coins because they identify creators capable of building an audience experience around entertainment.

The company may use the system to:

- Find creators whose worlds match a film, show, character, genre, or campaign.
- Hire or license a creator's world design.
- Ask the creator to build a branded entertainment portal.
- Place licensed content into an established user world.
- Sponsor a clearly labeled version or campaign.
- Pay for verified distribution, completed viewing, or qualified engagement.
- Offer a creator a production, curation, advertising, or community role.

The business relationship must not remove the user's authorship. The creator controls whether to accept an offer, license a version, create a separate sponsored version, or decline.

### Business request record

```json
{
  "requestId": "business_request_01J...",
  "companyId": "company_01J...",
  "creatorId": "user_01J...",
  "creationId": "creation_01J...",
  "requestType": "licensed_world_campaign",
  "status": "pending_creator_review",
  "requestedRights": ["campaign_use", "licensed_content_placement"],
  "offeredSettlement": {
    "currency": "contract_defined",
    "amount": null,
    "avatarCoinParticipation": null
  },
  "createdAt": 0
}
```

No company receives publishing rights, private analytics, control of a creator's world, or Avatar Coin participation until the creator explicitly accepts a defined agreement.

## Company settlement and Avatar Coin demand

Avatar Coins may become a settlement or participation unit accepted by companies inside Infinity, but company demand must arise from real utility and agreed contracts rather than a promise that the coin automatically has a cash value.

Possible uses include:

- Paying creators for licensed world designs.
- Rewarding successful campaign builders.
- Receiving an agreed share of activity from licensed studio content.
- Accessing platform services or creator collaborations.
- Recording a studio's participation in a successful entertainment world.

Studio payment, creator payment, StarCoin minting, Avatar Coin minting, and ordinary currency settlement must remain separate ledger events. A contract may connect them, but the software must never silently treat them as the same asset or obligation.

## Separate ledgers

Do not combine these measurements into one balance.

Maintain separate records for:

- Creation shares.
- Qualified design use.
- Avatar Coin minting.
- Avatar Coin transfers or contract allocations.
- StarCoin minting.
- Firing Star status.
- Business requests and creator approvals.
- Studio or partner settlement.
- Platform contribution units.

This keeps the system auditable and prevents one kind of activity from silently becoming another.

## Bots and automated builders

Bots may help users:

- Generate themes.
- Suggest layouts.
- Build shelves.
- Rename sections.
- Create companion personalities.
- Turn research into usable pages.
- Produce accessible variants.
- Test design consistency.
- Recommend improvements.
- Turn a rough creative seed into finished media, such as expanding a flower idea into a complete poppy-video world.

Bot-created work must remain attributed to the controlling user and the assisting bot. Bots must not create fake users, fake shares, fake viewing, fake qualified use time, or fake token events.

## Chain behavior

Every meaningful public change creates a new version in the chain instead of overwriting history.

```text
Creation v1
  -> Creation v2
      -> Remix A
      -> Remix B
          -> Remix B v2
```

Each version should preserve:

- Creator.
- Parent version.
- Change summary.
- Theme and font choices.
- Companion settings.
- Content arrangement.
- Publication time.
- Usage and reward history.

## Privacy

Private drafts stay in the user's encrypted vault and never appear in the public chain until the user explicitly publishes them.

Public creation records should not expose private watch history, raw behavioral profiles, passwords, authentication tokens, private messages, or unpublished research.

Companies receive aggregated or permissioned evidence only. They do not receive a user's private viewing history merely because they are searching for creators or negotiating a campaign.

## Implementation stages

### Stage 1: Local prototype

- Five newest local creations.
- Search and scroll through local drafts.
- Version history.
- Simulated usage display only.

### Stage 2: Authenticated public chain

- Server-backed creation records.
- Public profiles and attribution.
- Verified opens and active-use sessions.
- Search and pagination.

### Stage 3: Reward settlement

- Firing Star share progress.
- Avatar Coin continuous-use ledger.
- Anti-abuse review.
- Creator dashboards.
- Transparent cycle and mint history.

### Stage 4: Business marketplace

- Verified company profiles.
- Creator discovery by Avatar Coin evidence and category.
- Permissioned business requests.
- Creator-controlled licensing and campaign agreements.
- Separate company, creator, platform, and token settlement records.
- Public sponsorship labels and private-data protections.

No production coin should be awarded from localStorage or client-only counters. Reward minting requires server-verified events and an auditable ledger.
