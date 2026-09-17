// Shared authored outcomes; imported by roadmap data and database seed scripts.
export const PHASE_OUTCOMES: Record<string, Record<number, string[]>> = {
  python: {
    1: [
      "Set up a clean Python development environment with venv and Git",
      "Read and write Python syntax fluently: control flow, functions, comprehensions",
      "Apply OOP fundamentals: classes, inheritance, exceptions, @property",
      "Reason about Big-O for built-in data structures",
      "Ship 4 small CLI tools end-to-end and check them into version control",
    ],
    2: [
      "Use dataclasses, ABCs, and Protocols for clean domain modelling",
      "Explain descriptors, __slots__, and metaclasses — and when each is the right tool",
      "Write generators and async code that don't block",
      "Apply functional patterns (map/filter/reduce, partial, itertools) where they read clearer",
      "Choose between threading, multiprocessing, and asyncio based on workload shape",
    ],
    3: [
      "Apply the SOLID principles to refactor a real piece of messy code",
      "Recognise and apply the major creational, structural, and behavioral design patterns",
      "Translate a verbal LLD interview prompt into a coherent class diagram and code",
      "Write a 1-page LLD design doc that an engineer could implement from",
    ],
    4: [
      "Write pytest tests with fixtures, parametrize, and clear assertions",
      "Use mocks and fakes appropriately — and know when each is wrong",
      "Read coverage reports and add tests for the gaps that matter",
      "Run mypy + ruff in CI and treat warnings as errors",
    ],
    5: [
      "Sketch the right index for a query and reason about its cost",
      "Pick SQL vs NoSQL with a clear reason rooted in access patterns",
      "Explain ACID + isolation levels in plain language with examples",
      "Reason about replication lag, partitioning strategy, and CAP trade-offs",
    ],
    6: [
      "Design a REST API with proper status codes, idempotency, and versioning",
      "Pick between REST, gRPC, and WebSockets per use case",
      "Apply rate limiting, auth, and gateway concerns to an API surface",
      "Reason about message queues vs synchronous calls for inter-service comms",
    ],
    7: [
      "Walk through an HLD interview prompt with the standard 6-step framework",
      "Do back-of-envelope estimation for QPS, storage, and bandwidth",
      "Design feeds, chat, search, ride-sharing, video — at whiteboard depth",
      "Trade off consistency, availability, and cost in a real design",
    ],
    8: [
      "Define SLOs, error budgets, and choose alert thresholds that don't page on noise",
      "Instrument a service with metrics, logs, and traces (the three pillars)",
      "Containerise a Python app and deploy it on Kubernetes",
      "Author a CI/CD pipeline that runs tests, builds, and deploys safely",
    ],
    9: [
      "Walk into an LLD + HLD interview with a rehearsed framework, not improvisation",
      "Capstone-ship a full mini-Twitter clone: auth, feed, search, observability",
      "Articulate every roadmap concept under pressure in 60 seconds",
    ],
  },
};

