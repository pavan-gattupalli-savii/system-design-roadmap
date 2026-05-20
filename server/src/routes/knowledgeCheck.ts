// ── Knowledge check routes ────────────────────────────────────────────────────
// v2: numeric question type added.
// Per-week MCQ/MAQ + code-problem authored content + per-user attempt history.
// Phase 1 ships MCQ grading on the server. Code problems are returned with
// hidden test inputs scrubbed; Pyodide-driven self-grading lands on the client
// in Phase 2, Piston-driven server grading for Java lands in Phase 3.
//
// Performance notes:
//   - `getCachedWeekCheck` memoises the scrubbed public shape in `queryCache`
//     (15min fresh / 60min stale, with in-flight dedup). The cache key is
//     `wc::<lang>:<phase>:<week>`. Invalidate via /admin/flush-cache after seed.
//   - `sendCached` adds a strong ETag + Cache-Control, so the browser pays
//     a 304 on revisit instead of re-shipping the JSON. Read-only public data.
//   - Status endpoint is per-user; never cached at HTTP layer.

import { Router } from "express";
import { db, cached } from "../db/client.js";
import {
  weekChecks,
  weekCheckMcq,
  weekCheckCodeProblems,
  weekCheckCodeTests,
  weekCheckNumeric,
  userWeekCheckAttempts,
  userWeekCheckAnswers,
} from "../db/schema.js";
import { and, asc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { writeLimiter } from "../middleware/rateLimiter.js";
import { sendCached } from "../middleware/cache.js";
import { queryCache } from "../lib/cache.js";

const router = Router();

type Language = "python" | "java";

// ── Public response shape (scrubbed of answers + hidden test detail) ──────────
interface PublicMcq {
  id:       number;
  prompt:   string;
  options:  string[];
  // `multi` is derived from server-side `correct.length > 1`. Lets the client
  // pick a radio vs checkbox group without leaking which option count it is.
  multi:    boolean;
  points:   number;
}
interface PublicVisibleTest {
  name:     string;
  input:    unknown;
  expected: unknown;
  weight:   number;
}
interface PublicCodeProblem {
  id:               number;
  runtime:          "python" | "java";
  title:            string;
  prompt:           string;
  starter:          string;
  entryFn:          string | null;
  timeoutMs:        number;
  points:           number;
  visibleTests:     PublicVisibleTest[];
  hiddenTestCount:  number;
  /** Sum of all test weights (visible + hidden). Lets the client compute %. */
  totalWeight:      number;
}
interface PublicNumeric {
  id:      number;
  prompt:  string;
  unit:    string;
  points:  number;
}
interface PublicWeekCheck {
  id:        number;
  title:     string;
  passPct:   number;
  totalPoints: number;
  mcq:       PublicMcq[];
  numeric:   PublicNumeric[];
  code:      PublicCodeProblem[];
}

// ── Single source of truth for the GET endpoint ───────────────────────────────
// Returns the scrubbed shape ready to JSON.stringify. Hidden tests' inputs and
// expected values are stripped — only count + total weight remain.
async function loadPublicWeekCheck(
  lang: Language,
  phase: number,
  week: number,
): Promise<PublicWeekCheck | null> {
  const [parent] = await db
    .select()
    .from(weekChecks)
    .where(and(
      eq(weekChecks.language, lang),
      eq(weekChecks.phaseNumber, phase),
      eq(weekChecks.weekNumber, week),
    ))
    .limit(1);
  if (!parent) return null;

  // Fan out: pull MCQ + numeric + code problems in parallel. Code tests need
  // a second query keyed by the problem IDs we just learned.
  const [mcqRows, numericRows, codeRows] = await Promise.all([
    db.select().from(weekCheckMcq)
      .where(eq(weekCheckMcq.weekCheckId, parent.id))
      .orderBy(asc(weekCheckMcq.sortOrder)),
    db.select().from(weekCheckNumeric)
      .where(eq(weekCheckNumeric.weekCheckId, parent.id))
      .orderBy(asc(weekCheckNumeric.sortOrder)),
    db.select().from(weekCheckCodeProblems)
      .where(eq(weekCheckCodeProblems.weekCheckId, parent.id))
      .orderBy(asc(weekCheckCodeProblems.sortOrder)),
  ]);

  const problemIds = codeRows.map((p) => p.id);
  const testRows = problemIds.length
    ? await db.select().from(weekCheckCodeTests)
        .where(inArray(weekCheckCodeTests.problemId, problemIds))
        .orderBy(asc(weekCheckCodeTests.sortOrder))
    : [];
  // Group tests by problem in one pass.
  const testsByProblem = new Map<number, typeof testRows>();
  for (const t of testRows) {
    const arr = testsByProblem.get(t.problemId) ?? [];
    arr.push(t);
    testsByProblem.set(t.problemId, arr);
  }

  const mcq: PublicMcq[] = mcqRows.map((m) => ({
    id:      m.id,
    prompt:  m.prompt,
    options: m.options as string[],
    multi:   Array.isArray(m.correct) && (m.correct as number[]).length > 1,
    points:  m.points,
  }));

  // Numeric: scrub `expected` + `tolerancePct` + `explanation` — those leak
  // the answer. Only prompt, unit, and points reach the browser.
  const numeric: PublicNumeric[] = numericRows.map((n) => ({
    id:     n.id,
    prompt: n.prompt,
    unit:   n.unit,
    points: n.points,
  }));

  const code: PublicCodeProblem[] = codeRows.map((p) => {
    const tests = testsByProblem.get(p.id) ?? [];
    let hiddenCount = 0;
    let totalWeight = 0;
    const visible: PublicVisibleTest[] = [];
    for (const t of tests) {
      totalWeight += t.weight;
      if (t.hidden) { hiddenCount++; continue; }
      visible.push({
        name:     t.name,
        input:    t.input,
        expected: t.expected,
        weight:   t.weight,
      });
    }
    return {
      id:              p.id,
      runtime:         p.runtime as "python" | "java",
      title:           p.title,
      prompt:          p.prompt,
      starter:         p.starter,
      entryFn:         p.entryFn,
      timeoutMs:       p.timeoutMs,
      points:          p.points,
      visibleTests:    visible,
      hiddenTestCount: hiddenCount,
      totalWeight,
    };
  });

  const totalPoints =
    mcq.reduce((a, m) => a + m.points, 0) +
    numeric.reduce((a, n) => a + n.points, 0) +
    code.reduce((a, p) => a + p.points, 0);

  return {
    id:          parent.id,
    title:       parent.title,
    passPct:     parent.passPct,
    totalPoints,
    mcq,
    numeric,
    code,
  };
}

// Cache the public shape so repeat hits never touch the DB. 15min fresh,
// 60min stale-while-revalidate (the `queryCache` singleton's defaults).
async function getCachedWeekCheck(
  lang: Language,
  phase: number,
  week: number,
): Promise<PublicWeekCheck | null> {
  const key = `wc::${lang}:${phase}:${week}`;
  return cached(key, () => loadPublicWeekCheck(lang, phase, week)) as Promise<PublicWeekCheck | null>;
}

function parseLang(raw: unknown): Language | null {
  return raw === "python" || raw === "java" ? raw : null;
}

// ── GET /api/knowledge-checks/:language/me — auth, per-user status map ───────
// Declared first so "me" isn't shadowed by /:language/:phase/:week.
router.get("/:language/me", requireAuth, async (req, res) => {
  const lang = parseLang(req.params.language);
  if (!lang) {
    res.status(400).json({ error: "language must be 'python' or 'java'" });
    return;
  }
  try {
    const rows = await db
      .select({
        phaseNumber: weekChecks.phaseNumber,
        weekNumber:  weekChecks.weekNumber,
        weekCheckId: weekChecks.id,
        scorePct:    userWeekCheckAttempts.scorePct,
        passed:      userWeekCheckAttempts.passed,
        attemptedAt: userWeekCheckAttempts.attemptedAt,
      })
      .from(weekChecks)
      .leftJoin(
        userWeekCheckAttempts,
        and(
          eq(userWeekCheckAttempts.weekCheckId, weekChecks.id),
          eq(userWeekCheckAttempts.userId, req.user!.id),
        ),
      )
      .where(eq(weekChecks.language, lang));

    const byWeek: Record<string, {
      weekCheckId: number;
      scorePct:    number | null;
      passed:      boolean | null;
      attemptedAt: string | null;
    }> = {};
    for (const r of rows) {
      // Key is "phase.week" so the client can build a stable Map without
      // shipping two-level objects through JSON.
      byWeek[`${r.phaseNumber}.${r.weekNumber}`] = {
        weekCheckId: r.weekCheckId,
        scorePct:    r.scorePct,
        passed:      r.passed,
        attemptedAt: r.attemptedAt ? r.attemptedAt.toISOString() : null,
      };
    }
    res.json(byWeek);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load knowledge-check status" });
  }
});

// ── GET /api/knowledge-checks/:language/:phase/:week — public, scrubbed ──────
router.get("/:language/:phase/:week", async (req, res) => {
  const lang = parseLang(req.params.language);
  const phase = parseInt(req.params.phase, 10);
  const week  = parseInt(req.params.week,  10);
  if (!lang || !Number.isFinite(phase) || !Number.isFinite(week)) {
    res.status(400).json({ error: "Invalid language / phase / week" });
    return;
  }
  try {
    const data = await getCachedWeekCheck(lang, phase, week);
    if (!data) {
      res.status(404).json({ error: "No knowledge check authored for this week" });
      return;
    }
    // Aggressive HTTP cache: content rarely changes. Re-seed triggers cache
    // flush server-side; browser ETag check keeps things consistent.
    sendCached(res, req, data, { maxAge: 600, swr: 3600 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load knowledge check" });
  }
});

// ── POST /:weekCheckId/submit — graded; persists per-item evidence ────────────
// Phase-1 grader: server grades MCQ rigorously, accepts client-reported code
// verdicts as evidence. Phase 2/3 will tighten this with deterministic Pyodide
// + Piston runs, but the storage shape doesn't change.
const submitSchema = z.object({
  mcq: z.array(z.object({
    id:     z.number().int().positive(),
    picks:  z.array(z.number().int().min(0).max(50)).max(20),
  })).max(50).default([]),
  numeric: z.array(z.object({
    id:     z.number().int().positive(),
    answer: z.string().min(1).max(64),
  })).max(50).default([]),
  code: z.array(z.object({
    id:       z.number().int().positive(),
    // Source capped here so the JSON body limit on the app stays sane.
    source:   z.string().max(20_000),
    // Client-reported test outcomes. The list mirrors what we returned for
    // the problem (visible + hidden). `weight` lets us compute the partial
    // score without re-querying the test rows.
    results:  z.array(z.object({
      name:   z.string().max(120),
      passed: z.boolean(),
      hidden: z.boolean().optional(),
      weight: z.number().int().min(0).max(50).optional(),
    })).max(100).default([]),
  })).max(20).default([]),
});

/** Tolerant numeric grader — parses both sides, accepts within tolerancePct. */
function gradeNumeric(answer: string, expected: string, tolerancePct: number): boolean {
  // Strip whitespace, commas (thousands), and a trailing unit string the user
  // may have included by accident ("11 GB" → "11"). Keep digits, decimal, e/E,
  // sign, and decimal point.
  const cleanUser = answer.replace(/[\s,_]/g, "").replace(/[a-zA-Z]+$/g, "");
  const cleanExp  = expected.replace(/[\s,_]/g, "").replace(/[a-zA-Z]+$/g, "");
  const u = Number(cleanUser);
  const e = Number(cleanExp);
  if (!Number.isFinite(u) || !Number.isFinite(e)) return false;
  if (e === 0) return u === 0;
  return Math.abs(u - e) / Math.abs(e) <= tolerancePct / 100;
}

router.post("/:weekCheckId/submit", requireAuth, writeLimiter, async (req, res) => {
  const weekCheckId = parseInt(req.params.weekCheckId, 10);
  if (!Number.isFinite(weekCheckId)) {
    res.status(400).json({ error: "weekCheckId must be a number" });
    return;
  }
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" });
    return;
  }

  const userId = req.user!.id;
  const { mcq: mcqAns, numeric: numericAns, code: codeAns } = parsed.data;

  try {
    // Confirm the weekCheck exists and pull the pass threshold in one go.
    const [parent] = await db
      .select({ id: weekChecks.id, passPct: weekChecks.passPct })
      .from(weekChecks)
      .where(eq(weekChecks.id, weekCheckId))
      .limit(1);
    if (!parent) {
      res.status(404).json({ error: "Knowledge check not found" });
      return;
    }

    // ── Grade MCQ ────────────────────────────────────────────────────────────
    const mcqIds = mcqAns.map((a) => a.id);
    const mcqRows = mcqIds.length
      ? await db
          .select({
            id: weekCheckMcq.id, correct: weekCheckMcq.correct,
            explanation: weekCheckMcq.explanation, points: weekCheckMcq.points,
          })
          .from(weekCheckMcq)
          .where(and(eq(weekCheckMcq.weekCheckId, weekCheckId), inArray(weekCheckMcq.id, mcqIds)))
      : [];
    const mcqById = new Map(mcqRows.map((m) => [m.id, m]));

    const mcqResults = mcqAns.map((a) => {
      const m = mcqById.get(a.id);
      if (!m) return { id: a.id, correct: false, expected: null as number[] | null, explanation: "", points: 0, earned: 0 };
      const expected = (m.correct as number[]).slice().sort((x, y) => x - y);
      const got      = a.picks.slice().sort((x, y) => x - y);
      const correct  = expected.length === got.length && expected.every((v, i) => v === got[i]);
      return { id: a.id, correct, expected, explanation: m.explanation, points: m.points, earned: correct ? m.points : 0 };
    });

    // ── Grade numeric (range-match with tolerancePct) ────────────────────────
    const numericIds = numericAns.map((a) => a.id);
    const numericRows = numericIds.length
      ? await db
          .select({
            id: weekCheckNumeric.id,
            expected: weekCheckNumeric.expected,
            tolerancePct: weekCheckNumeric.tolerancePct,
            unit: weekCheckNumeric.unit,
            explanation: weekCheckNumeric.explanation,
            points: weekCheckNumeric.points,
          })
          .from(weekCheckNumeric)
          .where(and(eq(weekCheckNumeric.weekCheckId, weekCheckId), inArray(weekCheckNumeric.id, numericIds)))
      : [];
    const numericById = new Map(numericRows.map((n) => [n.id, n]));

    const numericResults = numericAns.map((a) => {
      const n = numericById.get(a.id);
      if (!n) return { id: a.id, correct: false, expected: null as string | null, unit: "", explanation: "", points: 0, earned: 0 };
      const correct = gradeNumeric(a.answer, n.expected, n.tolerancePct);
      return {
        id: a.id, correct,
        expected: n.expected,
        tolerancePct: n.tolerancePct,
        unit: n.unit,
        explanation: n.explanation,
        points: n.points,
        earned: correct ? n.points : 0,
      };
    });

    // ── Score code (trust client verdicts in Phase 1) ────────────────────────
    const codeIds = codeAns.map((c) => c.id);
    const codeRows = codeIds.length
      ? await db
          .select({ id: weekCheckCodeProblems.id, points: weekCheckCodeProblems.points })
          .from(weekCheckCodeProblems)
          .where(and(eq(weekCheckCodeProblems.weekCheckId, weekCheckId), inArray(weekCheckCodeProblems.id, codeIds)))
      : [];
    const codeById = new Map(codeRows.map((p) => [p.id, p]));

    const codeResults = codeAns.map((c) => {
      const p = codeById.get(c.id);
      if (!p) return { id: c.id, passed: false, earned: 0, points: 0 };
      const totalWeight  = c.results.reduce((a, r) => a + (r.weight ?? 1), 0);
      const earnedWeight = c.results.reduce((a, r) => a + (r.passed ? (r.weight ?? 1) : 0), 0);
      const passedAll    = c.results.length > 0 && c.results.every((r) => r.passed);
      // Partial credit: scale problem points by weight passed.
      const earned = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * p.points) : 0;
      return { id: c.id, passed: passedAll, earned, points: p.points };
    });

    // ── Aggregate score ───────────────────────────────────────────────────────
    const earned = mcqResults.reduce((a, r) => a + r.earned, 0)
                 + numericResults.reduce((a, r) => a + r.earned, 0)
                 + codeResults.reduce((a, r) => a + r.earned, 0);
    const total  = mcqResults.reduce((a, r) => a + r.points, 0)
                 + numericResults.reduce((a, r) => a + r.points, 0)
                 + codeResults.reduce((a, r) => a + r.points, 0);
    const scorePct = total > 0 ? Math.round((earned / total) * 100) : 0;
    const passed   = scorePct >= parent.passPct;

    // ── Persist: best-score-wins, plus per-item evidence ──────────────────────
    // Read existing aggregate so we never regress the score on a re-submit.
    const [prior] = await db
      .select({ scorePct: userWeekCheckAttempts.scorePct })
      .from(userWeekCheckAttempts)
      .where(and(
        eq(userWeekCheckAttempts.userId, userId),
        eq(userWeekCheckAttempts.weekCheckId, weekCheckId),
      ))
      .limit(1);

    if (!prior || scorePct >= prior.scorePct) {
      await db.insert(userWeekCheckAttempts)
        .values({ userId, weekCheckId, scorePct, passed })
        .onConflictDoUpdate({
          target: [userWeekCheckAttempts.userId, userWeekCheckAttempts.weekCheckId],
          set:    { scorePct, passed, attemptedAt: new Date() },
        });
    }

    // Store per-item evidence — overwrite previous attempt's record for the
    // same item so the latest attempt is the source of truth. (Aggregate is
    // still best-of-all per the block above.)
    for (const r of mcqResults) {
      const submitted = mcqAns.find((a) => a.id === r.id)?.picks ?? [];
      await db.insert(userWeekCheckAnswers)
        .values({ userId, weekCheckId, itemType: "mcq", itemId: r.id, correct: r.correct, payload: submitted })
        .onConflictDoUpdate({
          target: [userWeekCheckAnswers.userId, userWeekCheckAnswers.weekCheckId, userWeekCheckAnswers.itemType, userWeekCheckAnswers.itemId],
          set:    { correct: r.correct, payload: submitted, attemptedAt: new Date() },
        });
    }
    for (const r of numericResults) {
      const submitted = numericAns.find((a) => a.id === r.id)?.answer ?? "";
      await db.insert(userWeekCheckAnswers)
        .values({ userId, weekCheckId, itemType: "numeric", itemId: r.id, correct: r.correct, payload: { answer: submitted } })
        .onConflictDoUpdate({
          target: [userWeekCheckAnswers.userId, userWeekCheckAnswers.weekCheckId, userWeekCheckAnswers.itemType, userWeekCheckAnswers.itemId],
          set:    { correct: r.correct, payload: { answer: submitted }, attemptedAt: new Date() },
        });
    }
    for (const r of codeResults) {
      const submitted = codeAns.find((a) => a.id === r.id);
      const payload = submitted ? { source: submitted.source, results: submitted.results } : {};
      await db.insert(userWeekCheckAnswers)
        .values({ userId, weekCheckId, itemType: "code", itemId: r.id, correct: r.passed, payload })
        .onConflictDoUpdate({
          target: [userWeekCheckAnswers.userId, userWeekCheckAnswers.weekCheckId, userWeekCheckAnswers.itemType, userWeekCheckAnswers.itemId],
          set:    { correct: r.passed, payload, attemptedAt: new Date() },
        });
    }

    res.json({
      scorePct,
      passed,
      passPct: parent.passPct,
      results: {
        mcq:     mcqResults.map((r) => ({ id: r.id, correct: r.correct, expected: r.expected, explanation: r.explanation, points: r.points, earned: r.earned })),
        numeric: numericResults.map((r) => ({ id: r.id, correct: r.correct, expected: r.expected, tolerancePct: (r as { tolerancePct?: number }).tolerancePct, unit: r.unit, explanation: r.explanation, points: r.points, earned: r.earned })),
        code:    codeResults,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit knowledge check" });
  }
});

// ── Cache invalidation entry point — called by admin flush ────────────────────
export function invalidateKnowledgeCheckCache(): void {
  queryCache.invalidate("wc::");
}

// ── Warmup hook — preload Phase 1 Week 1 for both languages ───────────────────
// Cheap enough to do on every cold start. If content isn't seeded yet, the
// loader returns null and nothing gets cached.
export async function warmKnowledgeChecks(): Promise<void> {
  await Promise.all([
    getCachedWeekCheck("python", 1, 1).catch(() => null),
    getCachedWeekCheck("java",   1, 1).catch(() => null),
  ]);
}

export default router;
