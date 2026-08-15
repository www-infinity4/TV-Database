# Autonomous Agents Zone

This zone combines architectural patterns without turning any third-party
agent into the owner of Mongoose.OS.

## Selected roles

- nanobot: reference for a small agent loop, channel gateway, workspaces,
  sessions, long-term memory, MCP, scheduled tasks, and an OpenAI-compatible
  integration surface.
- LocalAI: candidate inference sidecar for text, vision, speech recognition,
  speech synthesis, embeddings, tools, and Realtime conversations.
- vibe-tools: reference for named developer commands and multi-provider review;
  never globally installed or allowed to rewrite instruction files by default.
- Open WebUI: dashboard and interaction reference only while its custom license
  receives review.
- awesome-agents: link-only discovery feed because no repository license was
  detected.

## Mongoose boundary

Website or terminal input becomes an intent. The orchestrator selects a cart.
The model can propose tool calls. The policy layer checks workspace, path,
action, recipient, network, and credential scope. Only then may an isolated
adapter run. Builder output must pass validation and security carts before a
publisher may create a PR. Default-branch merge remains a separate verified
operation.

Shell, filesystem, browser, scheduler, and MCP capabilities start disabled.
They are granted per cart and per workspace. Public websites never receive
robot-controller, wallet-signer, deployment, or repository-write credentials.

## Runtime placement

Termux remains a useful controller, menu, local reader, and small-model client.
It is not assumed to hold a heavy multimodal model continuously. LocalAI or
another OpenAI-compatible engine runs on suitable persistent compute; the
Mongoose gateway preserves the same contract regardless of provider.
