# Project 2 requirement audit

Only one project is required by the supplied notice. This submission selects **Project 2: Traffic simulation**.

| Requirement | Implementation and evidence |
| --- | --- |
| Agent-based traffic model | Individual vehicle IDs, positions, speeds, lanes, routes and waiting times in `src/engine.js`; deterministic seeded runs. |
| Road network | 21 nodes and 48 directed links; topology is synthetic and explicitly labeled. |
| Junctions | Nine signalized junctions, alternating phases, clearance intervals, surface crossing reservations and downstream blocking. |
| Flyovers | Central east-west through traffic bypasses surface signals. Opposing bridge directions are independent. Turning traffic stays at the surface. |
| Different widths and capacities | Single-lane local roads and 1-3-lane arterials; finite lane-cell storage and parallel road movement. |
| Users set up scenarios | Presets, demand, lane width, requested speed with effective model speed, signal cycle/split, flyover, closure, seed and duration. |
| Users see results | Vehicle/density replay, scrubber, road inspector, queue chart, completed/unfinished trips, average journey, throughput and peak queue. |
| Full-stack deployment | Browser UI calls a deployed Worker API; no mock result values. Public URL in SUBMISSION.md. |
| Reproducibility | Seeded arrivals and movement, baseline comparisons, scenario JSON import/export, five-seed experiments, source ZIP and full git-history bundle. |
| Verification | 13 automated tests, standalone Worker validation, browser checks at mobile and desktop sizes. Check `research/verification.txt` and submission live verification report. |

## Application rules

| Rule | Status |
| --- | --- |
| Development in one session | Project development and git operations happened in this Codex chat; original raw log and git history are supplied for review. |
| At most 72 hours | The packaging script calculates original session start to source commit; see the refreshed manifest for the actual value. |
| Required first-prompt line | **Not satisfied. This cannot be fixed retroactively.** |
| Commit inside the session | Source commits were created and pushed using session tools. |
| Raw, unedited JSONL | Packaging copies original bytes; it does not insert, remove, redact or reconstruct log content. The snapshot ends at export time. |

## Scope and limitations

The project requirements are implemented as an exploratory simulation. This does not establish application eligibility. The missing opening line remains a known rule violation.

The network is not extracted from real Bengaluru streets and is not calibrated to observed traffic. The cell model quantizes speed to 27/54 km/h, uses fixed routes, omits lane changes and detailed turning/merge geometry, and uses a simplified one-crossing-per-second surface junction capacity. These limits appear in the app and README. Results are scenario experiments, not validated transport forecasts. No claim of a perfect or defect-free implementation is made.
