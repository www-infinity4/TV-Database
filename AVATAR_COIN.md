# Avatar Coin Cross-Site Standard

Avatar Coin is the portable design layer for the www-infinity4 website network. It is not a profile picture. A small contextual marker occupies the familiar trademark/help position beside an editable interface name or design element.

The hand-drawn marks in the original StarQuest screenshots showed placement only. They are not the required visual style. Each site uses a polished symbol appropriate to its world: a star on StarQuest, an alien head on Alien Coin, and another recognizable marker where appropriate.

## What one Avatar Coin can represent

- A whole network design shared across compatible sites.
- A complete service such as StarQuest, Alien Coin, Bitcoin Crusher, a radio station, a movie service, or a sports experience.
- A channel or category such as 1970s television, baseball, talk radio, or a music format.
- One component such as a hero, shelf, player, search field, card, menu, or recommendation area.

The number of editable stars is not the value. A strong whole-site concept may become more useful than hundreds of tiny changes.

## Design sources

Every saved design declares one source:

1. **Human designed** — conceived and built by a person.
2. **Human + AI assisted** — human-directed work made with AI tools.
3. **AI adapted for me** — a transparent automatic variation based on the user's own activity and controls.

AI adaptation must explain which local signals affected the result and must remain reversible. Human authorship must not be erased when AI helps implement or adapt a design.

## Adoption and value model

A future shared service may record these separately:

- `install_count`: people who deliberately apply the design.
- `active_users`: people still using it during a defined period.
- `retention`: continued use rather than a one-time click.
- `likes`: explicit approval, protected against repeat/self manipulation.
- `forks`: attributed redesigns derived from it.
- `scope`: network, site, channel, or component.
- `provenance`: original author, contributors, tools, parent design, and version hash.

Ranking should emphasize active use and retention, with likes as supporting evidence. Views or star clicks alone must not create a payout. Payment requires an agreed formula, verified activity, rights checks, abuse controls, and an auditable ledger.

## Portable record

```json
{
  "schema": "avatar-coin-design/v1",
  "id": "site:starquest:design:example",
  "name": "Example design",
  "scope": "site",
  "target": "starquest",
  "creationMode": "human",
  "author": "local-or-verified-author-id",
  "parent": null,
  "settings": {},
  "versionHash": "future-content-hash",
  "createdAt": "ISO-8601",
  "license": "declared-by-author"
}
```

No blockchain claim should be shown until records are actually written to a selected chain and independently verifiable. A signed append-only database can establish the product first; chain anchoring can be added without changing the public Avatar Coin meaning.

## Required experience on every participating site

- Use a polished contextual marker appropriate to the site.
- Every mark opens the same kind of portal.
- State what the selected mark controls and edit that exact element first.
- A marker beside a product name must allow that displayed name to change.
- Component markers must open component-specific controls rather than only global theme controls.
- Offer live preview, save, reset, and reversibility.
- Keep the site usable without personalization.
- Store locally until a real authenticated shared service exists.
- Distinguish design value from viewer credits, distributor payments, or unrelated coins.
- Never describe ranking, portability, chain records, or payouts as live before they are implemented.

## Current StarQuest implementation

StarQuest provides the first local prototype: contextual name and shelf-label editing, real AI naming suggestions, three color systems, three card sizes, network/site/channel/component reach, declared creation method, and optional history-based adaptation. Saved settings remain in the current browser. AI-generated graphics and replacement layouts, the cross-site registry, public submissions, adoption counters, likes, attribution graph, moderation, and payouts remain future services.
