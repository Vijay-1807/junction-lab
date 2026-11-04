# Model and measurement

Junction Lab uses a discrete-time, lane-and-cell agent model. Its purpose is to compare interventions under controlled synthetic demand. It does not consume live traffic observations or produce calibrated Bengaluru forecasts.

## Network and agents

The synthetic network has nine signalized junctions, twelve boundary entrances/exits and forty-eight directed links. Each link contains thirty-two 7.5 m cells, for a length of 240 m. Local roads have one lane per direction; main roads have one to three. A lane-cell stores at most one vehicle.

Arrivals follow a seeded fractional Bernoulli process. Origins and destinations are distinct boundary points. Arrivals use a random stream independent of vehicle movement, so paired scenarios preserve arrival count and origin/destination draws. Vehicles wait outside the network until an entrance has space and are admitted in arrival order.

Routes are fixed shortest paths with link cost `length / (maximum cell speed × lane count)`. Closed links are excluded before routing. The cost is a simple capacity proxy, not a traffic equilibrium assignment.

## Movement and junctions

Each simulation step is one second. Vehicles accelerate by one cell per step, remain behind occupied cells, and have a 12% probability of stochastic slowing. There are no lane changes. Requested speeds quantize to 27 or 54 km/h; the UI displays the effective value so fine speed-limit changes are not mistaken for resolved model effects.

Surface junctions alternate east-west and north-south phases with staggered offsets and two clearance seconds per phase. At most one vehicle crosses a surface junction each second, provided there is downstream space. Turning movements follow the incoming approach phase without detailed turn-arc geometry.

At the central flyover, straight east-west trips bypass the signal. Opposing bridge directions have independent reservations; turning vehicles remain at the surface. Ramps and merge geometry are not modeled. Arterial widening increases link storage and parallel road movement, but surface junction discharge remains limited by its crossing reservation.

## Metrics

| Metric | Definition |
| --- | --- |
| Generated | All requested arrivals during the run. |
| Completed | Vehicles reaching their destination before the run ends. |
| Active / pending | Vehicles still driving / still waiting to enter. |
| Mean and p95 journey time | Completed-trip elapsed time, including entrance wait. |
| Mean wait | Completed-trip time stopped inside or waiting outside the network. |
| Throughput | Completed trips normalized to vehicles/hour over the full interval. |
| Peak queue | Maximum stopped vehicles plus externally pending vehicles. |

The conservation identity is `generated = completed + active + pending`. Completed-trip statistics exclude unfinished journeys, so completion and unfinished counts must be read alongside travel times. No warm-up period is discarded. Summary metrics use every simulation step; replay frames sample every two seconds.

## Experiments and limits

`node scripts/experiment.mjs` regenerates twenty runs: five seeds for baseline, flyover, one-lane and closure scenarios. The JSON and CSV in `research/` retain the actual outcomes. A single favorable seed is not evidence of a general benefit; the supplied five-seed exercise does not establish statistical significance.

The model omits lane changes, detailed turn conflicts, ramps/merges, pedestrians, public transit and empirical calibration. It is suitable for inspecting this model's scenario tradeoffs, not for recommending real construction or predicting actual road traffic. A larger public service would also need platform-level rate limiting.

Junction handling was informed by [SUMO's intersection documentation](https://sumo.dlr.de/docs/Simulation/Intersections.html). This project implements its own smaller model; it does not run SUMO.

Time-series exports include the final simulation second even when the duration is not divisible by ten.
