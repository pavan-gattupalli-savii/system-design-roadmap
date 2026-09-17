// ── Seed example phase outcomes + week objectives + checkpoints ───────────────
// Populates a minimal exemplar set for Python Phase 1 so the new UI surfaces
// have something to render. Authors can extend the same shape from admin.
//
// Idempotent: outcomes/objectives overwrite, checkpoints upsert by (lang, phase, sort_order).

import "dotenv/config";
import { db, sql } from "../src/db/client.js";
import { phaseCheckpoints, roadmapPhases, roadmapWeeks } from "../src/db/schema.js";
import { and, eq } from "drizzle-orm";

interface CheckpointRow {
  question:    string;
  options:     string[];
  answerIdx:   number;
  explanation: string;
}

import { PHASE_OUTCOMES, WEEK_OBJECTIVES } from "../data/python-outcomes.js";


const PHASE_CHECKPOINTS: Record<string, Record<number, CheckpointRow[]>> = {
  python: {
    1: [
      {
        question: "Average-case time complexity of `x in some_set` where `some_set` is a Python `set`?",
        options:  ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answerIdx: 0,
        explanation: "Python sets are hash tables. Membership testing is O(1) amortised. Lists would be O(n).",
      },
      {
        question: "Which call mutates the original list?",
        options:  ["`sorted(lst)`", "`lst[:].sort()`", "`lst.sort()`", "`list(reversed(lst))`"],
        answerIdx: 2,
        explanation: "`lst.sort()` sorts in place and returns None. `sorted()` returns a new list. `lst[:]` is a copy, so `.sort()` on it doesn't touch the original.",
      },
      {
        question: "You want a class attribute that is computed from instance state and read like an attribute (no parentheses). What do you use?",
        options:  ["`@staticmethod`", "`@classmethod`", "`@property`", "Plain assignment in __init__"],
        answerIdx: 2,
        explanation: "`@property` turns a method into a read-only attribute. Plain assignment in __init__ wouldn't update if other state changes.",
      },
    ],
    2: [
      {
        question: "What does `__slots__` give you?",
        options:  ["Faster method dispatch", "Lower memory per instance + restricted attrs", "Automatic __init__", "Thread-safe attribute access"],
        answerIdx: 1,
        explanation: "`__slots__` allocates a fixed array slot per attribute instead of a per-instance __dict__, cutting memory and rejecting new attributes at runtime.",
      },
      {
        question: "You want a callable that lazily yields one item at a time and remembers position. What do you write?",
        options:  ["A class with `__iter__` only", "A regular function with `return`", "A function with `yield`", "A list comprehension"],
        answerIdx: 2,
        explanation: "A `yield` makes the function a generator. Each `next()` resumes where the last yield left off.",
      },
      {
        question: "Which call returns a coroutine without scheduling it on the event loop?",
        options:  ["`await coro()`", "`asyncio.gather(coro())`", "`coro()`", "`asyncio.create_task(coro())`"],
        answerIdx: 2,
        explanation: "Calling an async function returns a coroutine object. Until you `await` it or pass it to `create_task` / `gather`, the loop does nothing.",
      },
      {
        question: "asyncio.gather raises an exception in one task. Default behaviour for the others?",
        options:  ["Cancelled automatically", "Continue running; their exceptions are swallowed", "Continue running; their results are still returned if `return_exceptions=True`", "Loop crashes"],
        answerIdx: 2,
        explanation: "By default the first exception propagates and other tasks are cancelled. Pass `return_exceptions=True` to collect them all instead of cancelling.",
      },
    ],
    3: [
      {
        question: "A class has two reasons to change (DB schema and report layout). Which SOLID principle does that violate?",
        options:  ["Open/Closed", "Single Responsibility", "Liskov Substitution", "Interface Segregation"],
        answerIdx: 1,
        explanation: "Single Responsibility says a class should have one reason to change. Two reasons → split the class.",
      },
      {
        question: "You need to swap algorithms at runtime (e.g. shipping cost: standard vs express). Which pattern?",
        options:  ["Factory", "Strategy", "Observer", "Singleton"],
        answerIdx: 1,
        explanation: "Strategy encapsulates each algorithm behind a common interface so callers can pick one at runtime without conditional spaghetti.",
      },
      {
        question: "An object's behaviour depends on which mode it's in (e.g. order: created → paid → shipped). The cleanest pattern is:",
        options:  ["State", "Decorator", "Visitor", "Mediator"],
        answerIdx: 0,
        explanation: "State swaps the behaviour by replacing the state object on the context — no giant `if/elif` ladder.",
      },
    ],
    4: [
      {
        question: "A test mocks the database it claims to integrate with. What kind of test is it?",
        options:  ["Integration test", "Unit test", "End-to-end test", "Smoke test"],
        answerIdx: 1,
        explanation: "If you mock the dependency, you're not integrating with it — that's a unit test. Real integration tests hit a real (or testcontainer) dependency.",
      },
      {
        question: "pytest fixture with `scope=\"module\"` runs:",
        options:  ["Once per test", "Once per test class", "Once per file", "Once per test session"],
        answerIdx: 2,
        explanation: "Module-scope fixtures are created once per test file and torn down at the end of the file.",
      },
      {
        question: "You want to assert a function was called with specific args. Best tool:",
        options:  ["`assert_called_with`", "`assert_called`", "`called` boolean check", "manual side-effect list"],
        answerIdx: 0,
        explanation: "`Mock.assert_called_with(*args, **kwargs)` checks the last call matched. `assert_called` only checks if it was called at all.",
      },
    ],
    5: [
      {
        question: "Reads are slow on a `WHERE user_id=? AND created_at > ?` query. The right index is:",
        options:  ["B-tree on `user_id`", "B-tree on `created_at`", "Composite B-tree on `(user_id, created_at)`", "Hash on `user_id`"],
        answerIdx: 2,
        explanation: "Composite index in the right order lets the engine seek to the user_id range then scan a contiguous slice ordered by created_at. Two separate single-column indexes are worse.",
      },
      {
        question: "READ COMMITTED isolation prevents which anomaly?",
        options:  ["Lost update", "Dirty read", "Non-repeatable read", "Phantom read"],
        answerIdx: 1,
        explanation: "READ COMMITTED prevents dirty reads (reading uncommitted data). It still allows non-repeatable reads and phantoms — those require REPEATABLE READ / SERIALIZABLE.",
      },
      {
        question: "Pick the storage for a workload of 100k inserts/sec with eventual consistency OK:",
        options:  ["Postgres single instance", "MongoDB sharded cluster", "MySQL with synchronous replication", "SQLite"],
        answerIdx: 1,
        explanation: "Sharded NoSQL scales writes horizontally and tolerates eventual consistency. A single Postgres instance hits IO ceiling; synchronous replication kills write throughput.",
      },
    ],
    6: [
      {
        question: "Which HTTP method should be idempotent?",
        options:  ["GET only", "POST", "PUT and DELETE", "GET, PUT, DELETE"],
        answerIdx: 3,
        explanation: "GET, PUT, DELETE are all idempotent by spec — calling repeatedly has the same effect as once. POST is intentionally not idempotent (creates a new resource each time).",
      },
      {
        question: "You need server-pushed updates to many clients with low latency. Pick:",
        options:  ["REST polling", "Long polling", "WebSockets", "gRPC unary"],
        answerIdx: 2,
        explanation: "WebSockets give a full-duplex persistent connection — server pushes without the client asking. Polling burns bandwidth; gRPC unary is request-response.",
      },
      {
        question: "Token-bucket rate limiter with 100 capacity, 10/sec refill. Burst of 50 requests at t=0?",
        options:  ["All 50 rejected", "All 50 served", "First 10 served, 40 rejected", "First 100 served then rejected"],
        answerIdx: 1,
        explanation: "Token bucket allows bursts up to capacity. 50 < 100 tokens available at t=0, so all 50 are served. Future requests wait for refill.",
      },
    ],
    7: [
      {
        question: "First step of an HLD interview should be:",
        options:  ["Drawing boxes", "Choosing a database", "Clarifying requirements + scale", "Listing technologies you know"],
        answerIdx: 2,
        explanation: "Functional + non-functional requirements + scale numbers come first. Designing without them is shooting in the dark.",
      },
      {
        question: "Twitter timeline at 200M DAU, fanout-on-write for celebrity (100M followers) would:",
        options:  ["Work fine", "Cause a write storm; hybrid (fanout for normal users, fanout-on-read for celebs) is better", "Be cheaper than fanout-on-read", "Improve consistency"],
        answerIdx: 1,
        explanation: "Writing 100M timeline entries on every celebrity tweet is impossible. Hybrid: fanout-on-write for normal users, fanout-on-read (compute at view time) for celebrities.",
      },
      {
        question: "1B users × 100 events/day each. Daily event count is:",
        options:  ["1B", "10B", "100B", "1T"],
        answerIdx: 2,
        explanation: "1B × 100 = 100B events/day. Quick back-of-envelope: 100B / 86400 ≈ 1.1M events/sec average, with spikes 3–5×.",
      },
    ],
    8: [
      {
        question: "SLO is 99.9%. Monthly error budget is roughly:",
        options:  ["1 minute", "10 minutes", "43 minutes", "7 hours"],
        answerIdx: 2,
        explanation: "99.9% / month = 0.1% downtime = 0.001 × 43200 min ≈ 43 minutes. Three nines monthly = ~43 min, yearly = ~8.7h.",
      },
      {
        question: "Service is slow. Which observability pillar locates the bottleneck fastest?",
        options:  ["Logs", "Metrics", "Distributed traces", "Heap dumps"],
        answerIdx: 2,
        explanation: "Traces show end-to-end latency broken down per span — you see exactly which service / call took the time. Logs and metrics confirm but don't localise.",
      },
      {
        question: "Blue/green deploy means:",
        options:  ["Two versions run in parallel; switch traffic atomically", "Gradual percent rollout", "Deploy then test", "Rollback only"],
        answerIdx: 0,
        explanation: "Blue/green: full second environment runs the new version. Router flips traffic atomically. Canary is the gradual percentage approach.",
      },
    ],
    9: [
      {
        question: "First minute of any interview should be:",
        options:  ["Drawing the architecture", "Listing tech you know", "Clarifying scope + scale", "Picking a database"],
        answerIdx: 2,
        explanation: "Always start by clarifying. Skipping this is the most common reason candidates fail HLD.",
      },
      {
        question: "An interviewer's silence after you propose a solution usually means:",
        options:  ["They're impressed", "They want you to find the flaw yourself", "They forgot the question", "The interview is over"],
        answerIdx: 1,
        explanation: "Silence is a prompt. Walk through edge cases, trade-offs, and bottlenecks proactively — show you can self-critique.",
      },
      {
        question: "Time-management rule of thumb for a 45-min HLD interview:",
        options:  ["5/5/30/5", "10/5/20/10 (req/estimate/HLD/deep-dive+wrap)", "30 min HLD only", "Leave 20 min for questions"],
        answerIdx: 1,
        explanation: "Roughly 10 min on requirements + estimation, 20 on HLD, 10 on deep-dives, 5 on bottlenecks + wrap. Adjust per interviewer.",
      },
    ],
  },
};

