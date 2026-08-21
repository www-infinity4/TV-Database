# StarQuest viewing history and resume model

StarQuest follows the useful public behavior of major streaming products without
copying their private code or claiming access to their internal algorithms.

## Public product patterns

- Netflix keeps profile-scoped viewing activity and a Continue Watching row;
  removing a title from viewing activity also removes it from Continue Watching
  and stops it influencing recommendations.
  <https://help.netflix.com/en/node/22205>
- Netflix profile transfers include viewing history, duration, device details,
  recommendations, and Continue Watching information.
  <https://help.netflix.com/en/node/122698>
- YouTube history supports viewing, deletion, pausing, and recommendation
  controls. A visible progress bar shows where a viewer stopped.
  <https://support.google.com/youtube/answer/95725>
  <https://support.google.com/youtube/answer/7174115>

## StarQuest contract

1. Opening a playable title immediately creates or refreshes a history entry.
2. Native video stores the actual playhead as `positionSeconds` and seeks back
   to it on the next open.
3. `watchedSeconds` is separate. It grows only during visible, forward,
   non-seeking playback near normal speed, so seeking cannot fake completion.
4. Guest activity is stored locally and is claimed by the account when the
   viewer registers or signs in on that browser.
5. Clearing history also clears resume positions, matching the expected
   Continue Watching behavior.
6. Recommendation signals use viewing and explicit interactions, with a
   50-title repeat gap.
7. Ten confirmed share attempts create one StarCoin. A single attempt ID is
   idempotent, while a newly opened share action for the same program can count.
   Saving watch position alone never creates a StarCoin.

## Honest browser boundary

Exact progress and resume are active for native video sources. A cross-origin
Archive.org or YouTube iframe cannot be inspected as if it were a native video.
StarQuest records that the program was opened, but it does not invent playhead
progress. YouTube iframe events and additional Archive.org direct-file
resolution remain adapter work for sources that cannot yet use native video.
