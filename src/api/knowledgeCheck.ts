// ── Knowledge check API ───────────────────────────────────────────────────────
// Hits /api/knowledge-checks. Public GET, authed POST. Server already strips
// MCQ correct answers and hidden test inputs from the response.
import { apiFetch } from "./client";
import type { Language } from "../data/roadmap-index";

export interface KnowledgeCheckMcq {
  id:      number;
  prompt:  string;
  options: string[];
  /** true → multi-select (checkboxes), false → single-select (radio). */
  multi:   boolean;
  points:  number;
}

export interface KnowledgeCheckVisibleTest {
  name:     string;
  input:    unknown;
  expected: unknown;
  weight:   number;
}

export interface KnowledgeCheckCodeProblem {
  id:               number;
  runtime:          "python" | "java";
  title:            string;
  prompt:           string;
  starter:          string;
  entryFn:          string | null;
  timeoutMs:        number;
  points:           number;
  visibleTests:     KnowledgeCheckVisibleTest[];
  hiddenTestCount:  number;
  totalWeight:      number;
}

export interface KnowledgeCheckNumeric {
  id:     number;
  prompt: string;
  unit:   string;
  points: number;
}

export interface KnowledgeCheck {
  id:          number;
  title:       string;
  passPct:     number;
  totalPoints: number;
  mcq:         KnowledgeCheckMcq[];
  numeric:     KnowledgeCheckNumeric[];
  code:        KnowledgeCheckCodeProblem[];
}

export interface McqResult {
  id:          number;
  correct:     boolean;
  expected:    number[] | null;
  explanation: string;
  points:      number;
  earned:      number;
}

export interface CodeResult {
  id:     number;
  passed: boolean;
  earned: number;
  points: number;
}

export interface NumericResult {
  id:           number;
  correct:      boolean;
  expected:     string | null;
  tolerancePct?: number;
  unit:         string;
  explanation:  string;
  points:       number;
  earned:       number;
}

export interface KnowledgeCheckSubmission {
  scorePct: number;
  passed:   boolean;
  passPct:  number;
  results: {
    mcq:     McqResult[];
    numeric: NumericResult[];
    code:    CodeResult[];
  };
}

export interface SubmitMcqAnswer {
  id:    number;
  picks: number[];
}

export interface SubmitNumericAnswer {
  id:     number;
  answer: string;
}

export interface SubmitCodeResult {
  name:   string;
  passed: boolean;
  hidden?: boolean;
  weight?: number;
}

export interface SubmitCodeAnswer {
  id:      number;
  source:  string;
  results: SubmitCodeResult[];
}

export interface KnowledgeCheckStatusEntry {
  weekCheckId: number;
  scorePct:    number | null;
  passed:      boolean | null;
  attemptedAt: string | null;
}

/** Map keyed by "phase.week" — e.g. "1.1" → status for Phase 1 Week 1. */
export type KnowledgeCheckStatus = Record<string, KnowledgeCheckStatusEntry>;

export async function fetchKnowledgeCheck(
  language: Language,
  phase: number,
  week: number,
): Promise<KnowledgeCheck | null> {
  try {
    return await apiFetch<KnowledgeCheck>(`/api/knowledge-checks/${language}/${phase}/${week}`);
  } catch (err) {
    if ((err as { status?: number }).status === 404) return null;
    throw err;
  }
}

export async function submitKnowledgeCheck(
  weekCheckId: number,
  payload: { mcq: SubmitMcqAnswer[]; numeric: SubmitNumericAnswer[]; code: SubmitCodeAnswer[] },
): Promise<KnowledgeCheckSubmission> {
  return apiFetch(`/api/knowledge-checks/${weekCheckId}/submit`, {
    method: "POST",
    body:   JSON.stringify(payload),
  });
}

export async function fetchMyKnowledgeCheckStatus(
  language: Language,
): Promise<KnowledgeCheckStatus> {
  return apiFetch(`/api/knowledge-checks/${language}/me`);
}
