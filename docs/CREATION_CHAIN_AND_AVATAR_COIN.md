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

## Separate ledgers

Do not combine these measurements into one balance.

Maintain separate records for:

- Creation shares.
- Qualified design use.
- Avatar Coin minting.
- StarCoin minting.
- Firing Star status.
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

No production coin should be awarded from localStorage or client-only counters. Reward minting requires server-verified events and an auditable ledger.
