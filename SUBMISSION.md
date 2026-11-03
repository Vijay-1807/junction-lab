# QUEST Project 2: Junction Lab

Live application: https://junction-lab-quest-2026.simplescout.chatgpt.site/

Access was changed to public with the applicant's explicit approval on 3 November 2026. The demo uses synthetic data only; the session log is never served by the application.

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

## Rule audit: unresolved opening-line violation

The first task prompt in this chat did **not** begin with `QUEST Lab Full Stack AI Pre-doctoral application, [name], [date]`. This is a historical fact and cannot be fixed by modifying the prompt, a file, a commit, or the raw log. This package must not be represented as fully compliant with that rule. Technical readiness does not establish application eligibility; the lab may reject this session on that basis.

All code changes and git operations for this project were made in this chat. The packaging script calculates elapsed time from the session metadata to the final git commit and reports whether it is within 72 hours. It does not backdate commits or fabricate session history.

## Log handling

`session.jsonl` is an unchanged byte snapshot of the original Codex JSONL through the export time, taken after the final source commit. The chat remains appendable, so it is not described as a complete closed-session export. To capture later messages after this chat finishes, rerun the packaging command with the same original log path. Never prepend, redact, reconstruct or edit the log for the application.

The raw log may contain account/session information and expired service credentials. It is included only in the local submission folder, never in the public site or source ZIP. This session has not submitted a form, sent an email, or uploaded the log to the lab. Use the application form's requested fields and upload destination.
