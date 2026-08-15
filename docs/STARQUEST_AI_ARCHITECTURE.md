# StarQuest AI architecture

StarQuest can own its recommendation logic, memory rules, tool contracts, safety checks, and user interface in this repository. It cannot copy a hosted model's private weights or runtime into source code. A production assistant therefore has two supported layers.

## Shipped in the static site

- A local recommendation engine scores playable television using watch history, searches, opened shows, recency, genre, decade, and explicit clipboard interests.
- The top spotlight rotates within the six highest-scoring shows and avoids the previous spotlight.
- Clipboard access happens only after the viewer presses **Use Clipboard Interests** and accepts the browser permission request.
- StarQuest discards the clipboard text immediately. It stores at most 30 words that already exist in the catalog's titles, genres, or descriptions.
- Playback and ledger actions remain deterministic application code. Model text cannot mint currency, transfer value, approve rights, or bypass a blocked source.

## Model-backed production layer

Keep model credentials and privileged tools on a server. The browser sends a minimal, consented preference profile to a StarQuest endpoint; the endpoint may use the OpenAI Responses API when StarQuest needs direct control of the loop, or the Agents SDK when it needs a bounded agent loop with guardrails, state, tracing, and approvals.

The browser must never contain an OpenAI API key. It should receive only a short-lived application session and structured recommendation results.

## Required controls

1. Every data source is opt-in, visible, and revocable.
2. Clipboard, microphone, files, and watch history are separate permissions.
3. Raw clipboard contents are never retained as a preference profile.
4. Money, rights, publishing, and external messages require deterministic validation and human approval.
5. Automated jobs have budgets, time limits, stop conditions, audit records, and regression tests. They do not trigger one another forever.
6. Recommendations include a human-readable reason and exclude unavailable catalog entries.

This separation lets the repositories contain the durable StarQuest intelligence and policies while a replaceable model supplies language and reasoning.
