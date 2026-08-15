# FORKNIGHT Round 3 — Autonomous Runtime Sources

Verified on 2026-08-15 and recorded by immutable upstream commit.

## Architecture decision

Mongoose.OS remains the control plane. It owns cart discovery, typed intents,
permissions, provenance, event history, validation, publishing, and the /z
router. Third-party agents are components behind adapters, never replacement
governments for the system.

The combined flow is:

1. StarQuest, another Infinity website, or a terminal channel submits an intent.
2. The Mongoose gateway loads the site profile, workspace, conversation, and
   relevant indexed evidence.
3. LocalAI, llama.cpp, Ollama, or another configured provider generates a
   proposed answer or tool request.
4. A nanobot-inspired agent loop may schedule or decompose the work, but it
   cannot grant itself tools.
5. Reader, writer, coder, security, validator, and publisher carts process the
   request through explicit contracts.
6. The result is stored in the event chain, exposed to the user, and re-indexed.

## Repository findings

### HKUDS/nanobot

Accepted for adapter review under MIT. Its useful pattern is the narrow agent
core surrounded by channels, tools, memory, skills, automations, subagents, and
an OpenAI-compatible API. Direct shell and file access remain quarantined.
Source builds require Python 3.11 and a JavaScript toolchain for the WebUI, so
it is not treated as a zero-install Termux dependency.

### mudler/LocalAI

Accepted for adapter review under MIT. It is the strongest round-three runtime
candidate because one local API can expose text, tools, embeddings, vision,
speech-to-text, text-to-speech, and Realtime voice. Individual model and
backend licenses still require separate registry records.

### open-webui/open-webui

Held for license review. Its current license prohibits removing or replacing
Open WebUI branding beyond specified small deployments unless permission or an
enterprise license exists. FORKNIGHT may study interaction and deployment
patterns but must not copy and rebrand the application as Infinity.

### eastlondoner/vibe-tools

Accepted only as a quarantined MIT architectural reference. It demonstrates
named commands for research, repository analysis, planning, documentation, and
browser work. Its normal setup modifies agent instruction files, installs
browser software, uses multiple cloud credentials, and supports telemetry, so
Mongoose will implement explicit adapters instead of running its global
installer.

### kyrolabs/awesome-agents

Rejected for copying because no repository license was detected. It remains a
link-only discovery feed. Every linked project must undergo its own canonical
repository, commit, license, security, and compatibility scan.

## Preservation and protection

Unique /k, /z, Octave, Base, and custom indexes are preserved. Discovery adds
links and records; it does not overwrite meaningful files or collapse distinct
machine instances. Public provenance remains readable, while credentials,
signing material, command tokens, private prompts, and robot authority remain
outside public website source.
