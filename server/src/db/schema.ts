// ── Drizzle ORM schema ─────────────────────────────────────────────────────────
// Mirrors the PostgreSQL tables created in scripts/migrate.ts.
// Column names use camelCase here; the actual DB column names are in snake_case
// (passed as the first argument to each column helper).

import {
  pgTable, serial, text, integer, boolean, timestamp, uuid,
  primaryKey, customType, uniqueIndex, jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// citext — case-insensitive text (requires the citext Postgres extension)
const citext = customType<{ data: string; driverData: string }>({
  dataType() { return "citext"; },
});

// ── Community: Readings ──────────────────────────────────────────────────────
export const readings = pgTable("readings", {
  id:          uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  type:        text("type").notNull(),
  title:       text("title").notNull(),
  url:         text("url").notNull(),
  topics:      text("topics").array().notNull().default([]),
  difficulty:  text("difficulty"),
  upvotes:     integer("upvotes").notNull().default(0),
  notes:       text("notes"),
  isApproved:  boolean("is_approved").notNull().default(true),
  createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  submittedBy: uuid("submitted_by"),
});

// ── Community: Interview questions ───────────────────────────────────────────
export const interviewQuestions = pgTable("interview_questions", {
  id:          uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  category:    text("category").notNull(),
  title:       text("title").notNull(),
  difficulty:  text("difficulty").notNull(),
  companies:   text("companies").array().notNull().default([]),
  topics:      text("topics").array().notNull().default([]),
  hints:       text("hints").array().notNull().default([]),
  followUps:   text("follow_ups").array().notNull().default([]),
  isApproved:  boolean("is_approved").notNull().default(true),
  createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  submittedBy: uuid("submitted_by"),
});

// ── Community: Answer docs (linked to interview questions) ───────────────────
export const answerDocs = pgTable("answer_docs", {
  id:          uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  questionId:  uuid("question_id").notNull(),
  label:       text("label").notNull(),
  url:         text("url").notNull(),
  isApproved:  boolean("is_approved").notNull().default(true),
  createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  submittedBy: uuid("submitted_by"),
});

// ── Community: Interview experiences ────────────────────────────────────────
export const experiences = pgTable("experiences", {
  id:          uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  title:       text("title").notNull(),
  url:         text("url").notNull(),
  platform:    text("platform").notNull(),
  company:     text("company").notNull(),
  role:        text("role").notNull(),
  outcome:     text("outcome"),
  topics:      text("topics").array().notNull().default([]),
  notes:       text("notes"),
  upvotes:     integer("upvotes").notNull().default(0),
  isApproved:  boolean("is_approved").notNull().default(true),
  createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  submittedBy: uuid("submitted_by"),
});

// ── Roadmap: Phases ───────────────────────────────────────────────────────────
export const roadmapPhases = pgTable("roadmap_phases", {
  id:          serial("id").primaryKey(),
  language:    text("language").notNull(),
  phaseNumber: integer("phase_number").notNull(),
  title:       text("title").notNull(),
  icon:        text("icon").notNull().default(""),
  accent:      text("accent").notNull().default("#6366f1"),
  light:       text("light").notNull().default("#a5b4fc"),
  description: text("description").notNull().default(""),
  outcomes:    text("outcomes").array().notNull().default([]),
});

// ── Roadmap: Weeks ────────────────────────────────────────────────────────────
export const roadmapWeeks = pgTable("roadmap_weeks", {
  id:                 serial("id").primaryKey(),
  phaseId:            integer("phase_id").notNull(),
  weekNumber:         integer("week_number").notNull(),
  title:              text("title").notNull(),
  learningObjectives: text("learning_objectives").array().notNull().default([]),
});

// ── Roadmap: Sessions ────────────────────────────────────────────────────────
export const roadmapSessions = pgTable("roadmap_sessions", {
  id:        serial("id").primaryKey(),
  weekId:    integer("week_id").notNull(),
  label:     text("label").notNull(),
  focus:     text("focus").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Roadmap: Resources ────────────────────────────────────────────────────────
export const roadmapResources = pgTable("roadmap_resources", {
  id:        serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  type:      text("type").notNull(),
  item:      text("item").notNull(),
  whereText: text("where_text").notNull().default(""),
  mins:      integer("mins").notNull().default(0),
  url:       text("url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isCore:    boolean("is_core").notNull().default(true),
});

// ── Build specs (rich Build resource detail) ──────────────────────────────────
export const buildSpecs = pgTable("build_specs", {
  id:            serial("id").primaryKey(),
  language:      text("language").notNull(),
  resourceKey:   text("resource_key").notNull(),
  overview:      text("overview").notNull(),
  requirements:  text("requirements").array().notNull().default([]),
  acceptance:    text("acceptance").array().notNull().default([]),
  diagram:       text("diagram"),
  hints:         text("hints").array().notNull().default([]),
  difficulty:    text("difficulty").notNull().default("intermediate"),
  stretchGoals:  text("stretch_goals").array().notNull().default([]),
  pitfalls:      text("pitfalls").array().notNull().default([]),
  estHours:      integer("est_hours").notNull().default(0),
  tags:          text("tags").array().notNull().default([]),
  prerequisites: text("prerequisites").array().notNull().default([]),
  references:    jsonb("references").notNull().default([]),
}, (t) => [uniqueIndex("build_specs_lang_key_uq").on(t.language, t.resourceKey)]);

// ── Concepts (system-design vocab) ────────────────────────────────────────────
export const concepts = pgTable("concepts", {
  slug:             text("slug").primaryKey(),
  title:            text("title").notNull(),
  emoji:            text("emoji").notNull().default(""),
  category:         text("category").notNull(),
  tagline:          text("tagline").notNull(),
  sections:         jsonb("sections").notNull().default([]),
  related:          text("related").array().notNull().default([]),
  roadmapKeywords:  text("roadmap_keywords").array().notNull().default([]),
  sortOrder:        integer("sort_order").notNull().default(0),
  createdAt:        timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Concept ↔ week curated links ──────────────────────────────────────────────
export const conceptWeekLinks = pgTable(
  "concept_week_links",
  {
    conceptSlug:  text("concept_slug").notNull(),
    language:     text("language").notNull(),
    phaseNumber:  integer("phase_number").notNull(),
    weekNumber:   integer("week_number").notNull(),
  },
  (t) => [primaryKey({ columns: [t.conceptSlug, t.language, t.phaseNumber, t.weekNumber] })],
);

// ── User notes per resource ───────────────────────────────────────────────────
export const userNotes = pgTable(
  "user_notes",
  {
    userId:      uuid("user_id").notNull(),
    language:    text("language").notNull(),
    resourceKey: text("resource_key").notNull(),
    bodyMd:      text("body_md").notNull(),
    updatedAt:   timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.language, t.resourceKey] })],
);

// ── Phase checkpoint quizzes ──────────────────────────────────────────────────
export const phaseCheckpoints = pgTable("phase_checkpoints", {
  id:           serial("id").primaryKey(),
  language:     text("language").notNull(),
  phaseNumber:  integer("phase_number").notNull(),
  question:     text("question").notNull(),
  options:      jsonb("options").notNull(),
  answerIdx:    integer("answer_idx").notNull(),
  explanation:  text("explanation").notNull().default(""),
  sortOrder:    integer("sort_order").notNull().default(0),
  createdAt:    timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userCheckpointAttempts = pgTable(
  "user_checkpoint_attempts",
  {
    userId:       uuid("user_id").notNull(),
    checkpointId: integer("checkpoint_id").notNull(),
    passed:       boolean("passed").notNull(),
    attemptedAt:  timestamp("attempted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.checkpointId] })],
);

// ── Per-week knowledge check (MCQ/MAQ + code problems) ───────────────────────
// One row per (language, phaseNumber, weekNumber). Children: weekCheckMcq +
// weekCheckCodeProblems → weekCheckCodeTests. Unique index lets us upsert by
// the natural key during seed without storing the FK back into roadmap_weeks.
export const weekChecks = pgTable(
  "week_checks",
  {
    id:          serial("id").primaryKey(),
    language:    text("language").notNull(),
    phaseNumber: integer("phase_number").notNull(),
    weekNumber:  integer("week_number").notNull(),
    title:       text("title").notNull().default("Knowledge check"),
    passPct:     integer("pass_pct").notNull().default(70),
    createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("week_checks_lang_phase_week_uq").on(t.language, t.phaseNumber, t.weekNumber)],
);

// MCQ + MAQ in one table — `correct` is a jsonb int[] of valid option indices.
// Length 1 → single-select; length > 1 → multi-select. UI infers type.
export const weekCheckMcq = pgTable("week_check_mcq", {
  id:          serial("id").primaryKey(),
  weekCheckId: integer("week_check_id").notNull(),
  prompt:      text("prompt").notNull(),
  options:     jsonb("options").notNull(),     // string[]
  correct:     jsonb("correct").notNull(),     // number[]
  explanation: text("explanation").notNull().default(""),
  points:      integer("points").notNull().default(1),
  sortOrder:   integer("sort_order").notNull().default(0),
});

// Code problems — `runtime` selects executor (Python = Pyodide, Java = Piston
// in later phase). `entryFn` is the function/method the harness invokes per
// test. `starter` is shown in the editor; never used for grading.
export const weekCheckCodeProblems = pgTable("week_check_code_problems", {
  id:           serial("id").primaryKey(),
  weekCheckId:  integer("week_check_id").notNull(),
  runtime:      text("runtime").notNull(),     // 'python' | 'java'
  title:        text("title").notNull(),
  prompt:       text("prompt").notNull(),
  starter:      text("starter").notNull().default(""),
  entryFn:      text("entry_fn"),
  timeoutMs:    integer("timeout_ms").notNull().default(3000),
  points:       integer("points").notNull().default(3),
  sortOrder:    integer("sort_order").notNull().default(0),
});

// Per-test case. `hidden` cases never have their input/expected leaked to the
// browser through the public GET — only their existence and pass/fail.
export const weekCheckCodeTests = pgTable("week_check_code_tests", {
  id:         serial("id").primaryKey(),
  problemId:  integer("problem_id").notNull(),
  name:       text("name").notNull().default(""),
  input:      jsonb("input").notNull(),
  expected:   jsonb("expected").notNull(),
  hidden:     boolean("hidden").notNull().default(false),
  weight:     integer("weight").notNull().default(1),
  sortOrder:  integer("sort_order").notNull().default(0),
});

// Numeric / range-match estimation question. Grader accepts answers within
// `tolerancePct` of `expected` (deterministic, no LLM). Use for back-of-
// envelope sizing — storage, latency budgets, QPS targets. `unit` is a
// display hint only ("GB", "ms", "QPS") and never participates in grading.
export const weekCheckNumeric = pgTable("week_check_numeric", {
  id:           serial("id").primaryKey(),
  weekCheckId:  integer("week_check_id").notNull(),
  prompt:       text("prompt").notNull(),
  expected:     text("expected").notNull(),     // text to preserve large numbers / scientific notation
  tolerancePct: integer("tolerance_pct").notNull().default(10),
  unit:         text("unit").notNull().default(""),
  explanation:  text("explanation").notNull().default(""),
  points:       integer("points").notNull().default(2),
  sortOrder:    integer("sort_order").notNull().default(0),
});

// Aggregate attempt row — one per (user, weekCheck). Upserted on every
// submit; best-score-wins handled at the route level.
export const userWeekCheckAttempts = pgTable(
  "user_week_check_attempts",
  {
    userId:       uuid("user_id").notNull(),
    weekCheckId:  integer("week_check_id").notNull(),
    scorePct:     integer("score_pct").notNull(),
    passed:       boolean("passed").notNull(),
    attemptedAt:  timestamp("attempted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.weekCheckId] })],
);

// Per-item evidence — `itemType` is 'mcq' | 'code'. Lets us show "wrong last
// time, right this time" hints and audit code submissions later if needed.
export const userWeekCheckAnswers = pgTable(
  "user_week_check_answers",
  {
    userId:       uuid("user_id").notNull(),
    weekCheckId:  integer("week_check_id").notNull(),
    itemType:     text("item_type").notNull(),
    itemId:       integer("item_id").notNull(),
    correct:      boolean("correct").notNull(),
    payload:      jsonb("payload").notNull(),
    attemptedAt:  timestamp("attempted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.weekCheckId, t.itemType, t.itemId] })],
);

// ── Users ─────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id:               uuid("id").primaryKey().defaultRandom(),
  email:            citext("email").notNull().unique(),
  emailVerifiedAt:  timestamp("email_verified_at", { withTimezone: true }),
  displayName:      text("display_name").notNull().default(""),
  github:           text("github"),
  linkedin:         text("linkedin"),
  role:             text("role").notNull().default("user"),
  createdAt:        timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastLoginAt:      timestamp("last_login_at", { withTimezone: true }),
  passwordHash:     text("password_hash"),
});

// ── Email OTPs ────────────────────────────────────────────────────────────────
export const emailOtps = pgTable("email_otps", {
  email:      citext("email").primaryKey(),
  codeHash:   text("code_hash").notNull(),
  expiresAt:  timestamp("expires_at", { withTimezone: true }).notNull(),
  attempts:   integer("attempts").notNull().default(0),
  lastSentAt: timestamp("last_sent_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Per-user roadmap progress ─────────────────────────────────────────────────
export const userProgress = pgTable(
  "user_progress",
  {
    userId:      uuid("user_id").notNull(),
    language:    text("language").notNull(),
    resourceKey: text("resource_key").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.language, t.resourceKey] })],
);

// ── Per-user reading upvotes ──────────────────────────────────────────────────
export const readingUpvotes = pgTable(
  "reading_upvotes",
  {
    userId:    uuid("user_id").notNull(),
    readingId: uuid("reading_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.readingId] })],
);

// ── Per-user experience upvotes ───────────────────────────────────────────────
export const experienceUpvotes = pgTable(
  "experience_upvotes",
  {
    userId:       uuid("user_id").notNull(),
    experienceId: uuid("experience_id").notNull(),
    createdAt:    timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.experienceId] })],
);

// ── Per-user practiced questions ──────────────────────────────────────────────
export const userPracticedQuestions = pgTable(
  "user_practiced_questions",
  {
    userId:      uuid("user_id").notNull(),
    questionId:  uuid("question_id").notNull(),
    practicedAt: timestamp("practiced_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.questionId] })],
);

// ── Daily topic completions ────────────────────────────────────────────────────
// Records which UTC dates a user marked the daily topic as "read".
// `topicDate` is stored as "YYYY-MM-DD" text to avoid timezone edge cases.
export const dailyCompletions = pgTable(
  "daily_completions",
  {
    userId:      uuid("user_id").notNull(),
    topicDate:   text("topic_date").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.topicDate] })],
);

// ── Build submissions ─────────────────────────────────────────────────────────
// One row per user per roadmap build resource. resourceKey = resId() string
// ("phase_weekN_si_ri"). Unique on (userId, language, resourceKey) — upsert.
export const buildSubmissions = pgTable(
  "build_submissions",
  {
    id:          uuid("id").primaryKey().defaultRandom(),
    userId:      uuid("user_id").notNull(),
    language:    text("language").notNull(),
    resourceKey: text("resource_key").notNull(),
    githubUrl:   text("github_url").notNull(),
    notes:       text("notes"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:   timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("build_submissions_user_lang_key").on(t.userId, t.language, t.resourceKey)],
);

// ── Per-user bookmarks ─────────────────────────────────────────────────────────
// Polymorphic: resourceType discriminates which table resourceId belongs to.
// resourceType: "reading" | "experience" | "question" | "roadmap_resource"
// resourceId: UUID for DB items; resId(phase,weekN,si,ri) string for roadmap resources.
export const bookmarks = pgTable(
  "bookmarks",
  {
    userId:       uuid("user_id").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId:   text("resource_id").notNull(),
    createdAt:    timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.resourceType, t.resourceId] })],
);
