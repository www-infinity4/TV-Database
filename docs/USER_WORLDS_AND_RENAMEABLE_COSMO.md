# User Worlds and Renameable Cosmo

## Purpose

StarQuest is the first entertainment experience, not the permanent name forced on every user. The application must let a user shape and name the entire experience around their talent, interests, collections, community, and preferred style.

A user may turn the same protected application into worlds such as:

- Moon Dust — space, science fiction, ambient music, and astronomy
- River Stories — fishing programs, tackle auctions, maps, and outdoor creators
- Saturday Morning Galaxy — animation, toys, cards, and fan discussions
- A private family archive
- A creator's public entertainment network

The underlying application remains secure and maintainable while the visible world changes.

## Identity model

A world has two different identifiers:

1. `worldId` — permanent, generated once, never renamed.
2. `displayName` — controlled by the user and editable at any time.

Renaming does not break history, followers, links, StarCoin records, research, or ownership.

## Naming and firing a Star

Naming is the act of authorship. Firing a Star is a later public-launch event.

A world can exist in these stages:

- `draft` — private construction
- `preview` — shareable with selected people
- `published` — available publicly
- `fired` — recognized as an active Star in the wider Infinity network

The first implementation supports draft worlds and local preview switching. It deliberately does not pretend that a world has been publicly fired before identity, moderation, publishing, and ownership systems exist.

## User-controlled properties

Each world can control:

- World title
- Subtitle or purpose
- Companion name
- Companion role
- Theme preset
- Font preset
- Content focus tags
- Public/private status when publishing is implemented
- Selected programs, collections, auctions, and creator pages

## Cosmo

Cosmo is the default companion identity, not an unchangeable character name.

A world can rename and reframe the companion, for example:

- Cosmo — classic entertainment guide
- Finn — fishing and outdoor companion
- Luna — Moon Dust curator
- Scout — family discovery guide

The rename affects visible labels and greetings. The underlying assistant service keeps a stable technical identity so saved memory and permissions do not fragment every time the name changes.

## Creation gallery

The user's creations list is the bridge between personal building and future public Stars.

Selecting a creation should:

1. Load the world's title, subtitle, theme, and font.
2. Rename and reframe the companion.
3. Filter or prioritize matching entertainment categories.
4. Preserve the same secure account and permanent world identity.
5. Record the active world without publishing it.

Future public galleries can show creator-approved worlds. A user must explicitly publish before another person can load their creation.

## Data boundaries

Prototype preferences may be stored locally for interface development. Production storage must move to the encrypted Infinity user vault.

Never put these in a public repository:

- Private world membership
- Personal viewing history
- Companion conversation history
- User profile or biometric information
- Unpublished world content
- Wallet secrets

Repositories may contain schemas, default themes, public examples, and application code.

## Theme safety

Users select from validated design tokens rather than injecting arbitrary HTML, CSS, or JavaScript. This prevents a theme from becoming a cross-site scripting or credential-stealing mechanism.

Approved customization includes:

- Curated font stacks
- Validated colors
- Background gradients
- Corner and spacing presets
- Display labels

The system must reject script, markup, remote font code, and unsafe URLs in names or theme settings.

## Initial implementation

`js/user-worlds.js` provides a reversible prototype with:

- Create world
- Rename world
- Rename companion
- Choose a curated theme
- Choose a curated font
- Save multiple creations
- Switch the full interface between creations
- Delete a local draft
- Reset to the StarQuest default

The prototype does not publish worlds, transfer ownership, or fire a public Star. Those require authenticated server storage, moderation, stable URLs, and an auditable ownership ledger.
