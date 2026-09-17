// ── Knowledge check authored content ──────────────────────────────────────────
// Each entry is grounded in that week's curated roadmap resources — questions
// reflect concepts you'd actually see in the linked docs/videos/articles and
// in real interview rounds. No textbook trivia.
//
// Prompts support markdown — embed fenced code, tables, scenarios freely.
// Renderer = `src/components/MarkdownView.tsx`.

import { REVIEW_CHECKS } from "./knowledge-checks-review";

export type Runtime = "python" | "java";

export interface McqSeed {
  prompt:       string;
  options:      string[];
  /** Indices of valid options. Length 1 = single-select, > 1 = multi-select. */
  correct:      number[];
  explanation?: string;
  points?:      number;
}

export interface NumericSeed {
  prompt:        string;
  /** Numeric answer as a string — preserves scientific notation like "1.2e9". */
  expected:      string;
  tolerancePct?: number;
  unit?:         string;
  explanation?:  string;
  points?:       number;
}

export interface WeekCheckSeed {
  language: Runtime;
  phase:    number;
  week:     number;
  title?:   string;
  passPct?: number;
  mcq:      McqSeed[];
  numeric?: NumericSeed[];
  code?:    never[];
}

export const KNOWLEDGE_CHECKS: WeekCheckSeed[] = [
  ...REVIEW_CHECKS,
  // ───────────────────────────────────────────────────────────────────────────
  // PYTHON · Phase 1 · Week 1 — "Python Setup & Core Syntax"
  // Sourced from: Python Tutorial Ch 3 (intro) + Ch 4 (control flow),
  //   Real Python "f-strings are awesome", Tech With Tim beginner course.
  // Build context: temperature converter + word frequency counter.
  // ───────────────────────────────────────────────────────────────────────────
  {
    language: "python",
    phase: 1,
    week: 1,
    title: "Week 1 — Python Setup & Core Syntax",
    passPct: 70,
    mcq: [
      // ── f-strings (from Real Python article) ─────────────────────────────
      {
        prompt:
          "**f-string formatting.** What does this print?\n\n```python\nprice = 1234.5678\nprint(f\"{price:,.2f}\")\n```",
        options: ["`1234.57`", "`1,234.57`", "`1,234.5678`", "`1234.5678`"],
        correct: [1],
        explanation:
          "The format spec `,.2f` means: comma-grouped thousands + 2 decimal places fixed-point. Reference: Real Python — *Python f-strings are awesome* (formatting mini-language section).",
        points: 2,
      },
      {
        prompt:
          "**f-string debug shortcut (Python 3.8+).** Which output does this produce?\n\n```python\nuser = \"ada\"\ncount = 3\nprint(f\"{user=} {count=}\")\n```",
        options: [
          "`user count` (no values)",
          "`user='ada' count=3`",
          "`ada 3`",
          "SyntaxError",
        ],
        correct: [1],
        explanation:
          "The `=` suffix inside `{}` prints both the expression text and its value — added in 3.8 for fast debugging. Covered in the f-strings article.",
        points: 2,
      },

      // ── Control flow (from Tutorial Ch 4) ────────────────────────────────
      {
        prompt:
          "**for…else gotcha** (Python Tutorial Ch 4). What does this print for `nums = [2, 4, 6]`?\n\n```python\nfor n in nums:\n    if n % 2 == 1:\n        print(\"found odd\")\n        break\nelse:\n    print(\"all even\")\n```",
        options: [
          "`found odd`",
          "`all even`",
          "Nothing — the `else` is a syntax error here",
          "Both lines",
        ],
        correct: [1],
        explanation:
          "Python's `for…else` runs the `else` block **only if the loop completed without `break`**. None of the numbers are odd → no break → `all even` prints. This is straight out of Tutorial Ch 4.",
        points: 2,
      },
      {
        prompt:
          "**Truthy / falsy** — which of these evaluate to `False` when used in `if`? *(select all)*\n\n```python\n0\n0.0\n\"\"\n[]\n\"False\"\n{0}\n```",
        options: ["`0`", "`0.0`", '`""` (empty str)', "`[]` (empty list)", '`"False"` (the string)', "`{0}` (set with zero in it)"],
        correct: [0, 1, 2, 3],
        explanation:
          "Falsy: `0`, `0.0`, `\"\"`, `[]`, `{}`, `set()`, `None`, `False`. **The string `\"False\"` is non-empty so it's truthy.** A set containing `0` is non-empty so also truthy. Classic interview trap.",
        points: 3,
      },

      // ── Reference vs value (build context — word counter, etc.) ──────────
      {
        prompt:
          "**Reference semantics.** Predict the output:\n\n```python\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)\n```",
        options: [
          "`[1, 2, 3]`",
          "`[1, 2, 3, 4]`",
          "`[4]`",
          "Error: cannot mutate shared list",
        ],
        correct: [1],
        explanation:
          "Assignment binds **names to the same object**, it doesn't copy. `a` and `b` point at the same list — mutation is visible through either. Use `b = a.copy()` (or `list(a)` / `a[:]`) for an independent copy.",
        points: 2,
      },

      // ── Mutable default arg — top-3 Python gotcha in interviews ─────────
      {
        prompt:
          "**Classic interview trap.** What does this print?\n\n```python\ndef add(item, bucket=[]):\n    bucket.append(item)\n    return bucket\n\nprint(add(1))\nprint(add(2))\n```",
        options: [
          "`[1]` then `[2]`",
          "`[1]` then `[1, 2]`",
          "`[1]` then `[]`",
          "TypeError",
        ],
        correct: [1],
        explanation:
          "Default arguments are evaluated **once at function definition**, not on every call. The same list is reused across calls, so it accumulates. Fix: use `bucket=None` then `bucket = [] if bucket is None else bucket`.",
        points: 3,
      },

      // ── Environment / project setup ──────────────────────────────────────
      {
        prompt:
          "**Why venv?** What problem does a virtual environment primarily solve?",
        options: [
          "Makes Python run faster",
          "Isolates each project's dependencies so versions don't collide",
          "Adds type checking automatically",
          "Replaces the need for `pip`",
        ],
        correct: [1],
        explanation:
          "venv gives each project its own `site-packages`. Project A on Django 4 and Project B on Django 5 coexist without conflict. Discussed in Tech With Tim's setup section.",
        points: 1,
      },

      // ── File reading idiom (used in word-counter build) ──────────────────
      {
        prompt:
          "**File handling for the word counter build.** Which is the **idiomatic** way to read a file safely?",
        options: [
          "```python\nf = open(\"words.txt\")\ntext = f.read()\nf.close()\n```",
          "```python\nwith open(\"words.txt\") as f:\n    text = f.read()\n```",
          "```python\ntext = open(\"words.txt\").read()\n```",
          "```python\nimport os\ntext = os.read(\"words.txt\")\n```",
        ],
        correct: [1],
        explanation:
          "`with` closes the file deterministically even if an exception fires inside the block. Option 1 leaks on exceptions; option 3 leaks a file descriptor until GC.",
        points: 2,
      },
    ],
    numeric: [
      {
        prompt:
          "**Temperature converter build.** Fahrenheit `f` to Celsius is `(f - 32) × 5/9`. What is **98.6 °F in °C** (rounded to 1 decimal)?",
        expected: "37.0",
        tolerancePct: 5,
        unit: "°C",
        explanation: "(98.6 − 32) × 5/9 = 66.6 × 5/9 = 37.0 °C — the freezing/normal body benchmark.",
        points: 2,
      },
      {
        prompt:
          "**Word counter back-of-envelope.** A 5 MB plain-text file averaging 5 bytes per word. Roughly how many **words** does it contain (in thousands)?",
        expected: "1000",
        tolerancePct: 20,
        unit: "thousand words",
        explanation: "5 × 10⁶ bytes ÷ 5 bytes/word = 10⁶ words ≈ 1,000 thousand.",
        points: 2,
      },
    ],
    code: [],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // JAVA · Phase 1 · Week 1 — "Generics, Records & Modern Java Features"
  // Sourced from: Effective Java 3e Items 26–33 (Generics),
  //   JEPs 395 (Records), 409 (Sealed Classes), 441 (Pattern Matching for switch),
  //   Baeldung "New Features in Java 21", Coding with John "Generics in Java".
  // ───────────────────────────────────────────────────────────────────────────
  {
    language: "java",
    phase: 1,
    week: 1,
    title: "Week 1 — Generics, Records & Modern Java",
    passPct: 70,
    mcq: [
      // ── Generics: PECS (Effective Java Item 31) ──────────────────────────
      {
        prompt:
          "**PECS — Producer Extends, Consumer Super.** Which signature accepts a `List<Integer>` **and** a `List<Number>` as input?\n\n```java\nstatic double sumOf(List<???> nums) { ... }\n```",
        options: [
          "`List<Number>`",
          "`List<? extends Number>`",
          "`List<? super Number>`",
          "`List<Object>`",
        ],
        correct: [1],
        explanation:
          "`List<Number>` would reject `List<Integer>` (generics are invariant). PECS says: when the parameter **produces** values you read out, use `extends`. Effective Java Item 31.",
        points: 2,
      },
      {
        prompt:
          "**Erasure quiz.** What does this print at runtime?\n\n```java\nList<String> a = new ArrayList<>();\nList<Integer> b = new ArrayList<>();\nSystem.out.println(a.getClass() == b.getClass());\n```",
        options: ["`true`", "`false`", "Compile error", "Throws `ClassCastException`"],
        correct: [0],
        explanation:
          "Java generics are **erased** at runtime — both objects are just `ArrayList` after compilation. Effective Java Item 28 covers why arrays of generic types are disallowed.",
        points: 2,
      },
      {
        prompt:
          "**Raw types** (Effective Java Item 26). Which statements are **true**? *(select all)*",
        options: [
          "`List` (raw) is the same as `List<Object>` at runtime",
          "Using raw types disables generic type checking — you can put anything in",
          "`List<Object>` accepts a `List<String>` argument",
          "Raw types exist only for backward compatibility with pre-Java-5 code",
        ],
        correct: [0, 1, 3],
        explanation:
          "Erasure means raw `List` ≡ `List<Object>` at runtime, but the compiler **skips type checks** on raw refs. `List<Object>` does **not** accept `List<String>` (generics are invariant). Raw types are a legacy bridge — never use them in new code.",
        points: 3,
      },

      // ── Records (JEP 395) ────────────────────────────────────────────────
      {
        prompt:
          "**Records.** Given:\n\n```java\nrecord Point(int x, int y) {}\n```\n\nWhich methods are auto-generated? *(select all)*",
        options: [
          "`equals(Object)` — compares components",
          "`hashCode()` — based on components",
          "`toString()` — `Point[x=1, y=2]`-style",
          "Accessors `x()` and `y()`",
          "Setters `setX()` and `setY()`",
        ],
        correct: [0, 1, 2, 3],
        explanation:
          "Records auto-generate equals, hashCode, toString, and component accessors. **Setters are never generated** — records are shallowly immutable by design. JEP 395.",
        points: 3,
      },
      {
        prompt:
          "**Record immutability is shallow.** Which statement is true about the record below?\n\n```java\nrecord Cart(List<String> items) {}\n```",
        options: [
          "`cart.items().add(\"x\")` will fail — the list is immutable",
          "`cart.items().add(\"x\")` mutates the underlying list; record fields are final but the list itself isn't",
          "`Cart` won't compile — records can't hold mutable types",
          "Calling `items()` returns a defensive copy by default",
        ],
        correct: [1],
        explanation:
          "Records freeze the **reference**, not the referenced object. Defensive-copy in a **compact constructor** if you need deep immutability:\n\n```java\nrecord Cart(List<String> items) {\n  Cart { items = List.copyOf(items); }\n}\n```",
        points: 3,
      },

      // ── Sealed classes + pattern matching switch (JEPs 409, 441) ─────────
      {
        prompt:
          "**Sealed + pattern matching for switch.** Given:\n\n```java\nsealed interface Shape permits Circle, Square, Triangle {}\nrecord Circle(double r) implements Shape {}\nrecord Square(double s) implements Shape {}\nrecord Triangle(double b, double h) implements Shape {}\n```\n\nWhich is the **biggest** advantage of `sealed` here?",
        options: [
          "Sealed types run faster than open ones",
          "The compiler can prove a `switch` is exhaustive — no `default` branch needed",
          "Sealed types can't be subclassed at all",
          "Records can only implement sealed interfaces",
        ],
        correct: [1],
        explanation:
          "Closed hierarchy → compiler knows the full set of subtypes → exhaustive switch without a `default` arm. Add a new permitted subtype later and every switch becomes a compile error until handled. JEP 409 + JEP 441.",
        points: 2,
      },
      {
        prompt:
          "**Pattern matching for switch (Java 21).** What does this print for `shape = new Circle(2.0)`?\n\n```java\nString describe(Shape shape) {\n    return switch (shape) {\n        case Circle c     -> \"circle r=\" + c.r();\n        case Square s     -> \"square s=\" + s.s();\n        case Triangle t   -> \"triangle\";\n    };\n}\n```",
        options: [
          "`circle r=2.0`",
          "`Circle[r=2.0]`",
          "Compile error — switch on non-int",
          "ClassCastException at runtime",
        ],
        correct: [0],
        explanation:
          "Pattern-matching switch binds `c` to the narrowed type `Circle` so `c.r()` is valid. JEP 441 (final in Java 21).",
        points: 2,
      },

      // ── Effective Java idiom — typesafe heterogeneous container (Item 33)
      {
        prompt:
          "**When NOT to use a record.** Which scenarios are **bad fits** for `record`? *(select all)*",
        options: [
          "A JPA entity backed by a mutable DB row",
          "A coordinate type holding two `int`s",
          "A class with non-trivial behaviour beyond data carrying",
          "A class that needs to extend another class",
        ],
        correct: [0, 2, 3],
        explanation:
          "Records are bad for: mutable entities, classes with significant behaviour, classes that need an `extends` clause (records implicitly extend `java.lang.Record`). They shine for short-lived immutable data carriers.",
        points: 3,
      },
    ],
    numeric: [
      {
        prompt:
          "**Effective Java — memory.** A `record Point(int x, int y)` has an object-header overhead of roughly **16 bytes** plus its fields. On 64-bit HotSpot with compressed oops, two `int` fields cost **8 bytes** total. What's the **per-instance heap size** in bytes (rounded to the nearest 8-byte alignment)?",
        expected: "24",
        tolerancePct: 0,
        unit: "bytes",
        explanation:
          "Header 12 B (compressed) + 2 × 4 B ints = 20 B → padded to **24 B** (8-byte alignment). The same applies to a plain class with two int fields; records add no runtime cost.",
        points: 2,
      },
      {
        prompt:
          "**Generics trivia.** Effective Java says: list the chapter items covering generics. The chapter spans items **26 through ???** — supply the upper item number.",
        expected: "33",
        tolerancePct: 0,
        unit: "item",
        explanation:
          "Effective Java 3e — Chapter 5 *Generics* runs Items 26–33 (don't use raw types → typesafe heterogeneous container).",
        points: 1,
      },
    ],
    code: [],
  },
];
