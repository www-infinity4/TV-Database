# StarQuest Local Prototype Validation Checklist

Run these manual checks in a browser session (and two tabs where noted):

1. Registration works (new account created, auto sign-in).
2. Sign-in works with correct password.
3. Incorrect password shows error.
4. Sign-out clears session and updates UI.
5. Existing-user migration keeps StarCoin balance/history after reload.
6. Watch activity updates history and resume progress but never mints StarCoins.
7. Insufficient balance blocks unlock.
8. Successful unlock deducts StarCoins and adds unlocked entry.
9. Repeated unlock of same content does not double-charge.
10. Watch-time accumulation only while active playback/visible/non-seeking/normal speed.
11. Watch history does not duplicate after reload.
12. Canceled Web Share gives no reward.
13. Successful share updates progress; 10 shares awards 1 StarCoin.
14. Recommendations with no history show starter picks.
15. Recommendations with history show deterministic “Picked For You” explanation.
16. Broken/unavailable archive entries show disabled/unavailable behavior.
17. Two-tab stale-session safety: mutate wallet/history in tab A, then perform action in tab B; latest data remains intact.
