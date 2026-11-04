# QUEST Project 2: Junction Lab

Live application: https://junction-lab-sepia.vercel.app/

Public source: https://github.com/Vijay-1807/junction-lab

The demo is public and uses synthetic data. The session log is never served by the application.

## Reviewer walkthrough (about two minutes)

1. Open the app and select **Try the flyover comparison**. Two actual server simulations run with identical arrivals, not prefilled results.
2. Watch individual vehicles or switch to density. Pause/scrub the replay; click a road to see its lanes, storage and effective speed.
3. Read the completed-trip count, unfinished trips, average journey and largest queue. Compare the baseline and intervention. A flyover can improve one metric while worsening another.
4. Open **Change demand, roads & signals**. Try a road closure, different lane count or different signal timing. Run and compare again.
5. Export a scenario JSON and import it to reproduce the inputs. Read **Model & methods** for assumptions and limitations.

## Technical contents

- Responsive browser UI, server simulation API, deterministic agent-based model.
- Junctions, finite road capacity, configurable arterial width, idealized flyover and closure routing.
- Unit/API/artifact checks and real paired experiments over five seeds.
- No installation dependencies or external credentials needed to run locally with Node.js 22+.
- Source and full git history supplied separately from the raw log.

See README.md for commands, API schema, model details and verification limits. The `research` directory contains reproducible experiment CSV/JSON. The package manifest records exact source commit, git time, log snapshot hash and exported file hashes.

Version 1.1 includes the refreshed typography, mobile/tablet/desktop checks, a keyboard-accessible road inspector, and a density-specific legend. Flyover access is limited to straight traffic, entrance admission is first-in-first-out, and old version 1.0 baselines are ignored. There are 20 automated checks, including the Vercel adapters and generated static UI. REQUIREMENTS.md maps each Project 2 requirement to its implementation and lists the model limits.

## Application rule status

The first task prompt did not begin with the required `QUEST Lab Full Stack AI Pre-doctoral application, [name], [date]` line. This requirement is unmet and cannot be corrected retroactively. The raw log is preserved, and no claim of full rule compliance is made.

Initial development and later review work span multiple Codex session files. The single-session development requirement is therefore not satisfied. Preserve the original and supplementary logs separately; do not concatenate or edit them. The package manifest records elapsed session-start-to-commit time for the 72-hour rule. No application form has been submitted.

## Log handling

`session.jsonl` is an unchanged byte snapshot of the original Codex JSONL through the export time, taken after the final source commit. The chat remains appendable, so it is not described as a complete closed-session export. To capture later messages after this chat finishes, rerun the packaging command with the same original log path. Never prepend, redact, reconstruct or edit the log for the application.

The raw log may contain account/session information and expired service credentials. It is included only in the local submission folder, never in the public site or source ZIP. This session has not submitted a form, sent an email, or uploaded the log to the lab. Use the application form's requested fields and upload destination.
