# Content review status — 2026-09-17

The current batch is prepared locally. No editorial database updates have been
committed. This report supplements the broader content improvement plan; it does
not claim a completed editorial review of all 103 weeks.

## Corrections completed in this continuation

- The content audit now matches Java builds to Java specs and includes external
  references in authored data files, including Python build specs.
- HTTP redirect detection uses the response redirect flag. Removing a URL
  fragment from the HTTP request no longer creates a false redirect report.
- Snapshot generation supports both legacy seed constants and modern roadmap
  outcomes when loading a Git revision, so future editorial baselines work.
- Kafka hints and Java week 23 objectives now explain the transactional boundary
  and external database effects. Evidence: [Apache Kafka design documentation](https://kafka.apache.org/41/design/design/#message-delivery-semantics).
- Redis lease hints now specify a unique token, atomic acquisition with expiry,
  ownership-checked release, and the risk of a paused owner outliving its lease.
  Evidence: [Redis distributed locks documentation](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/).
- Database rehearsals execute the plan twice within one rolled-back transaction
  and require the second pass to perform no additional writes.

## Validation and review artifacts

- `npm run content:check`: content type checking, structural audit, and seven
  regression tests pass. All 103 weeks have objectives, and every build resource
  has authored requirements and acceptance criteria.
- Frontend production compilation (`npx vite build`) and server compilation
  (`npm run build` from `server/`) pass. Browser prerendering was not run.
- [Full link inventory](content-link-report.json): 531 roadmap resources,
  305 unique destinations, 251 reachable, 18 redirected, 35 access-blocked,
  and one inconclusive. No confirmed 404/410 was observed. HTTP reachability
  does not prove topic relevance, fragment validity, or anonymous access.
- [Database update plan](content-update-plan.json): 284 existing rows
  (3 phases, 12 weeks, 255 resources, 14 build specs), 10 new weekly checks,
  zero merge conflicts. Fifteen existing URL backfills are intentionally
  superseded; their before/after values are recorded in `urlDrift`.
- Final database rehearsal passed: 284 updates and 10 new checks on the first
  pass; all 294 operations were already applied on the second pass, with zero
  additional writes. The transaction was rolled back successfully.

## Remaining work

- Review access-blocked/inconclusive destinations manually and assess topic
  relevance for the full inventory. There are still 125 search destinations.
- Finish and record the phase-by-phase editorial review, resource access labels,
  workload review, and assessment alignment across every week. Twelve weekly
  checks exist in reviewed source; database-only checks are not counted here.
- After publishing authorization, regenerate/review any stale plan, apply the
  update, and verify served content. Preserve this plan's `before` values for
  rollback; restoration must check current values to avoid overwriting newer
  edits. There is no automatic rollback command yet.
- Rehearsals use the configured database with a final rollback, not a disposable
  database. Inserts may consume sequence values even when rolled back. Learner
  tables and content identities are not updated by this script.

To reproduce the dry run from `server/`:

```sh
node scripts/sync-reviewed-content.mjs --baseline 24cdd1e6a1bb6a24ac532b772e2c1d82a3874264 --out /tmp/content-update.json
node scripts/sync-reviewed-content.mjs --rehearse /tmp/content-update.json
```

## Local development fixes

- Vite serves development at `/` and retains `/system-design-roadmap/` for
  production builds and previews. The favicon follows the configured base URL.
- Added `npm run dev:api` and documented the two-terminal startup procedure.
  Verified the local API returns 49 Python weeks and 54 Java weeks.
- Roadmap fetch failures now show an error and retry button instead of an empty
  roadmap. Development builds also explain how to start the API.
- Frontend type checking and production compilation pass after these changes.
