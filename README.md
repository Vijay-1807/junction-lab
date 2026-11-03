# Junction Lab

Full-stack traffic scenario studio for QUEST project 2. A synthetic network contains 9 signalized junctions, 12 boundary entrances/exits and 48 directed roads. Configure lane widths, demand, signals, a central flyover and a road closure; observe individual agents and compare experiments.

## Run and verify

Requires Node.js 22+. No dependencies, API keys, map service or downloaded dataset.

```sh
npm start
# Open http://127.0.0.1:4173
npm run build
npm test
node scripts/experiment.mjs
```

Build before testing: artifact tests exercise the generated Worker. `dist/server/index.js` runs on Cloudflare Workers; the local Node server uses the same HTTP handler and model.

## Workflow

Click **Try the flyover comparison** to run a baseline and intervention automatically, using the same arrivals. Read the plain-language summary and scenario comparison. On small screens, open **Change demand, roads & signals** to customize inputs. For manual experiments, run a preset, play/pause/scrub or speed up the replay, switch density view, and click roads to inspect lane storage. Pin a baseline, change one parameter, run again, and compare. Export JSON to retain the scenario, computed metrics, time series, per-road occupancy and baseline. Import that file to reproduce a run. Inputs and pinned baseline persist in browser local storage. Replay stops at the end; Play restarts it.

## Source layout

- `src/engine.js`: seeded model, graph, routing, validation and statistics.
- `src/handler.js`: bounded HTTP API with security headers.
- `src/page.js`: responsive UI, network Canvas, replay, charts, comparison and import/export.
- `server.mjs`: local Node adapter.
- `scripts/build.mjs`: dependency-free single-file Worker build.
- `tests/`: conservation, exclusive occupancy, closure handling, reproducibility, paired demand, validation, HTTP behavior, inline JavaScript parsing and generated Worker checks.
- `research/paired-experiments.json` and `.csv`: actual five-seed results for baseline, flyover, one lane and closure. Regenerate with `node scripts/experiment.mjs`.

## API

`GET /api/health` returns health and model identity. `GET /api/defaults` returns defaults. `POST /api/simulate` accepts a JSON scenario and returns configuration, topology, replay frames, time series, final link occupancy and metrics.

| Field | Range / default |
| --- | --- |
| demand | integer 0-6000 vehicles/hour; 2200 |
| lanes | integer 1-3 arterial lanes per direction; 2 |
| speed | integer 15-60 requested km/h; 45 |
| cycle | integer 20-120 seconds; 60 |
| split | integer 20-80% east-west share; 50 |
| flyover, incident | boolean; false |
| seed | integer 1-999999; 42 |
| duration | integer 60-900 seconds; 600 |
| name | string, max 80 characters |

Invalid input: HTTP 400; oversized body: 413; wrong simulation method: 405; unknown route: 404. Stateless backend, no database. Production high-volume use would need service-level rate limiting, which is not implemented.

## Model and honest limits

Links contain 32 cells of 7.5 m: 240 m each. Local roads have one lane per direction; arterials have 1-3. Each lane-cell stores at most one agent. One-second steps, acceleration by one cell per step, 12% random slowing and no lane changing. Requested speeds quantize to 27 or 54 km/h, so fine speed-limit comparisons are inappropriate.

Arrivals use a seeded fractional Bernoulli process, independent from movement randomness. Paired configurations preserve arrival count and origin/destination draws. Origins/destinations are distinct random boundary points. Fixed shortest routes minimize length / (maximum speed x lanes); closed links are excluded. This is a capacity proxy, not equilibrium route assignment.

Fixed signals alternate directions, staggered by junction, with two clearance seconds per phase. One surface vehicle may cross each junction per second if downstream space is available. The central flyover gives straight east-west trips independent unsignalized reservations by direction; turns still obey surface signals. It is an idealized grade separation: turn arcs, turning conflict geometry, ramps and merging are absent. Adding arterial lanes increases link storage but does not increase the surface junction reservation rate. Pedestrians, public transit, real geographic data and empirical calibration are absent.

Generated = completed + active + pending. Travel and wait statistics use completed trips only, including entry wait. Always inspect unfinished trips to avoid completion bias. Throughput normalizes completed trips over the entire interval. No warm-up is discarded. Replay samples every two seconds; metrics use every step. Five-seed paired records are supplied without claims of statistical significance. This is an exploratory educational prototype, not a validated city forecast or SUMO integration.

Junction design informed by [SUMO intersections documentation](https://sumo.dlr.de/docs/Simulation/Intersections.html).

## Application integrity

Development and git operations happened in this Codex chat on 3 November 2026. The chat did NOT start with the required `QUEST Lab Full Stack AI Pre-doctoral application, [name], [date]` line. Editing a README, commit or session log cannot repair that rule; do not claim compliance.

The original raw log is in the user's `~/.codex/sessions/`, as specified by the application notice. No edited/reconstructed log is supplied or uploaded to the deployed app. The running log continues to change until the chat ends. Preserve the actual original for any submission. No application form was submitted.

## Verification limits

All 13 automated checks passed, including generated production Worker requests. The deployed app was successfully opened in the in-app browser and a quiet-morning run was verified to update the replay, results and comparison. Narrow-screen visual inspection identified excessive setup scrolling, addressed by collapsible controls and a guided example. Earlier localhost access and Windows Computer Use were blocked; browser verification uses the deployed URL.

## Submission package

The app is public with explicit owner approval. Read SUBMISSION.md for a reviewer walkthrough and the unresolved first-prompt rule. Create local submission files after committing with:

```sh
node scripts/package-submission.mjs --log /absolute/path/to/original-session.jsonl --out /absolute/path/outside-the-repository
```

This generates a source ZIP, full git-history bundle, unchanged raw-log snapshot and SHA-256 manifest. No raw log is deployed. Rerun after the chat ends to include later records.

## Version 1.1 audit and usability update

See REQUIREMENTS.md for the full Project 2 and application-rule audit. Version 1.1 fixes arrival-queue admission order and restricts the flyover to straight-through traffic. Old pinned comparisons from version 1.0 are ignored so results from different models are not mixed. The UI adds a keyboard-accessible road inspector, effective-speed display, occupancy legend, reduced-motion handling, imported-duration support, clearer type and larger controls. Browser checks cover 360 px and desktop layouts. The headline uses Georgia and controls use a system sans-serif stack; no external font service is required.
