# Infinity / Omni Sandbox Zone

This zone turns the Infinity / Omni concept into a portable event contract.
It separates visualization, conversation, proposals, execution, and promotion
so no model can silently convert an idea into repository authority.

## Components

| Component | Input | Output | Authority |
| --- | --- | --- | --- |
| Direction field | mode, origin, vectors, bounds, seed | deterministic geometry events | none |
| Profile workspace | messages, role, evidence refs | response or typed intent | no direct writes |
| Actuator | typed intent and proposed patch | normalized change proposal | proposal only |
| Repository gateway | proposal, policy, branch | diff, checks, PR | allowlisted branch writes |
| Owner gate | reviewed PR and evidence | promote or reject | protected merge |

`direction-modes.json` is the canonical vocabulary. Renderers may be 2D, 3D,
terminal, browser, or game engines, but must preserve mode names and event
semantics. The schema is intentionally small enough for phone-first clients.

LibreChat is a quarantined workspace reference, not the Mongoose control plane.
Its agent, provider, tool, and permission patterns may inform adapters after
review at the pinned commit in `forkables.json`.

See `ACTUATOR-CONTRACT.md` for the change boundary.
