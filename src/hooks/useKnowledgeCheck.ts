// ── useKnowledgeCheck hook ────────────────────────────────────────────────────
// Per-week MCQ + code-problem content (public) and per-user pass status
// (auth required). Status is exposed via useMyKnowledgeCheckStatus so the
// DetailPanel week-button strip can paint dots without forcing every week
// to refetch its own content.

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchKnowledgeCheck,
  fetchMyKnowledgeCheckStatus,
  submitKnowledgeCheck,
  type KnowledgeCheck,
  type KnowledgeCheckStatus,
  type KnowledgeCheckSubmission,
  type SubmitCodeAnswer,
  type SubmitMcqAnswer,
  type SubmitNumericAnswer,
} from "../api/knowledgeCheck";
import { useAuth } from "../lib/auth";
import { qk } from "../lib/queryKeys";
import type { Language } from "../data/roadmap-index";

export function useKnowledgeCheck(
  language: Language,
  phase: number | undefined,
  week: number | undefined,
) {
  const qc = useQueryClient();
  const enabled = phase !== undefined && week !== undefined && Number.isFinite(phase) && Number.isFinite(week);

  const { data, isLoading } = useQuery<KnowledgeCheck | null>({
    queryKey: qk.knowledgeCheck.byWeek(language, phase, week),
    queryFn:  () => fetchKnowledgeCheck(language, phase!, week!),
    enabled,
    // Content rarely changes — keep a long client-side TTL. The HTTP ETag
    // does the heavy lifting on actual cache misses.
    staleTime: 15 * 60_000,
    gcTime:    60 * 60_000,
  });

  const submitMutation = useMutation({
    mutationFn: (payload: { mcq: SubmitMcqAnswer[]; numeric: SubmitNumericAnswer[]; code: SubmitCodeAnswer[] }) => {
      if (!data) return Promise.reject(new Error("No knowledge check loaded"));
      return submitKnowledgeCheck(data.id, payload);
    },
    onSuccess: () => {
      // Bust the per-user status query so the dots update everywhere at once.
      qc.invalidateQueries({ queryKey: ["knowledge-check-status", language] });
    },
  });

  return {
    check:        data ?? null,
    isLoading,
    submit:       submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    result:       (submitMutation.data ?? null) as KnowledgeCheckSubmission | null,
    submitError:  submitMutation.error as Error | null,
    resetResult:  () => submitMutation.reset(),
  };
}

export function useMyKnowledgeCheckStatus(language: Language) {
  const { user } = useAuth();
  const { data, isLoading } = useQuery<KnowledgeCheckStatus>({
    queryKey: qk.knowledgeCheck.myStatus(language, user?.id),
    queryFn:  () => fetchMyKnowledgeCheckStatus(language),
    enabled:  !!user,
    staleTime: 60_000,
  });
  return { status: data ?? {}, isLoading };
}
