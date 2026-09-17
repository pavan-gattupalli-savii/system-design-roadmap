# Java and Python content improvement plan

## Goal and scope

Make both tracks accurate, usable, and effective for learning backend engineering
and system design. Review the curriculum, resource destinations, exercises,
concept explanations, readings, and assessments together. A working URL alone
does not establish that a resource teaches the promised topic.

This is an initial source review and execution plan, not a completed link audit.
No live database content has been inspected or modified for this plan.

## Findings from the initial review

- Python has 49 weeks and 261 resource entries; Java has 54 weeks and 270.
  These counts come from the two `server/data/roadmap-*.ts` files.
- Those source files contain 137 search-style prompts and no explicit `url`
  fields. The UI derives destinations from `where` text and book mappings;
  the database may contain explicit URLs from subsequent backfills and fixes.
- Java starts with generics, records, and concurrency; Python starts with setup
  and syntax. Their entry requirements should be explicit. Add an optional Java
  foundations bridge without renumbering existing weeks.
- Python week 5 points readers to Fluent Python 2e chapter 11 for ABCs and
  protocols. The author's example repository places protocols/ABCs in chapter
  13: https://github.com/fluentpython/example-code-2e/tree/master/13-protocol-abc.
  Audit all edition/chapter references; omit page numbers unless verified.
- Python week 8 promises a scraper that is "10× faster than sync". Replace that
  unsupported guarantee with a reproducible benchmark and workload caveats.
- Java enhancements include categorical claims about compact constructors,
  collector choices, state patterns, and GC performance. Verify these against
  primary documentation and turn context-dependent advice into explained tradeoffs.
- `server/data/knowledge-checks.ts` has authored entries only for week 1 of each
  language. Other seed scripts contain assessment content; reconcile those
  sources before claiming that other weeks have no assessments.
- Objectives, build requirements, hints, and fixes are spread across data files
  and enrichment scripts. The application serves database content via
  `server/src/routes/roadmap.ts`, not the TypeScript seed files directly.
- `seed-roadmap.ts` deletes and recreates roadmap rows, and does not restore
  phase outcomes or week objectives. Do not use this as the publishing mechanism
  for targeted editorial changes without first resolving preservation and identity.
- The existing resource probe checks only nonempty database `url` fields,
  records failures rather than a complete inventory, and groups access-blocked
  responses with broken links. It misses UI-derived destinations and topic mismatch.
- The server build includes `src`, excluding authored data and seed scripts.
  A passing application build is insufficient validation of edited content.

## Working assumptions

- Preserve existing language/phase/week identities and learner progress.
- Keep the current tracks; improve quality before expanding their length.
- Specify supported language/framework versions. Separate stable features from
  preview features and label version-dependent behavior explicitly.
- Give each core topic a free, accessible learning route. Paid books/courses may
  remain recommended supplements with accurate access labels.
- Treat AI review prompts as optional support; provide independent completion
  criteria so an AI response is not the only measure of learning.

## Phase 1 — Establish a complete baseline

1. Inventory all authored material, including roadmap data, build specs,
   enrichment scripts, concepts, book maps, readings, and knowledge checks.
2. Read the public roadmap API and compare served content with source; use a
   read-only export for relevant material not exposed through public endpoints.
3. Produce one audit record per item with language, phase/week, source location,
   stable identifier, displayed title, effective URL, intended outcome, access
   requirements, version assumptions, and observed discrepancies.
4. Build a coverage matrix: prerequisites, objectives, resources, exercises,
   acceptance criteria, assessments, and estimated effort for every week.

Deliverables: complete inventory, source-versus-served diff, and prioritized
findings (incorrect, broken, misleading, missing, optional enhancement).

## Phase 2 — Repair and curate resource destinations

1. Reuse or extend the existing probes to include explicit URLs, UI-derived
   URLs, book mappings, and build/concept references. Deduplicate requests.
2. Use bounded concurrency and per-host limits, independent retry timeouts,
   HEAD-to-GET fallback, redirect tracking, and retry/backoff for transient errors.
3. Report healthy, confirmed missing, redirected, access-blocked, rate-limited,
   timeout, and manual-review states separately. A 403 or timeout is inconclusive.
