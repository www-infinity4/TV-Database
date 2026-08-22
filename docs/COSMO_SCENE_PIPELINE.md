# Cosmo scene pipeline — release contract

Cosmo's scene-aware companion is one gated product, not a collection of scripted pop-ins. It remains inactive until every capability below has versioned validation evidence.

## Per-title analysis package

Each licensed or authorized title needs an offline analysis manifest containing:

- timed visual observations: setting, landscape, objects, clothing, vehicles, architecture and readable on-screen text;
- timed dialogue/transcript topics with speaker and confidence;
- scene boundaries and source timestamps;
- content-safety and advertising-exclusion markers;
- the source checksum and model/version that produced every observation.

Browser playback supplies only title, episode and current time. Cross-origin video is not claimed as visually scanned when the analyzer has not produced a manifest.

## Viewer relevance

The viewer profile contains permissioned StarQuest activity only: searches, opened titles, completed viewing, skips, explicit likes/needs and chat. Terms decay over time and are stored as weights, amplitudes and normalized probabilities. It never contains thoughts, other tabs, private browser history, protected traits or inferred sensitive conditions.

## Inventory and rendering

Inventory must be current, verified and tagged to the same vocabulary as scene manifests. A candidate needs both visual and dialogue evidence plus viewer relevance. Real estate, vehicles and other high-consideration items open as an optional conversation—not an impulse card. Every result is labeled **Sponsored scene match**, dismissible, auditable and requires the viewer to open it. Nothing purchases automatically.

A Field of Dreams example may match a verified Kansas property only when the manifest identifies relevant land/farm/baseball cues, the viewer has independently signaled those interests, matching is enabled, and the listing passes verification. The movie alone is never treated as evidence of the viewer's private intent.

## Release gate

All seven must pass before `js/cosmo-scene-engine.js` is added to `index.html`:

1. visual manifest pipeline;
2. dialogue timeline pipeline;
3. viewer-term adapter;
4. verified inventory adapter;
5. separate scene-matching consent;
6. labeled card/conversation renderer;
7. immutable decision audit.

Until then, automatic watch-along remarks and sponsored scene matching remain disabled. User-initiated Cosmo chat can continue through its separately identified model connection.
