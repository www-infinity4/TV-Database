# Round 5 Foundation Adapters

Round 5 fills six missing interfaces without turning upstream projects into
the Mongoose.OS control plane.

| Interface | Candidate | First contract test |
| --- | --- | --- |
| `Geometry2DRenderer` | PixiJS | 512 seeded streams remain responsive on a phone viewport |
| `Geometry3DRenderer` | three.js | source/sink events render deterministically from a fixed seed |
| `RepositoryGraphRenderer` | X6 | untrusted labels are escaped and cannot inject DOM content |
| `WorkflowClient` | Temporal Python SDK | a workflow pauses before every protected proposal stage |
| `EventTransport` | Zenoh | unauthorized topics and unsigned peers are rejected |
| `SharedViewState` | Automerge | offline edits converge without syncing secrets or authority |
| `PolicyDecision` | OPA | default-branch and out-of-allowlist writes are denied |
| `SourceStructure` | Tree-sitter | malformed files are parsed or rejected without execution |
| `TelemetrySink` | OpenTelemetry Python | secrets are removed before trace export |

The first implementation slice should be Tree-sitter + OPA + redacted
OpenTelemetry. Rendering and shared-state adapters follow. Temporal and Zenoh
remain server-side evaluation items rather than phone dependencies.
