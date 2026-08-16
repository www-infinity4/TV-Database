# FORKNIGHT Round 5 — Foundations

Verified on 2026-08-15 against the canonical GitHub repositories, their live
default branches, latest commits, and root license files. Supplied metadata was
treated as a lead, not evidence.

## Verified candidates

| Zone | Repository | Immutable pin | License | Adapter boundary |
| --- | --- | --- | --- | --- |
| Visual Geometry | `mrdoob/three.js` | `f2607c20976baa0544a93946ee7ac54dfaaa9bcb` | MIT | browser 3D direction fields |
| Visual Geometry | `pixijs/pixijs` | `4b141e3ced7255b39c2114b6bca03421a37b2363` | MIT | isolated phone-first 2D canvas |
| Visual Geometry | `antvis/X6` | `b14ca27540693c610257e7687c663f122deb0006` | MIT | sanitized repository graphs |
| Workflow and Actuation | `temporalio/sdk-python` | `680a6b4f32e9d5f2484e9a2e1c604178553c3f55` | MIT | server-side durable workflow client |
| Messaging and Shared State | `eclipse-zenoh/zenoh` | `0d03ddf2db1d8561d90d0db9aaaac053195ad8eb` | Apache-2.0 OR EPL-2.0; license review | authenticated transport sidecar |
| Messaging and Shared State | `automerge/automerge` | `8d7b12f8da553afbb325e37a6c66942b8dd4d994` | MIT | authorized CRDT state only |
| Policy and Sandboxing | `open-policy-agent/opa` | `16b5a013726fff3c2197f98ac4afcd6d2218588a` | Apache-2.0 | read-only policy decisions |
| Code Intelligence | `tree-sitter/tree-sitter` | `dff1fd868c750dbbae179fcd5c43ce987e4e0528` | MIT | parse source without execution |
| Provenance and Observability | `open-telemetry/opentelemetry-python` | `aa8e7dbdfa4bd35c1d780d8c4cd5c7d6e3983ea8` | Apache-2.0 | redacted telemetry emission |

PixiJS uses `dev`, not `main`, as its live default branch. All nine supplied
commit pins were replaced with commits verified during ingestion.
Eight candidates pass the permissive adapter gate. Zenoh remains in license
review until the selected Apache-2.0 or EPL-2.0 path and dependency scope are
recorded explicitly.

## Rejected or unresolved exact names

- `Hearthly/Space-Engine`: no matching repository or GitHub owner found.
- `nebula-orchestrator/actuator`: exact repository does not exist. The real
  organization currently exposes projects including `manager`, `worker`,
  `nebula`, `nebula-python-sdk`, and `nebula-cmd`; none is substituted here.
- `local-first-web-development/local-first-hw`: exact repository and owner were
  not found. Search results were unrelated repositories.
- `lean/lean-game-engine`: exact repository and owner were not found. Search
  results were unrelated engines.

Rejected names do not enter `forkables.json` because they cannot satisfy the
immutable-pin and license gates.

## Integration order

1. Tree-sitter provides non-executing structural inspection.
2. OPA evaluates typed Actuator proposals against immutable policy bundles.
3. OpenTelemetry records redacted decisions, checks, and failures.
4. Automerge synchronizes authorized user-interface state, never credentials
   or merge authority.
5. PixiJS renders the phone-first operational map.
6. X6 renders repository and dependency graphs with escaped labels.
7. Three.js renders optional higher-dimensional Infinity / Omni views with
   bounded complexity.
8. Temporal coordinates durable server-side work after a separate deployment
   review; SDK inclusion alone is not a running workflow service.
9. Zenoh is evaluated last because distributed transport expands the security
   boundary and requires authenticated, encrypted links and topic allowlists.

## Non-negotiable boundaries

No imported component may read credentials, change its own policy, write the
default branch, merge a PR, control a wallet or device, or execute discovered
repository code. `/k`, `/z`, Base, Octave2, and custom symbolic formats remain
distinct. Phone clients receive bounded views and proposals; persistent or
heavy services run separately behind authenticated adapters.