4. Check destination titles and topic relevance; flag soft 404s, generic homepages,
   search results, unavailable videos, and redirects to unrelated material.
5. Verify replacements against the author's or publisher's page. Prefer exact
   documentation sections and specific videos. Retain search links only as
   explicitly labeled discovery exercises.
6. Persist canonical URLs in reviewed source so reseeding cannot restore stale
   destinations. Consolidate duplicate resolution/book mappings as needed.

Deliverables: full JSON/Markdown link report with timestamps and old/new links,
plus reviewed resource corrections. Do not invent a replacement from its slug.

## Phase 3 — Improve curriculum accuracy and progression

Review each phase in both languages, prioritizing prerequisites and foundations
before advanced material. Use a common rubric: correctness, prerequisites,
clarity, practical value, resource relevance, workload, and assessment alignment.

- Python: check early exercises against concepts already taught; verify typing,
  protocols, descriptors, concurrency, cancellation, resource cleanup, and
  version-specific runtime claims. Benchmark performance rather than promise it.
- Java: add an optional setup/syntax/OOP/testing bridge; verify records,
  collections, concurrency, virtual threads, preview APIs, Spring compatibility,
  persistence, and performance claims against the declared version baseline.
- Both: review database isolation, retries/idempotency, transactions, messaging
  guarantees, caching, failure recovery, observability, and capacity estimates.
  Explain assumptions and failure cases in distributed-systems advice.
- Set 3–5 observable objectives per week. Separate required study from optional
  depth and distinguish reading time from implementation time.
- Align shared system-design topics across languages while keeping idiomatic
  language-specific examples. Do not force identical week numbering.

Deliverables: phase-by-phase editorial patches with evidence for factual fixes
and a completed coverage matrix. Finish one representative week per language
first to establish a reusable quality standard, then apply it to all 103 weeks.

## Phase 4 — Strengthen practice and feedback

- Reconcile existing build specs and enrichments before adding new ones.
- Every core build needs requirements, prerequisites, observable acceptance
  criteria, relevant edge/failure cases, hints, and optional stretch work.
- Add or improve knowledge checks tied to the week's objectives, with answer
  explanations. Prefer reasoning, debugging, and tradeoff scenarios over trivia.
- Check question ambiguity, numerical units/tolerances, and technical accuracy.
- Give capstones staged milestones: correctness, tests, failure handling,
  measurement, deployment, and a short design rationale.

Deliverables: aligned exercises and assessments with explicit coverage of each
week's objectives; documented exceptions for interview/project-only weeks.

## Phase 5 — Validate and publish reproducibly

1. Add content validation that actually loads authored datasets: references,
   identities, question structure, durations, URL syntax, and required coverage.
2. Resolve source-of-truth drift and prepare an idempotent content update with a
   dry-run diff. Preserve identities, existing enrichments, and learner data.
3. Exercise the update in a disposable database and prove a second run creates
   no additional changes. Check learner associations before and after updating.
4. Run focused validation and builds, then check representative pages and links
   in both tracks, including objectives, exercises, and assessment rendering.
5. Publish the reviewed content update, invalidate relevant caches, and compare
   served content with the reviewed inventory. Record rollback instructions.
6. Add deterministic content checks to CI and a scheduled link report. Network
   failures should produce actionable review items rather than flaky build failures.

## Completion criteria

- All 103 existing weeks receive a recorded editorial review.
- Every external resource has a checked destination or an explicit unresolved
  status and reason. No known confirmed dead link remains in the required path.
- Required topics have accessible resources and accurate version/edition labels.
- Every week has clear prerequisites/objectives and a way to demonstrate learning.
- Core builds have meaningful acceptance criteria and realistic effort estimates.
- Corrected source and published content agree; learner identities/progress survive.
- The final report distinguishes verified fixes from unresolved access checks and
  deferred enhancements, with before/after coverage and link counts.

## Suggested delivery order

1. Baseline inventory and complete link audit.
2. Confirmed factual fixes and broken-link repairs.
3. Representative Python/Java weeks and the Java foundations bridge.
4. Remaining phases, build specs, and assessments in manageable batches.
5. Reproducible publishing, served-content verification, and ongoing checks.

Estimate the full editorial effort after the baseline reveals actual coverage
and source/database drift; avoid assigning a deadline from source counts alone.
