// ── Numeric / range-match runner ──────────────────────────────────────────────
// One input per estimation question. Locked after submit, with the expected
// value, tolerance, and explanation revealed inline.

import { useEffect, useState } from "react";
import MarkdownView from "./MarkdownView";
import type { KnowledgeCheckNumeric, NumericResult, SubmitNumericAnswer } from "../api/knowledgeCheck";

interface Props {
  items:        KnowledgeCheckNumeric[];
  resultsById?: Map<number, NumericResult>;
  disabled?:    boolean;
  accent:       string;
  isMobile:     boolean;
  answers:      Record<number, string>;
  setAnswers:   (next: Record<number, string>) => void;
}

export function NumericRunner({ items, resultsById, disabled, accent, isMobile, answers, setAnswers }: Props) {
  const [local, setLocal] = useState<Record<number, string>>(answers);
  useEffect(() => { setLocal(answers); }, [answers]);

  function update(id: number, value: string) {
    if (resultsById || disabled) return;
    const next = { ...local, [id]: value };
    setLocal(next);
    setAnswers(next);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {items.map((q, qi) => {
        const value  = local[q.id] ?? "";
        const result = resultsById?.get(q.id);
        const lockedBg = result
          ? (result.correct ? "#4ade8014" : "#f8717114")
          : "var(--bg-panel)";
        const lockedBorder = result
          ? (result.correct ? "#4ade8055" : "#f8717155")
          : "var(--border)";

        return (
          <div key={q.id} style={{
            background: lockedBg,
            border: "1px solid " + lockedBorder, borderRadius: 10,
            padding: isMobile ? "12px 12px" : "14px 16px",
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{
                fontSize: 10, color: accent, background: accent + "18", border: "1px solid " + accent + "44",
                borderRadius: 5, padding: "2px 8px", fontWeight: 700, flexShrink: 0, marginTop: 2,
              }}>
                E{qi + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: "var(--text-heading)", lineHeight: 1.5, fontWeight: 600 }}>
                  <MarkdownView body={q.prompt} />
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>
                  Numeric · {q.points} pt{q.points === 1 ? "" : "s"}
                  {q.unit && <> · expected unit: <code>{q.unit}</code></>}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: 36, flexWrap: "wrap" }}>
              <input
                type="text"
                inputMode="decimal"
                value={value}
                onChange={(e) => update(q.id, e.target.value)}
                disabled={!!result || disabled}
                placeholder={q.unit ? `e.g. 10 ${q.unit}` : "Your answer"}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-body)",
                  borderRadius: 6,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontFamily: "inherit",
                  width: 180,
                }}
              />
              {q.unit && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{q.unit}</span>}
              {result && (
                <span style={{
                  marginLeft: "auto",
                  fontSize: 11, fontWeight: 700,
                  color: result.correct ? "#4ade80" : "#f87171",
                }}>
                  {result.correct ? "✓ correct" : "✗ off"}
                  {result.expected !== null && (
                    <span style={{ marginLeft: 8, fontWeight: 500, color: "var(--text-secondary)" }}>
                      expected ≈ {result.expected}
                      {result.unit && " " + result.unit}
                      {typeof result.tolerancePct === "number" && (
                        <span style={{ color: "var(--text-muted)" }}> (±{result.tolerancePct}%)</span>
                      )}
                    </span>
                  )}
                </span>
              )}
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

/** Convert local answers → submit payload (drop blanks). */
export function buildNumericSubmitPayload(answers: Record<number, string>): SubmitNumericAnswer[] {
  return Object.entries(answers)
    .filter(([, v]) => v && v.trim().length > 0)
    .map(([id, v]) => ({ id: Number(id), answer: v.trim() }));
}

export function numericAnsweredCount(answers: Record<number, string>): number {
  return Object.values(answers).filter((v) => v && v.trim().length > 0).length;
}
