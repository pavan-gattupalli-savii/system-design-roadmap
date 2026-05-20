// ── KnowledgeCheckTab ─────────────────────────────────────────────────────────
// Lazy-loaded entry for the per-week Knowledge Check. Phase 1 ships MCQ only.
// Code-problem rendering (CodeChallengeRunner) lands in Phase 2 alongside the
// Pyodide loader and CodeMirror dynamic imports.

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKnowledgeCheck } from "../hooks/useKnowledgeCheck";
import { useAuth } from "../lib/auth";
import { MCQRunner, answeredCount, buildMcqSubmitPayload, useResultsById } from "./MCQRunner";
import { NumericRunner, buildNumericSubmitPayload, numericAnsweredCount } from "./NumericRunner";
import type { NumericResult } from "../api/knowledgeCheck";
import type { Language } from "../data/roadmap-index";

interface Props {
  language: Language;
  phase:    number;
  week:     number;
  accent:   string;
  isMobile: boolean;
}

export default function KnowledgeCheckTab({ language, phase, week, accent, isMobile }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { check, isLoading, submit, isSubmitting, result, submitError, resetResult } =
    useKnowledgeCheck(language, phase, week);

  // Picks/answers live in the tab so resetting clears them without remount.
  const [picks, setPicks] = useState<Record<number, number[]>>({});
  const [numericAnswers, setNumericAnswers] = useState<Record<number, string>>({});
  useEffect(() => {
    // Switching weeks/languages should clear local state.
    setPicks({});
    setNumericAnswers({});
    resetResult();
    // resetResult identity stable across hook lifetime — exhaustive-deps complains, accept.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, phase, week]);

  // Defensive: server shape may be older (no numeric/code) if React Query
  // cache survives across deploys. Fall back to empty arrays everywhere.
  const mcqItems     = check?.mcq     ?? [];
  const numericItems = check?.numeric ?? [];

  const mcqResultsById = useResultsById(result?.results.mcq);
  const numericResultsById = useMemo(() => {
    if (!result?.results?.numeric) return undefined;
    return new Map<number, NumericResult>(result.results.numeric.map((r) => [r.id, r]));
  }, [result]);

  const totalMcq     = mcqItems.length;
  const totalNumeric = numericItems.length;
  const total        = totalMcq + totalNumeric;
  const answered     = useMemo(
    () => answeredCount(picks) + numericAnsweredCount(numericAnswers),
    [picks, numericAnswers],
  );
  const allAnswered = total > 0 && answered === total;

  async function handleSubmit() {
    if (!user) {
      navigate(`/sign-in?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    if (!check) return;
    try {
      await submit({
        mcq:     buildMcqSubmitPayload(picks),
        numeric: buildNumericSubmitPayload(numericAnswers),
        code:    [],
      });
    } catch {
      // Error surfaced via submitError below.
    }
  }

  function handleRetake() {
    setPicks({});
    setNumericAnswers({});
    resetResult();
  }

  if (isLoading) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
        Loading knowledge check…
      </div>
    );
  }
  if (!check) {
    return (
      <div style={{ padding: 24, color: "var(--text-secondary)" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>
          No knowledge check authored for this week yet.
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Content is being added week by week — check back soon.
        </div>
      </div>
    );
  }

  const passColor = "#4ade80";
  const failColor = "#f87171";
  const showResult = !!result;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header card */}
      <div style={{
        padding: "12px 14px", borderRadius: 10,
        background: accent + "0d", border: "1px solid " + accent + "33",
      }}>
        <div style={{ fontSize: 10, color: accent, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700 }}>
          🧪 Knowledge check
        </div>
        <div style={{ fontSize: 14, color: "var(--text-heading)", fontWeight: 700, marginTop: 3 }}>
          {check.title}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
          {totalMcq > 0 && <>{totalMcq} MCQ</>}
          {totalMcq > 0 && totalNumeric > 0 && <> · </>}
          {totalNumeric > 0 && <>{totalNumeric} estimation</>}
          {(totalMcq > 0 || totalNumeric > 0) && <> · </>}
          Pass threshold {check.passPct}%
        </div>
      </div>

      {/* Result banner */}
      {showResult && result && (
        <div style={{
          padding: "12px 16px", borderRadius: 8,
          background: (result.passed ? passColor : failColor) + "14",
          border:     "1px solid " + (result.passed ? passColor : failColor) + "55",
          color:      result.passed ? passColor : failColor,
          fontSize: 13, fontWeight: 600,
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap",
        }}>
          <span>
            {result.passed ? "✅ Passed" : "❌ Below threshold"} — {result.scorePct}%
            {" "}<span style={{ opacity: 0.7, fontWeight: 500 }}>(needs {result.passPct}%)</span>
          </span>
          <button
            onClick={handleRetake}
            style={{ background: "transparent", border: "1px solid currentColor", color: "inherit", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >
            Retake
          </button>
        </div>
      )}

      {/* MCQ block */}
      {totalMcq > 0 && (
        <MCQRunner
          items={mcqItems}
          resultsById={mcqResultsById}
          disabled={isSubmitting}
          accent={accent}
          isMobile={isMobile}
          picks={picks}
          setPicks={setPicks}
        />
      )}

      {/* Numeric / estimation block */}
      {totalNumeric > 0 && (
        <NumericRunner
          items={numericItems}
          resultsById={numericResultsById}
          disabled={isSubmitting}
          accent={accent}
          isMobile={isMobile}
          answers={numericAnswers}
          setAnswers={setNumericAnswers}
        />
      )}

      {/* Submit bar (hidden after result) */}
      {!showResult && total > 0 && (
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !allAnswered}
            style={{
              background: allAnswered ? accent : "var(--bg-card)",
              color: allAnswered ? "#fff" : "var(--text-muted)",
              border: "none", borderRadius: 7, padding: "9px 22px",
              fontSize: 13, fontWeight: 700, fontFamily: "inherit",
              cursor: isSubmitting || !allAnswered ? "default" : "pointer",
              opacity: isSubmitting ? 0.6 : 1, transition: "all 0.15s",
            }}
          >
            {isSubmitting ? "Grading…" : user ? "Submit answers" : "Sign in to submit"}
          </button>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {answered}/{total} answered
          </span>
          {submitError && (
            <span style={{ fontSize: 12, color: failColor }}>{submitError.message}</span>
          )}
        </div>
      )}
    </div>
  );
}