async function main() {
  const apply = process.argv.includes("--apply");
  console.log(`▶ Seed example content — ${apply ? "APPLY" : "DRY RUN"}`);

  // ── Phase outcomes ─────────────────────────────────────────────────────────
  for (const [lang, byPhase] of Object.entries(PHASE_OUTCOMES)) {
    for (const [phaseStr, outcomes] of Object.entries(byPhase)) {
      const phaseNum = parseInt(phaseStr, 10);
      console.log(`  outcomes [${lang} p${phaseNum}] ${outcomes.length} items`);
      if (!apply) continue;
      await db.update(roadmapPhases)
        .set({ outcomes })
        .where(and(eq(roadmapPhases.language, lang), eq(roadmapPhases.phaseNumber, phaseNum)));
    }
  }

  // ── Week objectives ────────────────────────────────────────────────────────
  for (const [lang, byWeek] of Object.entries(WEEK_OBJECTIVES)) {
    for (const [weekStr, objectives] of Object.entries(byWeek)) {
      const weekNum = parseInt(weekStr, 10);
      console.log(`  objectives [${lang} w${weekNum}] ${objectives.length} items`);
      if (!apply) continue;
      // Look up week_id via join (week_number is unique within a language).
      await sql`
        UPDATE roadmap_weeks
        SET learning_objectives = ${objectives}
        WHERE phase_id IN (SELECT id FROM roadmap_phases WHERE language = ${lang})
          AND week_number = ${weekNum}
      `;
    }
  }

  // ── Checkpoints ────────────────────────────────────────────────────────────
  for (const [lang, byPhase] of Object.entries(PHASE_CHECKPOINTS)) {
    for (const [phaseStr, qs] of Object.entries(byPhase)) {
      const phaseNum = parseInt(phaseStr, 10);
      console.log(`  checkpoints [${lang} p${phaseNum}] ${qs.length} questions`);
      if (!apply) continue;
      // Wipe existing for this (lang, phase) so re-running stays deterministic
      await db.delete(phaseCheckpoints).where(and(
        eq(phaseCheckpoints.language, lang),
        eq(phaseCheckpoints.phaseNumber, phaseNum),
      ));
      for (let i = 0; i < qs.length; i++) {
        const q = qs[i];
        await db.insert(phaseCheckpoints).values({
          language:    lang,
          phaseNumber: phaseNum,
          question:    q.question,
          options:     q.options,
          answerIdx:   q.answerIdx,
          explanation: q.explanation,
          sortOrder:   i,
        });
      }
    }
  }

  if (!apply) {
    console.log();
    console.log("Run with --apply to commit.");
    return;
  }
  console.log("✅ Example content seeded");
}

main().catch((err) => {
  console.error("❌ Seed example content failed:", err);
  process.exit(1);
});
