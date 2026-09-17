// ── BOOK URL REGISTRY ──────────────────────────────────────────────────────────
// Author/publisher pages for reference books. Some require purchase/subscription;
// these links do not imply that the full book is freely available.
// Key must appear as a substring of a resource's `item` string to auto-link it.
// Adding an entry here makes every matching card title a clickable link.

export const BOOK_URLS: Record<string, string> = {
  "Fluent Python":              "https://www.fluentpython.com/",
  "DDIA":                       "https://dataintensive.net/",
  "Google SRE Book":            "https://sre.google/sre-book/table-of-contents/",
  "Effective Java":             "https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/",
  "Head First Design Patterns": "https://www.oreilly.com/library/view/head-first-design/9781492077992/",
  "Java Concurrency in Practice": "https://jcip.net/",
  "System Design Interview Vol 1": "https://bytebytego.com/courses/system-design-interview",
  "System Design Interview Vol 2": "https://www.amazon.com/System-Design-Interview-Insiders-Volume/dp/1736049119/",
};
