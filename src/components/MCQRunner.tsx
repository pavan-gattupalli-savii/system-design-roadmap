// ── MCQ / MAQ runner ──────────────────────────────────────────────────────────
// One radio group per single-select question, one checkbox group per
// multi-select. Locked after submit. Shared visual language with
// CheckpointPage so users don't need to relearn.

import { useEffect, useMemo, useState } from "react";
import MarkdownView from "./MarkdownView";
import type { KnowledgeCheckMcq, McqResult, SubmitMcqAnswer } from "../api/knowledgeCheck";

interface Props {
  items:        KnowledgeCheckMcq[];
  /** Result map by mcq id — present iff the user has already submitted. */
  resultsById?: Map<number, McqResult>;
  /** Locked while the parent is awaiting a submit response. */
  disabled?:    boolean;
  accent:       string;
  isMobile:     boolean;
  /** Lifted answers state — parent owns it so it can pass to /submit. */
  picks:        Record<number, number[]>;
  setPicks:     (next: Record<number, number[]>) => void;
}

export function MCQRunner({ items, resultsById, disabled, accent, isMobile, picks, setPicks }: Props) {
  // Local copy keeps re-renders cheap (parent only sees the final shape).
  const [local, setLocal] = useState<Record<number, number[]>>(picks);
  useEffect(() => { setLocal(picks); }, [picks]);

  function update(next: Record<number, number[]>) {
    setLocal(next);
    setPicks(next);
  }

  function toggle(qId: number, optIdx: number, multi: boolean) {
    if (resultsById || disabled) return;
    const current = local[qId] ?? [];
    if (multi) {
      const exists = current.includes(optIdx);
      const next = exists ? current.filter((i) => i !== optIdx) : [...current, optIdx];
      update({ ...local, [qId]: next });
    } else {
      update({ ...local, [qId]: [optIdx] });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {items.map((q, qi) => {
        const picked = local[q.id] ?? [];
        const result = resultsById?.get(q.id);
        const expected = result?.expected ?? null;
        return (
          <div key={q.id} style={{
            background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: 10,
            padding: isMobile ? "12px 12px" : "14px 16px",
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{
                fontSize: 10, color: accent, background: accent + "18", border: "1px solid " + accent + "44",
                borderRadius: 5, padding: "2px 8px", fontWeight: 700, flexShrink: 0, marginTop: 2,
              }}>
                Q{qi + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: "var(--text-heading)", lineHeight: 1.5, fontWeight: 600 }}>
                  <MarkdownView body={q.prompt} />
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>
                  {q.multi ? `Select all that apply · ${q.points} pt` : `Single answer · ${q.points} pt`}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 36 }}>
              {q.options.map((opt, i) => {
                const isPicked   = picked.includes(i);
                const isExpected = expected ? expected.includes(i) : false;
                // Wrong-pick = picked but not in expected (only after submit).
                const isWrongPick = !!result && isPicked && !isExpected;
                // Missed = expected but not picked.
                const isMissed    = !!result && !isPicked && isExpected;
                let bg = "transparent";
                let border = "1px solid var(--border)";
                let color = "var(--text-body)";
                if (result) {
                  if (isExpected)         { bg = "#4ade8014"; border = "1px solid #4ade8055"; color = "#4ade80"; }
                  else if (isWrongPick)   { bg = "#f8717114"; border = "1px solid #f8717155"; color = "#f87171"; }
                } else if (isPicked) {
                  bg = accent + "18"; border = "1px solid " + accent; color = accent;
                }
                return (
                  <button
                    key={i}
                    onClick={() => toggle(q.id, i, q.multi)}
                    disabled={!!result || disabled}
                    style={{
                      textAlign: "left", background: bg, border, color, borderRadius: 6,
                      padding: "8px 12px", fontSize: 12, fontFamily: "inherit",
                      cursor: result || disabled ? "default" : "pointer", transition: "all 0.15s",
                      display: "flex", alignItems: "center", gap: 8,
                    }}
                  >
                    <span style={{
                      width: 16, height: 16,
                      // Square for multi, circle for single — affordance signal.
                      borderRadius: q.multi ? 3 : "50%",
                      background: isPicked ? color : "transparent",
                      border: "1.5px solid " + (isPicked ? color : "var(--border-mid)"),
                      flexShrink: 0,
                    }} />
                    <span style={{ flex: 1 }}>{opt}</span>
                    {isExpected && result && <span style={{ marginLeft: "auto", fontWeight: 700 }}>✓</span>}
                    {isWrongPick && <span style={{ marginLeft: "auto", fontWeight: 700 }}>✗</span>}
                    {isMissed    && <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, color: "#4ade80" }}>missed</span>}
                  </button>
                );
              })}
            </div>
            {result && result.explanation && (
              <div style={{
                marginTop: 12, marginLeft: 36, padding: "10px 12px", borderRadius: 6,
                background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
                fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6,
              }}>
                <span style={{ color: "#fbbf24", marginRight: 4 }}>💡</span>
                <MarkdownView body={result.explanation} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Convert local picks → submit payload (drop unanswered). */
export function buildMcqSubmitPayload(picks: Record<number, number[]>): SubmitMcqAnswer[] {
  return Object.entries(picks)
    .filter(([, arr]) => arr && arr.length > 0)
    .map(([id, arr]) => ({ id: Number(id), picks: arr }));
}

/** Count of MCQs the user has at least one pick for. */
export function answeredCount(picks: Record<number, number[]>): number {
  return Object.values(picks).filter((a) => a && a.length > 0).length;
}

/** Memoised result lookup map. Hook keeps key sizes tiny. */
export function useResultsById(results: McqResult[] | undefined): Map<number, McqResult> | undefined {
  return useMemo(() => {
    if (!results) return undefined;
    return new Map(results.map((r) => [r.id, r]));
  }, [results]);
}
