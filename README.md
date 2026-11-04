# Junction Lab

A full-stack traffic experiment studio. Change road capacity, signal timing, a flyover or a closure, then inspect the effect on individual journeys and queues.

[Open the app](https://junction-lab-sepia.vercel.app/) · [Model and metrics](MODEL.md) · [Project requirement map](REQUIREMENTS.md) · [Deployment guide](VERCEL.md)

## Try it in two minutes

1. Click **Try the flyover comparison** to run a baseline and intervention with identical arrivals.
2. Watch the vehicle replay, switch to density, or choose a road to inspect its lanes, storage and queue.
3. Read the comparison, including unfinished trips. Then change one setting and run again.
4. Export the scenario JSON to save the inputs; import it to reproduce the run.

The backend calculates each run. The animation replays a synthetic simulation; it is not live road traffic.

## Run locally

Use Node.js 22.x. No dependencies, API keys or environment variables are required.

```sh
git clone https://github.com/Vijay-1807/junction-lab.git
cd junction-lab
npm start
# Open http://127.0.0.1:4173
```

```sh
npm test                         # builds both targets, then runs all 18 checks
node scripts/validate-artifact.mjs
node scripts/experiment.mjs       # regenerate the five-seed comparisons
```

## What is implemented

- Individual vehicles, fixed routes, signal phases, finite lane storage and downstream blocking.
- Nine junctions, twelve gateways and forty-eight directed road links.
- Single-lane local streets and configurable main-road widths; a through-only flyover and closure routing.
- Seeded demand, scenario presets, replay controls, road inspection, charts and paired comparisons.
- JSON import/export and browser-local scenario persistence.
- Public Vercel frontend and server APIs using the same model as the local server and Worker target.

## Architecture

| Component | Location |
| --- | --- |
| Simulation, routing, validation and metrics | `src/engine.js` |
| Shared HTTP handler | `src/handler.js` |
| Responsive UI and replay | `src/page.js` |
| Vercel server functions | `api/` |
| Local server | `server.mjs` |
| Vercel / Worker builds | `scripts/build-vercel.mjs`, `scripts/build.mjs` |
| Invariants, APIs and deployment adapters | `tests/` |

`GET /api/health` reports model identity. `GET /api/defaults` returns a valid scenario. `POST /api/simulate` accepts JSON and returns configuration, topology, replay frames, time series, link occupancy and summary metrics. Invalid scenarios return 400, oversized requests 413, unsupported simulation methods 405 and unknown routes 404.

## Evidence and interpretation

The eighteen tests cover determinism, vehicle conservation, exclusive lane-cell occupancy, closures, through-only flyover access, invalid inputs, API behavior and both deployment targets. GitHub Actions runs the build and tests from a fresh checkout.

[Recorded Vercel checks](research/vercel-verification.json) compare seven complete responses against the source model, including maximum load, another seed and zero demand. [Paired experiments](research/paired-experiments.csv) preserve twenty computed runs across five seeds.

The model is intentionally small: it uses synthetic topology, coarse speed cells and simplified junctions, with no empirical calibration. Read [MODEL.md](MODEL.md) before interpreting its results as real-world effects.

## Application materials

[SUBMISSION.md](SUBMISSION.md) provides the reviewer walkthrough, raw-log handling instructions and the known unmet opening-line requirement. The original session log and complete git history remain unchanged. Logs, credentials and local submission archives are excluded from public source and deployment assets.