export const WEEK_OBJECTIVES: Record<string, Record<number, string[]>> = {
  python: {
    1: [
      "Run a Python script from the terminal and understand REPL vs file execution",
      "Use f-strings, string methods, and the major built-in types fluently",
      "Write a control-flow heavy CLI tool with input validation",
    ],
    2: [
      "Split logic across multiple modules and import between them",
      "Distinguish function args, kwargs, *args, **kwargs, and default values",
      "Use list/dict/set comprehensions where they read more clearly than loops",
    ],
    3: [
      "Define a class with __init__, methods, and @property",
      "Use inheritance + polymorphism to share behaviour between related classes",
      "Define and raise custom exception subclasses",
    ],
    4: [
      "Choose the right built-in (list / dict / set / deque) for an access pattern",
      "Set up a venv and install packages with pip into it (not globally)",
      "Initialise a Git repo, stage, commit, and push to a remote",
    ],
    5: [
      "Model a domain with @dataclass and frozen=True for immutability",
      "Choose between ABCs and Protocols for typed interfaces",
      "Write fully type-hinted code that mypy accepts",
    ],
    6: [
      "Explain how a @property is actually a descriptor under the hood",
      "Use __slots__ to cut memory for large counts of small objects",
      "Build a metaclass or class decorator and justify which",
    ],
    7: [
      "Author generators with yield and yield from for lazy pipelines",
      "Write a context manager both as a class and with @contextmanager",
      "Use itertools.chain / groupby / islice instead of hand-rolled loops",
    ],
    8: [
      "Use asyncio.gather and TaskGroup correctly without lost exceptions",
      "Add type hints to async generators and async context managers",
      "Run mypy --strict on a small module and fix every error",
    ],
    9: [
      "Compose pure functions with functools.partial and functools.reduce",
      "Memoise hot functions with functools.lru_cache and know its bounds",
      "Replace loops with map/filter/reduce where they read more clearly",
    ],
    10: [
      "Pick between threading, multiprocessing, and asyncio per workload shape",
      "Reason about the GIL and where it does (and doesn't) bite",
      "Coordinate workers with a thread-safe queue or asyncio.Queue",
    ],
    11: [
      "Apply each SOLID principle on a concrete refactor and explain trade-offs",
      "Spot SRP / OCP / LSP violations in a code review",
    ],
    12: [
      "Recognise when Factory, Builder, or Singleton is genuinely needed",
      "Implement each creational pattern in idiomatic Python (not Java-with-extra-steps)",
    ],
    13: [
      "Apply Adapter, Decorator, Proxy, Facade, Composite in real code",
      "Explain when composition beats one of these patterns",
    ],
    14: [
      "Pick the right behavioral pattern (Observer/Strategy/Command/State) per use case",
      "Walk an interviewer through a state-machine implementation",
    ],
    15: [
      "Translate verbal Library / Elevator prompts into clean class diagrams",
      "Implement a small tested slice of each design, then extend it across multiple practice sessions",
    ],
    16: [
      "Apply DDD lite (entities, value objects, aggregates) on a food-delivery domain",
      "Write a 1-page design doc that captures the why, not just the what",
    ],
    17: [
      "Author parametrised pytest tests and fixtures that scope correctly",
      "Use `tmp_path`, `monkeypatch`, and `capsys` idiomatically",
    ],
    18: [
      "Distinguish mocks, fakes, stubs, and spies — and pick the right one",
      "Write a failing test first, then make it pass (true TDD cycle)",
    ],
    19: [
      "Run mypy --strict and resolve every error in a small codebase",
      "Wire pytest + ruff + mypy into a GitHub Actions workflow",
    ],
    20: [
      "Read EXPLAIN output and explain why an index is (or isn't) being used",
      "Design a covering index for a hot read path",
    ],
    21: [
      "Reason about REPEATABLE READ vs SERIALIZABLE on a concrete contention story",
      "Demonstrate an isolation anomaly with two SQL sessions and explain how constraints or transaction isolation address it",
    ],
    22: [
      "Pick MongoDB vs Postgres vs Redis for a workload and defend it",
      "Build and test a Redis leaderboard; explain rank ordering, ties, pagination and memory costs",
    ],
    23: [
      "Compare leader/follower, multi-leader, and leaderless replication",
      "Pick a sharding key and walk through hot-shard mitigations",
    ],
    24: [
      "Explain CAP's consistency/availability tradeoff during a partition and distinguish it from ordinary latency tradeoffs",
      "Sketch how Raft elects a leader and survives a network partition",
    ],
    25: [
      "Design how images / videos / static assets flow through a CDN",
      "Reason about inverted indexes and the cost of full-text search",
    ],
    26: [
      "Explain HTTP/1.1 vs HTTP/2 vs HTTP/3 trade-offs",
      "Author a REST API with proper status codes, idempotency, and pagination",
    ],
    27: [
      "Pick REST vs gRPC vs WebSockets and justify per workload",
      "Implement a long-lived WebSocket service with backpressure handling",
    ],
    28: [
      "Pick Kafka vs SQS vs Redis Streams per durability and ordering need",
      "Reason about at-least-once vs exactly-once semantics in practice",
    ],
    29: [
      "Implement token-bucket and sliding-window rate limiters with Redis",
      "Sketch the responsibilities of an API gateway (auth, routing, throttle)",
    ],
    30: [
      "Explain OAuth2 / OIDC flows at a level that survives interview questions",
      "List the OWASP top-10 mitigations every API should ship with",
    ],
    31: [
      "Re-read core networking chapters and synthesise into a 1-pager",
    ],
    32: [
      "Walk a system design prompt through requirements → estimates → HLD → deep-dives → bottlenecks → wrap",
      "Do back-of-envelope estimation in <5 minutes without panicking",
    ],
    33: [
      "Pick between L4 vs L7 load balancing, sticky vs round-robin, per use case",
      "Reason about consistent hashing for cache fronting",
    ],
    34: [
      "Explain why consistent hashing minimises rehashing on node add/remove",
      "Sketch a key-value store with replication and gossip-based membership",
    ],
    35: [
      "Compare push (fan-out-on-write) vs pull (fan-out-on-read) feeds",
      "Pick the right approach for celebrity-skew",
    ],
    36: [
      "Design a chat system with delivery receipts and historic message storage",
      "Reason about online presence and connection pinning",
    ],
    37: [
      "Coordinate distributed transactions via saga + compensation",
      "Sketch matching, pricing, and ETA for a ride-sharing system",
    ],
    38: [
      "Design typeahead with a trie or indexed lookup and state a latency target",
      "Explain ranking, stale suggestions and batched versus real-time updates",
    ],
    39: [
      "Walk through CDN + manifest-driven adaptive bitrate streaming",
      "Reason about chunked encoding and player buffer maths",
    ],
    40: [
      "Design idempotent payment endpoints with strong audit trails",
      "Sketch a notification system that fans out to email / push / SMS",
    ],
    41: [
      "Complete the three scheduled HLD mocks and record one concrete improvement after each",
    ],
    42: [
      "Define an SLO + error budget for a service you've worked on",
      "Pick alert thresholds that page on real incidents, not noise",
    ],
    43: [
      "Distinguish metrics, logs, traces — and instrument all three",
      "Read a trace and find the slow span",
    ],
    44: [
      "Containerise a Python service with a slim multi-stage Dockerfile",
      "Deploy a Pod + Service + Ingress on minikube",
    ],
    45: [
      "Author a GitHub Actions pipeline that tests, builds, and deploys",
      "Explain blue/green vs canary vs rolling deploys with trade-offs",
    ],
    46: [
      "Walk an LLD problem from scratch in a recorded mock",
      "Self-critique on coverage, time-management, and explanation clarity",
    ],
    47: [
      "Walk an HLD problem in a recorded mock and grade yourself",
    ],
    48: [
      "Ship a mini-Twitter clone end-to-end and deploy it",
      "Demonstrate auth, feed, search, and observability working",
    ],
    49: [
      "Publish the project, write the README, and share it publicly",
    ],
  },
};
