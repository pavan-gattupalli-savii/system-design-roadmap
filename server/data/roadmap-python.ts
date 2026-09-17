import type { Phase } from "../../src/data/models";
import { PHASE_OUTCOMES, WEEK_OBJECTIVES } from "./python-outcomes";

// Python roadmap — 49 weeks, 9 phases.
// Phase 1 = Foundations (complete beginners start here).
// Phase 3 = dedicated LLD. Phase 4 = Testing & Code Quality. Phase 7 = HLD.
export const pythonRoadmap: Phase[] = [
  {
    phase: 1, title: "Python Foundations", icon: "🐍",
    accent: "#059669", light: "#6ee7b7",
    desc: "Start here: Python setup, core syntax, OOP basics, data structures, and the Git workflow — everything you need to hit the ground running",
    weeks: [
      { n: 1, title: "Python Setup & Core Syntax", sessions: [
        { label: "Study", focus: "Environment setup + data types", resources: [
          { type: "Docs", item: "Python 3 Official Tutorial – Ch 3 'An Informal Introduction to Python'", where: "docs.python.org/3/tutorial/introduction.html — the cleanest intro exists", mins: 35, url: "https://docs.python.org/3/tutorial/introduction.html" },
          { type: "Docs", item: "Python Tutorial — getting started and virtual environments", where: "Install Python 3.12+; verify python --version, create a venv, and run a script. Read the introduction and control-flow sections next.", mins: 45, url: "https://docs.python.org/3/tutorial/venv.html" },
        ]},
        { label: "Study", focus: "Control flow, f-strings & string methods", resources: [
          { type: "Docs", item: "Python 3 Tutorial – Ch 4 'More Control Flow Tools' (if, for, while, break/continue)", where: "docs.python.org/3/tutorial/controlflow.html", mins: 30, url: "https://docs.python.org/3/tutorial/controlflow.html" },
          { type: "Article", item: "Real Python – 'Python f-strings are awesome'", where: "realpython.com/python-f-strings/ — every string formatting trick you need", mins: 20, url: "https://realpython.com/python-f-strings/" },
        ]},
        { label: "Build", focus: "CLI tools to cement the basics", resources: [
          { type: "Build", item: "Temperature converter (Celsius ↔ Fahrenheit ↔ Kelvin) — handles invalid input gracefully", where: "Then: word frequency counter that reads a file, counts words, prints top-10.", mins: 60 },
          { type: "Ask Claude", item: "Ask: 'What Python beginner mistakes did I make in this code?' Paste both scripts.", where: "Get style feedback before bad habits solidify", mins: 15 },
        ]},
      ]},
      { n: 2, title: "Functions, Modules & Comprehensions", sessions: [
        { label: "Study", focus: "Functions — args, kwargs, scope, closures", resources: [
          { type: "Docs", item: "Python 3 Tutorial – Ch 4 (Functions section) + Ch 6 'Modules'", where: "docs.python.org/3/tutorial/modules.html", mins: 35, url: "https://docs.python.org/3/tutorial/modules.html" },
          { type: "YouTube", item: "Corey Schafer – 'Python Functions' + 'Python Modules'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'Corey Schafer Python functions' — 2 videos, ~30 min each", mins: 50, url: "https://www.youtube.com/results?search_query=Corey%20Schafer%20Python%20functions", isCore: false },
        ]},
        { label: "Study", focus: "List/dict/set comprehensions & generators intro", resources: [
          { type: "Article", item: "Real Python – 'Python Comprehensions: A Step By Step Introduction'", where: "realpython.com/list-comprehension-python/", mins: 30, url: "https://realpython.com/list-comprehension-python/" },
          { type: "YouTube", item: "Corey Schafer – 'Comprehensions in Python'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'Corey Schafer comprehensions Python'", mins: 20, url: "https://www.youtube.com/results?search_query=Corey%20Schafer%20comprehensions%20Python", isCore: false },
        ]},
        { label: "Build", focus: "Modular CLI todo manager", resources: [
          { type: "Build", item: "CLI todo manager split across modules: models.py (Task dataclass), storage.py (JSON file), cli.py (add/list/done/delete commands).", where: "Start with dictionaries for tasks; dataclasses are introduced in week 5. Handle missing files and invalid JSON. Add/list/done/delete must survive restarting the program.", mins: 180 },
        ]},
      ]},
      { n: 3, title: "OOP Fundamentals & Error Handling", sessions: [
        { label: "Study", focus: "Classes — __init__, attributes, methods, @property", resources: [
          { type: "Docs", item: "Python 3 Tutorial – Ch 9 'Classes' (full chapter)", where: "docs.python.org/3/tutorial/classes.html", mins: 40, url: "https://docs.python.org/3/tutorial/classes.html" },
          { type: "YouTube", item: "Corey Schafer – 'Python OOP Tutorial' (6-part series)", where: "Optional video discovery (search results, not a verified video): YouTube → search 'Corey Schafer Python OOP' — all 6 parts, ~1.5 hrs total", mins: 75, url: "https://www.youtube.com/results?search_query=Corey%20Schafer%20Python%20OOP", isCore: false },
        ]},
        { label: "Study", focus: "Inheritance, polymorphism & custom exceptions", resources: [
          { type: "Article", item: "Real Python – 'Inheritance and Composition: A Python OOP Guide'", where: "realpython.com/inheritance-composition-python/", mins: 35, url: "https://realpython.com/inheritance-composition-python/" },
          { type: "Docs", item: "Python 3 Tutorial – Ch 8 'Errors and Exceptions'", where: "docs.python.org/3/tutorial/errors.html — custom exception hierarchy", mins: 25, url: "https://docs.python.org/3/tutorial/errors.html" },
        ]},
        { label: "Build", focus: "Bank account hierarchy", resources: [
          { type: "Build", item: "BankAccount → SavingsAccount (interest, min-balance), CheckingAccount (overdraft limit). Custom InsufficientFundsError. @property for balance.", where: "Write __repr__ and __str__. Test edge cases. Ask Claude to review inheritance design!", mins: 75 },
        ]},
      ]},
      { n: 4, title: "Data Structures, Git & Python Ecosystem", sessions: [
        { label: "Study", focus: "Built-in data structures & Big-O basics", resources: [
          { type: "Docs", item: "Python Wiki — Time Complexity", where: "CPython complexity reference: distinguish average from amortized/worst-case costs. Compare list.pop(0) with deque.popleft().", mins: 20, url: "https://wiki.python.org/moin/TimeComplexity" },
          { type: "YouTube", item: "CS Dojo – 'Introduction to Big O Notation'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'CS Dojo Big O notation introduction'", mins: 20, url: "https://www.youtube.com/results?search_query=CS%20Dojo%20Big%20O%20notation%20introduction", isCore: false },
        ]},
        { label: "Study", focus: "Virtual environments, pip & Git basics", resources: [
          { type: "Docs", item: "Python 3 Tutorial – Ch 12 'Virtual Environments and Packages' (venv + pip)", where: "docs.python.org/3/tutorial/venv.html — how every Python project should be set up", mins: 20, url: "https://docs.python.org/3/tutorial/venv.html" },
          { type: "YouTube", item: "Tech With Tim – 'Git and GitHub for Beginners'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'Tech With Tim Git GitHub beginners'", mins: 40, url: "https://www.youtube.com/results?search_query=Tech%20With%20Tim%20Git%20GitHub%20beginners", isCore: false },
        ]},
        { label: "Build", focus: "Data structures from scratch", resources: [
          { type: "Build", item: "Implement Stack (list-backed + LinkedList-backed), Queue (deque-backed), and LinkedList with insert/delete/search. Write unit tests for each.", where: "Compare list-based vs deque-based Queue performance. Ask Claude about time complexity!", mins: 75 },
        ]},
      ]},
    ],
  },
  {
    phase: 2, title: "Python Internals & OOP Mastery", icon: "⚙️",
    accent: "#6366f1", light: "#a5b4fc",
    desc: "Go deep: dataclasses, ABCs, descriptors, metaclasses, generators, asyncio, and functional Python",
    weeks: [
      { n: 5, title: "Dataclasses, ABCs & Protocols", sessions: [
        { label: "Study", focus: "Dataclasses — the modern Python class", resources: [
          { type: "Docs", item: "Python docs – dataclasses (full module reference)", where: "docs.python.org/3/library/dataclasses.html — frozen, kw_only, __post_init__", mins: 30, url: "https://docs.python.org/3/library/dataclasses.html" },
          { type: "YouTube", item: "ArjanCodes – 'Python Dataclasses'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'arjan codes dataclasses'", mins: 20, url: "https://www.youtube.com/results?search_query=arjan%20codes%20dataclasses", isCore: false },
        ]},
        { label: "Study", focus: "Abstract Base Classes & Protocols (structural typing)", resources: [
          { type: "Book", item: "Fluent Python 2e – Ch 13 'Interfaces, Protocols, and ABCs'", where: "ABCs, Protocols, duck typing vs goose typing", mins: 50, url: "https://www.fluentpython.com/" },
          { type: "Docs", item: "Python typing — Protocol and structural subtyping", where: "Free companion to Fluent Python chapter 13: implement the same interface with an ABC and a Protocol; explain static checking versus runtime validation.", mins: 22, url: "https://docs.python.org/3/library/typing.html#typing.Protocol" },
        ]},
        { label: "Build", focus: "Typed domain model with ABCs and dataclasses", resources: [
          { type: "Build", item: "E-commerce domain: @dataclass Product, Order, OrderItem. Abstract Notifier with EmailNotifier, SMSNotifier. Protocol for PaymentGateway.", where: "Full type hints. Ask Claude: 'Should I use ABC or Protocol here, and why?'", mins: 60 },
        ]},
      ]},
      { n: 6, title: "Descriptors, __slots__ & Metaclasses", sessions: [
        { label: "Study", focus: "Descriptors — how Python properties really work", resources: [
          { type: "Book", item: "Fluent Python 2e – Ch 23 'Attribute Descriptors'", where: "the mechanism behind @property, @classmethod, @staticmethod", mins: 50, url: "https://www.fluentpython.com/" },
          { type: "Docs", item: "Python Descriptor Guide", where: "Trace attribute lookup and distinguish data/non-data descriptors. Treat metaclasses as optional depth after descriptors and class decorators.", mins: 20, url: "https://docs.python.org/3/howto/descriptor.html" },
        ]},
        { label: "Study", focus: "__slots__ for memory efficiency & metaclasses intro", resources: [
          { type: "Book", item: "Fluent Python 2e – Ch 24 'Class Metaprogramming'", where: "__init_subclass__, metaclass basics, class decorators", mins: 55, url: "https://www.fluentpython.com/" },
          { type: "YouTube", item: "mCoding – 'Python Metaclasses'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'mCoding python metaclasses'", mins: 22, url: "https://www.youtube.com/results?search_query=mCoding%20python%20metaclasses", isCore: false },
        ]},
        { label: "Build", focus: "Validated descriptor + ORM-style metaclass", resources: [
          { type: "Build", item: "Write a Validated descriptor (enforces type + range). Use it in a dataclass. Then a simple ORM-style metaclass that registers all model classes.", where: "Ask Claude: 'When in production would you use a metaclass vs a class decorator?'", mins: 60 },
        ]},
      ]},
      { n: 7, title: "Generators, Iterators & Context Managers", sessions: [
        { label: "Study", focus: "Generators and the iteration protocol", resources: [
          { type: "Book", item: "Fluent Python 2e – Ch 17 'Iterators, Generators, and Classic Coroutines'", where: "yield, yield from, generator expressions, infinite sequences", mins: 50, url: "https://www.fluentpython.com/" },
          { type: "YouTube", item: "ArjanCodes – 'Python Generators'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'arjan codes python generators'", mins: 18, url: "https://www.youtube.com/results?search_query=arjan%20codes%20python%20generators", isCore: false },
        ]},
        { label: "Study", focus: "Context managers with __enter__/__exit__ and contextlib", resources: [
          { type: "Docs", item: "Python contextlib — @contextmanager, suppress, redirect_stdout, ExitStack", where: "docs.python.org/3/library/contextlib.html", mins: 25, url: "https://docs.python.org/3/library/contextlib.html" },
          { type: "YouTube", item: "mCoding – 'Context Managers in Python'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'mCoding context managers python'", mins: 18, url: "https://www.youtube.com/results?search_query=mCoding%20context%20managers%20python", isCore: false },
        ]},
        { label: "Build", focus: "Lazy file processor + timer context manager", resources: [
          { type: "Build", item: "Generator that lazily reads a 1GB CSV line-by-line with transformations. Context manager for timing code blocks (with TimerContext() as t:). Both tested.", where: "Test memory usage with memory_profiler. Ask Claude: generator vs list — when?", mins: 60 },
        ]},
      ]},
      { n: 8, title: "Asyncio & Type Hints", sessions: [
        { label: "Study", focus: "asyncio fundamentals — event loop, coroutines, tasks", resources: [
          { type: "Book", item: "Fluent Python 2e – Ch 19 'Concurrency Models in Python'", where: "threads vs processes vs asyncio, when to use each", mins: 55, url: "https://www.fluentpython.com/" },
          { type: "Docs", item: "asyncio — tasks, cancellation, TaskGroup and timeouts", where: "TaskGroup cancels sibling tasks when a task fails. Compare fail-fast behavior with gather(return_exceptions=True); never swallow cancellation accidentally.", mins: 30, url: "https://docs.python.org/3/library/asyncio-task.html" },
        ]},
        { label: "Study", focus: "Type hints — generics, TypeVar, Protocol, Literal", resources: [
          { type: "Docs", item: "Python typing module — TypeVar, Generic, Protocol, Literal, TypedDict, Final", where: "docs.python.org/3/library/typing.html — especially Protocols and TypeVars", mins: 35, url: "https://docs.python.org/3/library/typing.html" },
          { type: "YouTube", item: "ArjanCodes – 'Python Type Hints'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'arjan codes python type hints'", mins: 20, url: "https://www.youtube.com/results?search_query=arjan%20codes%20python%20type%20hints", isCore: false },
        ]},
        { label: "Build", focus: "Async web scraper with typed interfaces", resources: [
          { type: "Build", item: "Async scraper: asyncio + aiohttp, fetches 10 URLs with bounded concurrency, timeouts, cancellation, Protocol-typed storage, and strict mypy. Measure against sync.", where: "Benchmark sync vs async. Ask Claude: 'asyncio.gather vs asyncio.TaskGroup?'", mins: 75 },
        ]},
      ]},
      { n: 9, title: "Functional Python — functools & itertools", sessions: [
        { label: "Study", focus: "functools — lru_cache, partial, reduce, wraps", resources: [
          { type: "Docs", item: "Python functools module — full reference (lru_cache, cache, partial, reduce, total_ordering)", where: "docs.python.org/3/library/functools.html", mins: 30, url: "https://docs.python.org/3/library/functools.html" },
          { type: "YouTube", item: "mCoding – 'Python functools (full tour)'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'mCoding functools python'", mins: 25, url: "https://www.youtube.com/results?search_query=mCoding%20functools%20python", isCore: false },
        ]},
        { label: "Study", focus: "itertools — the Swiss army knife for lazy sequences", resources: [
          { type: "Docs", item: "Python itertools — chain, islice, groupby, product, combinations, permutations, accumulate", where: "docs.python.org/3/library/itertools.html — every senior Python dev knows these", mins: 30, url: "https://docs.python.org/3/library/itertools.html" },
          { type: "Article", item: "Real Python – 'Itertools in Python 3 by Example'", where: "realpython.com/python-itertools/", mins: 25, url: "https://realpython.com/python-itertools/" },
        ]},
        { label: "Build", focus: "Functional data pipeline", resources: [
          { type: "Build", item: "Memoised recursive Fibonacci + partial application for a configurable validator + itertools pipeline: chain sources → islice → groupby → accumulate.", where: "No loops where map/filter/reduce work better. Ask Claude: 'Where am I fighting Python?'", mins: 60 },
        ]},
      ]},
      { n: 10, title: "Python Concurrency Deep Dive", sessions: [
        { label: "Study", focus: "GIL, threading & multiprocessing — when each wins", resources: [
          { type: "Book", item: "Fluent Python 2e – Ch 19 'Concurrency Models' (threading + multiprocessing sections)", where: "CPU-bound vs I/O-bound. The GIL explained clearly.", mins: 55, url: "https://www.fluentpython.com/" },
          { type: "Docs", item: "Python free-threading HOWTO", where: "Distinguish conventional GIL-enabled CPython from optional free-threaded builds. Native extensions may release or re-enable the GIL; record the runtime in benchmarks.", mins: 20, url: "https://docs.python.org/3/howto/free-threading-python.html" },
        ]},
        { label: "Study", focus: "concurrent.futures & asyncio patterns", resources: [
          { type: "Docs", item: "Python concurrent.futures — ThreadPoolExecutor, ProcessPoolExecutor, Future, as_completed", where: "docs.python.org/3/library/concurrent.futures.html", mins: 30, url: "https://docs.python.org/3/library/concurrent.futures.html" },
          { type: "YouTube", item: "ArjanCodes – 'Python Concurrency Best Practices'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'arjan codes python concurrency'", mins: 25, url: "https://www.youtube.com/results?search_query=arjan%20codes%20python%20concurrency", isCore: false },
        ]},
        { label: "Build", focus: "Concurrent image processor + benchmark", resources: [
          { type: "Build", item: "Process 100 images: sequential → ThreadPool (I/O) → ProcessPool (CPU resize). Benchmark all 3. Use asyncio for concurrent downloads.", where: "Separate download and resize timings. Pillow/native code may release the GIL, so measure threads rather than assuming they cannot help CPU work. Include startup and serialization costs.", mins: 180 },
        ]},
      ]},
    ],
  },
  {
    phase: 3, title: "Low-Level Design (LLD)", icon: "🧩",
    accent: "#b45309", light: "#fde68a",
    desc: "SOLID principles, all design patterns in Python, and hands-on LLD interview problems",
    weeks: [
      { n: 11, title: "SOLID Principles", sessions: [
        { label: "Study", focus: "SRP, OCP & LSP principles", resources: [
          { type: "Article", item: "Real Python – SOLID Design Principles in Python", where: "realpython.com/solid-principles-python/ — Python examples throughout. Read SRP + OCP + LSP first.", mins: 40, url: "https://realpython.com/solid-principles-python/" },
          { type: "YouTube", item: "ArjanCodes – 'SOLID Design Principles' series", where: "Optional video discovery (search results, not a verified video): YouTube → search 'arjan codes solid design principles'", mins: 30, url: "https://www.youtube.com/results?search_query=arjan%20codes%20solid%20design%20principles", isCore: false },
        ]},
        { label: "Study", focus: "ISP & DIP — interface segregation and dependency inversion", resources: [
          { type: "Article", item: "Real Python – Interface Segregation and Dependency Inversion", where: "realpython.com/solid-principles-python/ — last two sections", mins: 25, url: "https://realpython.com/solid-principles-python/" },
          { type: "YouTube", item: "ArjanCodes – 'Dependency Inversion in Python'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'arjan codes dependency inversion'", mins: 20, url: "https://www.youtube.com/results?search_query=arjan%20codes%20dependency%20inversion", isCore: false },
        ]},
        { label: "Build", focus: "Refactor a messy class to SOLID", resources: [
          { type: "Build", item: "Take a messy God-object order handler and refactor it to SOLID", where: "Before/after comparison. Document every violation fixed.", mins: 60 },
          { type: "Ask Claude", item: "Paste your refactored code. Ask: 'What SOLID violations did I miss?'", where: "Use Claude as your tech lead reviewer", mins: 20 },
        ]},
      ]},
      { n: 12, title: "Creational Design Patterns", sessions: [
        { label: "Study", focus: "Factory & Builder", resources: [
          { type: "Article", item: "refactoring.guru – Factory Method + Abstract Factory with Python", where: "refactoring.guru/design-patterns/factory-method", mins: 35, url: "https://refactoring.guru/design-patterns/factory-method" },
          { type: "Book", item: "Head First Design Patterns – Ch 4 'The Factory Pattern'", where: "very visual", mins: 45, url: "https://www.oreilly.com/library/view/head-first-design/9781492077992/" },
        ]},
        { label: "Study", focus: "Singleton & Builder", resources: [
          { type: "Article", item: "refactoring.guru – Builder + Singleton patterns", where: "refactoring.guru/design-patterns/builder", mins: 30, url: "https://refactoring.guru/design-patterns/builder" },
          { type: "YouTube", item: "ArjanCodes – 'Builder Pattern in Python'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'arjan codes builder pattern'", mins: 20, url: "https://www.youtube.com/results?search_query=arjan%20codes%20builder%20pattern", isCore: false },
        ]},
        { label: "Build", focus: "Project: Notification system", resources: [
          { type: "YouTube", item: "ArjanCodes – 'Factory Pattern in Python'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'arjan codes factory pattern'", mins: 18, url: "https://www.youtube.com/results?search_query=arjan%20codes%20factory%20pattern", isCore: false },
          { type: "Build", item: "Notification system: Factory + Strategy routing + Builder for configs", where: "Use ABCs. Add type hints throughout.", mins: 60 },
        ]},
      ]},
      { n: 13, title: "Structural Design Patterns", sessions: [
        { label: "Study", focus: "Adapter & Decorator", resources: [
          { type: "Article", item: "refactoring.guru – Adapter + Decorator with Python", where: "refactoring.guru/design-patterns/adapter", mins: 35, url: "https://refactoring.guru/design-patterns/adapter" },
          { type: "Book", item: "Head First Design Patterns – Ch 3 'Decorator Pattern'", where: "Starbucks coffee analogy", mins: 40, url: "https://www.oreilly.com/library/view/head-first-design/9781492077992/" },
        ]},
        { label: "Study", focus: "Proxy & Facade", resources: [
          { type: "Article", item: "refactoring.guru – Proxy + Facade with Python", where: "refactoring.guru/design-patterns/proxy", mins: 30, url: "https://refactoring.guru/design-patterns/proxy" },
          { type: "YouTube", item: "ArjanCodes – 'Proxy Pattern in Python'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'arjan codes proxy pattern'", mins: 18, url: "https://www.youtube.com/results?search_query=arjan%20codes%20proxy%20pattern", isCore: false },
        ]},
        { label: "Build", focus: "Project: Caching Proxy + Logging Decorator", resources: [
          { type: "Build", item: "Caching proxy (DB call intercept + Redis) + logging decorator", where: "Use functools.wraps. Test with unit tests.", mins: 60 },
          { type: "Ask Claude", item: "Ask: 'When in production would you pick Proxy vs Decorator? 3 real examples of each.'", where: "Great for cementing the conceptual difference", mins: 15 },
        ]},
      ]},
      { n: 14, title: "Behavioral Design Patterns", sessions: [
        { label: "Study", focus: "Observer & Strategy", resources: [
          { type: "Article", item: "refactoring.guru – Observer + Strategy with Python", where: "refactoring.guru/design-patterns/observer", mins: 35, url: "https://refactoring.guru/design-patterns/observer" },
          { type: "YouTube", item: "ArjanCodes – 'Observer Pattern in Python'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'arjan codes observer pattern'", mins: 20, url: "https://www.youtube.com/results?search_query=arjan%20codes%20observer%20pattern", isCore: false },
        ]},
        { label: "Study", focus: "State & Command", resources: [
          { type: "Article", item: "refactoring.guru – State + Command with Python", where: "refactoring.guru/design-patterns/state", mins: 30, url: "https://refactoring.guru/design-patterns/state" },
          { type: "YouTube", item: "ArjanCodes – 'State Pattern in Python'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'arjan codes state pattern'", mins: 18, url: "https://www.youtube.com/results?search_query=arjan%20codes%20state%20pattern", isCore: false },
        ]},
        { label: "Build", focus: "Project: Order State Machine", resources: [
          { type: "Build", item: "Order State Machine: State + Observer for events + Command for undo/redo", where: "Real e-commerce order flow.", mins: 60 },
        ]},
      ]},
      { n: 15, title: "LLD Practice: Library & Elevator", sessions: [
        { label: "Study + Build", focus: "Library Management System", resources: [
          { type: "YouTube", item: "Search: 'library management system LLD python'", where: "Optional video discovery (search results, not a verified video): YouTube — pick a good walkthrough", mins: 25, url: "https://www.youtube.com/results?search_query=library%20management%20system%20LLD%20python", isCore: false },
          { type: "Build", item: "Library: Book, Member, Loan, Reservation, Fine calculator. Observer for due-date alerts.", where: "Full type hints throughout.", mins: 60 },
        ]},
        { label: "Build", focus: "Elevator System", resources: [
          { type: "Ask Claude", item: "Ask: 'Interview me on designing an Elevator system LLD. What classes and edge cases matter?'", where: "Use Claude as your design interviewer", mins: 30 },
          { type: "Build", item: "Elevator: Elevator, Controller, Request, DispatchStrategy (SCAN/LOOK algorithm)", where: "Try 2 dispatch strategies and compare.", mins: 60 },
        ]},
      ]},
      { n: 16, title: "LLD Practice: Food Delivery + Design Docs", sessions: [
        { label: "Build", focus: "Food Delivery System", resources: [
          { type: "YouTube", item: "Search: 'food delivery system LLD design Swiggy Zomato'", where: "Optional video discovery (search results, not a verified video): YouTube — pick a recent video", mins: 30, url: "https://www.youtube.com/results?search_query=food%20delivery%20system%20LLD%20design%20Swiggy%20Zomato", isCore: false },
          { type: "Build", item: "Food delivery: Restaurant, Menu, Order, DeliveryAgent, RealTimeTracking.", where: "Combine all your patterns.", mins: 60 },
        ]},
        { label: "Study", focus: "How to write a design doc", resources: [
          { type: "Docs", item: "Google Engineering Practices — design review", where: "Review overall design, complexity, tests and documentation. Write requirements, alternatives, failure cases and tradeoffs in your design note.", mins: 25, url: "https://google.github.io/eng-practices/review/reviewer/looking-for.html" },
          { type: "Docs", item: "Architecture decision records — rationale and template", where: "Record context, decision, alternatives and consequences; use a short ADR for one significant design choice.", mins: 20, url: "https://adr.github.io/" },
        ]},
        { label: "Build", focus: "Document all your LLDs", resources: [
          { type: "Build", item: "Write 1-page design doc for each of your 4 LLD projects", where: "Problem → Key classes → Patterns used → Trade-offs", mins: 60 },
          { type: "Ask Claude", item: "Paste your design doc. Ask: 'What edge cases am I missing? What would break at scale?'", where: "Use Claude as your tech lead reviewer", mins: 20 },
        ]},
      ]},
    ],
  },
  {
    phase: 4, title: "Testing & Code Quality", icon: "✅",
    accent: "#0891b2", light: "#67e8f9",
    desc: "pytest, TDD, mocking, mypy type checking, and CI — make your code production-trustworthy",
    weeks: [
      { n: 17, title: "pytest Fundamentals & Test Design", sessions: [
        { label: "Study", focus: "pytest basics — test functions, fixtures, conftest.py", resources: [
          { type: "Docs", item: "pytest Documentation – Getting Started, fixtures, parametrize, conftest.py, markers", where: "docs.pytest.org/en/stable/ — the authoritative guide", mins: 50, url: "https://docs.pytest.org/en/stable/" },
          { type: "YouTube", item: "ArjanCodes – 'pytest Best Practices'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'arjan codes pytest best practices'", mins: 25, url: "https://www.youtube.com/results?search_query=arjan%20codes%20pytest%20best%20practices", isCore: false },
        ]},
        { label: "Study", focus: "Parametrize, coverage & test organization", resources: [
          { type: "Article", item: "Real Python – 'Effective Python Testing with pytest'", where: "realpython.com/pytest-python-testing/ — comprehensive guide", mins: 40, url: "https://realpython.com/pytest-python-testing/" },
          { type: "Docs", item: "pytest-cov – coverage integration with pytest", where: "pytest-cov.readthedocs.io — add --cov to pytest command", mins: 15, url: "https://pytest-cov.readthedocs.io" },
        ]},
        { label: "Build", focus: "Full test suite for LLD projects", resources: [
          { type: "Build", item: "Write pytest test suite for Library + Elevator systems: unit tests, edge cases, @pytest.mark.parametrize for multiple inputs. Aim for 90%+ coverage.", where: "Run pytest --cov --cov-report=html. Open the HTML report. Ask Claude to review test quality!", mins: 90 },
        ]},
      ]},
      { n: 18, title: "Mocking, TDD & Integration Testing", sessions: [
        { label: "Study", focus: "unittest.mock — Mock, patch, MagicMock", resources: [
          { type: "Docs", item: "Python unittest.mock — Mock, MagicMock, patch, patch.object, side_effect, assert_called_with", where: "docs.python.org/3/library/unittest.mock.html — the full reference", mins: 40, url: "https://docs.python.org/3/library/unittest.mock.html" },
          { type: "YouTube", item: "ArjanCodes – 'Python Mocking'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'arjan codes python mocking'", mins: 20, url: "https://www.youtube.com/results?search_query=arjan%20codes%20python%20mocking", isCore: false },
        ]},
        { label: "Study", focus: "Test-Driven Development — Red → Green → Refactor", resources: [
          { type: "Docs", item: "pytest — good integration practices", where: "Use a failing behavior test, implement the smallest passing change, then refactor. Keep integration tests separate from mocked unit tests.", mins: 30, url: "https://docs.pytest.org/en/stable/explanation/goodpractices.html" },
          { type: "YouTube", item: "ArjanCodes – 'TDD in Python'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'arjan codes TDD python'", mins: 22, url: "https://www.youtube.com/results?search_query=arjan%20codes%20TDD%20python", isCore: false },
        ]},
        { label: "Build", focus: "TDD a new feature + mock external dependencies", resources: [
          { type: "Build", item: "TDD an 'expired reservation cleanup' service in your Library system: write tests first (Red), implement (Green), refactor. Mock the email notifier with @patch.", where: "Show all 3 TDD phases with commits. Ask Claude: 'What did I miss in my test cases?'", mins: 90 },
        ]},
      ]},
      { n: 19, title: "Code Quality — mypy, ruff & CI", sessions: [
        { label: "Study", focus: "mypy type checking — strict mode and common patterns", resources: [
          { type: "Docs", item: "mypy documentation – Getting Started, configuration, strict mode, protocols", where: "mypy.readthedocs.io/en/stable/ — run mypy --strict on your codebase today", mins: 40, url: "https://mypy.readthedocs.io/en/stable/" },
          { type: "Article", item: "Real Python – 'Python Type Checking with mypy'", where: "realpython.com/python-type-checking/", mins: 30, url: "https://realpython.com/python-type-checking/" },
        ]},
        { label: "Study", focus: "ruff linter + black formatter + pre-commit hooks", resources: [
          { type: "Docs", item: "ruff documentation – configuration, rules, auto-fix, pyproject.toml", where: "docs.astral.sh/ruff/ — blazing-fast Python linter replacing flake8+isort+more", mins: 25, url: "https://docs.astral.sh/ruff/" },
          { type: "YouTube", item: "ArjanCodes – 'Python Code Quality Tools'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'arjan codes python code quality'", mins: 20, url: "https://www.youtube.com/results?search_query=arjan%20codes%20python%20code%20quality", isCore: false },
        ]},
        { label: "Build", focus: "Full CI pipeline with quality gates", resources: [
          { type: "Build", item: "GitHub Actions workflow: pytest → mypy --strict → ruff check → black --check → coverage (fail if < 80%). pre-commit hooks for local enforcement.", where: "Add branch protection: CI must pass before merge. Ask Claude for the workflow YAML!", mins: 75 },
        ]},
      ]},
    ],
  },
  {
    phase: 5, title: "Databases & Storage", icon: "🗄️",
    accent: "#DC2626", light: "#FCA5A5",
    desc: "Understand when and how to use every major storage system",
    weeks: [
      { n: 20, title: "SQL Internals & Indexing", sessions: [
        { label: "Study", focus: "DDIA foundations + B-Trees", resources: [
          { type: "Book", item: "DDIA 1e – Ch 1 'Reliable, Scalable, Maintainable'", where: "read slowly. Sets the mental model.", mins: 45, url: "https://dataintensive.net/" },
          { type: "Book", item: "DDIA 1e – Ch 3 'Storage and Retrieval' (B-Tree section)", where: "how indexes work on disk", mins: 40, url: "https://dataintensive.net/" },
        ]},
        { label: "Study", focus: "SQL indexing deep dive", resources: [
          { type: "Article", item: "Use The Index, Luke – Ch 1 'Anatomy of an Index'", where: "use-the-index-luke.com/sql/anatomy — FREE, best SQL resource", mins: 35, url: "https://use-the-index-luke.com/sql/anatomy" },
          { type: "YouTube", item: "Hussein Nasser – 'Database Indexing Explained'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'hussein nasser database indexing'", mins: 25, url: "https://www.youtube.com/results?search_query=hussein%20nasser%20database%20indexing", isCore: false },
        ]},
        { label: "Build", focus: "Index your own queries", resources: [
          { type: "Build", item: "Create 5 tables with 1M rows each. Run EXPLAIN ANALYZE before/after adding indexes.", where: "PostgreSQL. Measure query time. Document findings.", mins: 60 },
        ]},
      ]},
      { n: 21, title: "ACID, Transactions & SQL Schema Design", sessions: [
        { label: "Study", focus: "ACID & transactions", resources: [
          { type: "Book", item: "DDIA 1e – Ch 7 'Transactions'", where: "ACID, isolation levels, write skew", mins: 55, url: "https://dataintensive.net/" },
          { type: "YouTube", item: "Hussein Nasser – 'Database Transactions'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'hussein nasser database transactions'", mins: 25, url: "https://www.youtube.com/results?search_query=hussein%20nasser%20database%20transactions", isCore: false },
        ]},
        { label: "Study", focus: "Isolation levels", resources: [
          { type: "Docs", item: "PostgreSQL – Transaction Isolation docs", where: "postgresql.org/docs/current/transaction-iso.html", mins: 25, url: "https://postgresql.org/docs/current/transaction-iso.html" },
          { type: "Ask Claude", item: "Ask: 'Explain isolation levels with concrete SQL examples. When does each break?'", where: "Ask for examples with actual SQL", mins: 20 },
        ]},
        { label: "Build", focus: "Twitter schema + optimization", resources: [
          { type: "Build", item: "Full Twitter schema: users, tweets, follows, likes, hashtags. Add indexes, explain choices.", where: "Draw ERD first, then write CREATE TABLE SQL.", mins: 60 },
          { type: "Ask Claude", item: "Paste your schema. Ask: 'N+1 risks and missing indexes in this schema?'", where: "Claude as your senior DB reviewer", mins: 20 },
        ]},
      ]},
      { n: 22, title: "NoSQL: MongoDB, DynamoDB & Redis", sessions: [
        { label: "Study", focus: "NoSQL data models", resources: [
          { type: "Book", item: "DDIA 1e – Ch 2 'Data Models and Query Languages'", where: "document, relational, graph models compared", mins: 45, url: "https://dataintensive.net/" },
          { type: "YouTube", item: "Fireship – 'SQL vs NoSQL Explained'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'fireship sql nosql'", mins: 12, url: "https://www.youtube.com/results?search_query=fireship%20sql%20nosql", isCore: false },
        ]},
        { label: "Study", focus: "Redis in depth", resources: [
          { type: "Platform", item: "Redis University – RU101: Intro to Redis Data Structures", where: "university.redis.io — FREE, ~3 hours total", mins: 45, url: "https://university.redis.io" },
          { type: "YouTube", item: "Hussein Nasser – 'Redis Crash Course'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'hussein nasser redis crash course'", mins: 30, url: "https://www.youtube.com/results?search_query=hussein%20nasser%20redis%20crash%20course", isCore: false },
        ]},
        { label: "Build", focus: "Project: Redis Leaderboard", resources: [
          { type: "Docs", item: "Redis sorted sets: ZADD, ZRANGE, ZRANK, ZINCRBY", where: "redis.io/docs/latest/develop/data-types/sorted-sets/", mins: 20, url: "https://redis.io/docs/latest/develop/data-types/sorted-sets/" },
          { type: "Build", item: "Gaming leaderboard: add scores, get top-10, user rank, paginate. FastAPI endpoint.", where: "Test with 1 million fake entries.", mins: 60 },
        ]},
      ]},
      { n: 23, title: "Replication & Partitioning", sessions: [
        { label: "Study", focus: "Replication strategies", resources: [
          { type: "Book", item: "DDIA 1e – Ch 5 'Replication' (full chapter)", where: "leader-follower, multi-leader, leaderless", mins: 50, url: "https://dataintensive.net/" },
          { type: "YouTube", item: "Martin Kleppmann – 'Distributed Systems Lecture 5: Replication'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'martin kleppmann distributed systems replication'", mins: 40, url: "https://www.youtube.com/results?search_query=martin%20kleppmann%20distributed%20systems%20replication", isCore: false },
        ]},
        { label: "Study", focus: "Partitioning & sharding", resources: [
          { type: "Book", item: "DDIA 1e – Ch 6 'Partitioning'", where: "key range vs hash, secondary indexes", mins: 45, url: "https://dataintensive.net/" },
          { type: "YouTube", item: "Gaurav Sen – 'Database Sharding'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'gaurav sen database sharding'", mins: 20, url: "https://www.youtube.com/results?search_query=gaurav%20sen%20database%20sharding", isCore: false },
        ]},
        { label: "Build", focus: "Design: Sharded user database", resources: [
          { type: "Ask Claude", item: "Ask: 'Shard key for 1-billion-user app. What are the hotspot risks?'", where: "Discuss consistent hashing vs range-based", mins: 25 },
          { type: "Build", item: "Write a doc: shard key options for users table. Pros/cons of each.", where: "At least 3 strategies with trade-off analysis.", mins: 45 },
        ]},
      ]},
      { n: 24, title: "CAP Theorem & Distributed Consensus", sessions: [
        { label: "Study", focus: "CAP & consistency models", resources: [
          { type: "Book", item: "DDIA 1e – Ch 8 'The Trouble with Distributed Systems'", where: "clocks, networks, partial failures", mins: 55, url: "https://dataintensive.net/" },
          { type: "Book", item: "DDIA 1e – Ch 9 'Consistency and Consensus'", where: "linearizability, Raft, 2PC", mins: 55, url: "https://dataintensive.net/" },
        ]},
        { label: "Study", focus: "Practical consistency choices", resources: [
          { type: "YouTube", item: "Martin Kleppmann – 'CAP Theorem'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'martin kleppmann cap theorem'", mins: 25, url: "https://www.youtube.com/results?search_query=martin%20kleppmann%20cap%20theorem", isCore: false },
          { type: "Docs", item: "Martin Kleppmann — Please stop calling databases CP or AP", where: "Read the author’s argument: qualify consistency and availability by operation and failure assumptions rather than labeling an entire database.", mins: 20, url: "https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html" },
        ]},
        { label: "Build", focus: "Consistency choice exercise", resources: [
          { type: "Build", item: "For 4 systems choose consistency model + justify: bank, social feed, shopping cart, DNS", where: "2–3 sentences per scenario.", mins: 45 },
          { type: "Ask Claude", item: "Share your choices. Ask: 'What are the second-order consequences of each choice?'", where: "Interviewer-style pushback practice", mins: 20 },
        ]},
      ]},
      { n: 25, title: "Blob Storage, CDN & Search Engines", sessions: [
        { label: "Study", focus: "Object storage & CDN", resources: [
          { type: "Docs", item: "Amazon S3 — object storage overview", where: "Read buckets, objects and access controls; separate object storage durability from CDN cache behavior.", mins: 30, url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html" },
          { type: "YouTube", item: "ByteByteGo – 'CDN Explained'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego cdn explained'", mins: 15, url: "https://www.youtube.com/results?search_query=bytebytego%20cdn%20explained", isCore: false },
        ]},
        { label: "Study", focus: "Search engines (Elasticsearch)", resources: [
          { type: "Docs", item: "Elasticsearch – 'Getting started' guide", where: "www.elastic.co/docs/solutions/search/get-started", mins: 30, url: "https://www.elastic.co/docs/solutions/search/get-started" },
          { type: "YouTube", item: "ByteByteGo – 'How does Elasticsearch work?'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego elasticsearch'", mins: 15, url: "https://www.youtube.com/results?search_query=bytebytego%20elasticsearch", isCore: false },
        ]},
        { label: "Build", focus: "Storage choice exercise", resources: [
          { type: "Build", item: "For 5 scenarios choose right storage + justify: pics, leaderboard, full-text, logs, video", where: "2–3 sentences per scenario.", mins: 45 },
          { type: "Ask Claude", item: "Ask: 'Review my storage choices and challenge me on each trade-off.'", where: "Debate-style review", mins: 20 },
        ]},
      ]},
    ],
  },
  {
    phase: 6, title: "Networking, APIs & Communication", icon: "🌐",
    accent: "#7C3AED", light: "#C4B5FD",
    desc: "Design robust APIs and understand how systems communicate",
    weeks: [
      { n: 26, title: "HTTP Deep Dive & REST APIs", sessions: [
        { label: "Study", focus: "HTTP fundamentals", resources: [
          { type: "YouTube", item: "Hussein Nasser – 'HTTP/1.1 vs HTTP/2 vs HTTP/3'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'hussein nasser http1 http2 http3'", mins: 30, url: "https://www.youtube.com/results?search_query=hussein%20nasser%20http1%20http2%20http3", isCore: false },
          { type: "YouTube", item: "Hussein Nasser – 'How HTTP Works'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'hussein nasser how http works'", mins: 25, url: "https://www.youtube.com/results?search_query=hussein%20nasser%20how%20http%20works", isCore: false },
        ]},
        { label: "Study", focus: "REST design + FastAPI", resources: [
          { type: "Docs", item: "Zalando REST API Guidelines", where: "Read HTTP methods/status codes, pagination, idempotency and compatibility; justify deviations for your API.", mins: 30, url: "https://opensource.zalando.com/restful-api-guidelines/" },
          { type: "Docs", item: "FastAPI – Getting Started tutorial (full walkthrough)", where: "fastapi.tiangolo.com/tutorial/ — do it hands-on", mins: 45, url: "https://fastapi.tiangolo.com/tutorial/" },
        ]},
        { label: "Build", focus: "Project: Blog REST API", resources: [
          { type: "Build", item: "FastAPI Blog API: Users, Posts, Comments, Tags. JWT headers, pagination, proper HTTP codes.", where: "SQLAlchemy + Pydantic + FastAPI. Full type hints.", mins: 60 },
        ]},
      ]},
      { n: 27, title: "gRPC, WebSockets & Real-time", sessions: [
        { label: "Study", focus: "gRPC & Protobuf", resources: [
          { type: "YouTube", item: "Hussein Nasser – 'gRPC Crash Course'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'hussein nasser grpc crash course'", mins: 35, url: "https://www.youtube.com/results?search_query=hussein%20nasser%20grpc%20crash%20course", isCore: false },
          { type: "Docs", item: "gRPC Python quickstart", where: "grpc.io/docs/languages/python/quickstart/", mins: 30, url: "https://grpc.io/docs/languages/python/quickstart/" },
        ]},
        { label: "Study", focus: "WebSockets & SSE", resources: [
          { type: "YouTube", item: "Hussein Nasser – 'WebSockets Crash Course'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'hussein nasser websockets'", mins: 30, url: "https://www.youtube.com/results?search_query=hussein%20nasser%20websockets", isCore: false },
          { type: "Docs", item: "FastAPI WebSockets documentation", where: "fastapi.tiangolo.com/advanced/websockets/", mins: 20, url: "https://fastapi.tiangolo.com/advanced/websockets/" },
        ]},
        { label: "Build", focus: "Project: Real-time chat", resources: [
          { type: "Build", item: "Real-time chat: FastAPI + WebSockets. Rooms, Redis message history, presence tracking.", where: "Handle reconnections. Test with multiple browser tabs.", mins: 60 },
          { type: "Ask Claude", item: "Ask: 'WebSockets vs SSE vs Long Polling — compare for my chat use case with trade-offs'", where: "Architecture decision practice", mins: 15 },
        ]},
      ]},
      { n: 28, title: "Message Queues & Event-Driven Architecture", sessions: [
        { label: "Study", focus: "Kafka fundamentals", resources: [
          { type: "YouTube", item: "ByteByteGo – 'What is a Message Queue?'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego message queue'", mins: 15, url: "https://www.youtube.com/results?search_query=bytebytego%20message%20queue", isCore: false },
          { type: "YouTube", item: "Hussein Nasser – 'Apache Kafka Crash Course'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'hussein nasser kafka crash course'", mins: 35, url: "https://www.youtube.com/results?search_query=hussein%20nasser%20kafka%20crash%20course", isCore: false },
        ]},
        { label: "Study", focus: "DDIA streams + event patterns", resources: [
          { type: "Book", item: "DDIA 1e – Ch 11 'Stream Processing'", where: "Kafka internals, exactly-once delivery", mins: 55, url: "https://dataintensive.net/" },
          { type: "YouTube", item: "ByteByteGo – 'Kafka vs RabbitMQ vs SQS'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego kafka rabbitmq'", mins: 15, url: "https://www.youtube.com/results?search_query=bytebytego%20kafka%20rabbitmq", isCore: false },
        ]},
        { label: "Build", focus: "Project: Async order processing pipeline", resources: [
          { type: "Docs", item: "confluent-kafka-python docs", where: "github.com/confluentinc/confluent-kafka-python", mins: 20, url: "https://github.com/confluentinc/confluent-kafka-python" },
          { type: "Build", item: "Order flow: REST API → Kafka producer → Consumer → Email/SMS. Handle retries.", where: "Log processing time per step.", mins: 60 },
        ]},
      ]},
      { n: 29, title: "Rate Limiting & API Gateway", sessions: [
        { label: "Study", focus: "Rate limiting algorithms", resources: [
          { type: "Book", item: "System Design Interview Vol 1 – Ch 4 'Design a Rate Limiter'", where: "token bucket, leaky bucket, sliding window", mins: 40, url: "https://bytebytego.com/courses/system-design-interview" },
          { type: "YouTube", item: "ByteByteGo – 'Rate Limiting'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego rate limiter'", mins: 15, url: "https://www.youtube.com/results?search_query=bytebytego%20rate%20limiter", isCore: false },
        ]},
        { label: "Study", focus: "API Gateway & GraphQL", resources: [
          { type: "Article", item: "AWS API Gateway overview", where: "aws.amazon.com/api-gateway/features/", mins: 25, url: "https://aws.amazon.com/api-gateway/features/" },
          { type: "YouTube", item: "Fireship – 'GraphQL in 100 seconds' + full video", where: "Optional video discovery (search results, not a verified video): YouTube → search 'fireship graphql'", mins: 20, url: "https://www.youtube.com/results?search_query=fireship%20graphql", isCore: false },
        ]},
        { label: "Build", focus: "Project: Rate limiter middleware", resources: [
          { type: "Build", item: "FastAPI middleware: token bucket rate limiter using Redis. X-RateLimit-* headers, 429 responses.", where: "Test with locust or wrk.", mins: 60 },
          { type: "Ask Claude", item: "Ask: 'In-process vs distributed rate limiter trade-offs. How does Stripe handle it?'", where: "Real operational complexity discussion", mins: 15 },
        ]},
      ]},
      { n: 30, title: "Security, Auth & API Best Practices", sessions: [
        { label: "Study", focus: "OAuth 2.0 & JWT", resources: [
          { type: "Article", item: "jwt.io – Introduction to JSON Web Tokens", where: "jwt.io/introduction — concise and official", mins: 20, url: "https://jwt.io/introduction" },
          { type: "YouTube", item: "Fireship – 'OAuth 2.0 Explained'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'fireship oauth 2.0'", mins: 12, url: "https://www.youtube.com/results?search_query=fireship%20oauth%202.0", isCore: false },
        ]},
        { label: "Study", focus: "API security patterns", resources: [
          { type: "Docs", item: "FastAPI — OAuth2, password hashing and JWT", where: "Follow the PyJWT and pwdlib example. Treat it as a learning example, then add object-level authorization, token expiry tests, and refresh-token replay handling.", mins: 35, url: "https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/" },
          { type: "Article", item: "OWASP API Security Top 10 (2023)", where: "owasp.org/API-Security/editions/2023/en/0x11-t10/", mins: 30, url: "https://owasp.org/API-Security/editions/2023/en/0x11-t10/" },
        ]},
        { label: "Build", focus: "Add auth to your Blog API", resources: [
          { type: "Build", item: "Add JWT auth: register, login, refresh tokens, role-based access. Protect endpoints.", where: "Follow the FastAPI JWT tutorial with PyJWT + pwdlib[argon2]. Test expiry, invalid signatures, ownership checks, and refresh-token replay.", mins: 60 },
        ]},
      ]},
      { n: 31, title: "Networking Deep Dives & Review", sessions: [
        { label: "Study", focus: "TCP/IP, DNS & TLS", resources: [
          { type: "YouTube", item: "Hussein Nasser – 'TCP vs UDP'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'hussein nasser tcp vs udp'", mins: 25, url: "https://www.youtube.com/results?search_query=hussein%20nasser%20tcp%20vs%20udp", isCore: false },
          { type: "YouTube", item: "Hussein Nasser – 'HTTPS, SSL, TLS Explained'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'hussein nasser https ssl tls'", mins: 25, url: "https://www.youtube.com/results?search_query=hussein%20nasser%20https%20ssl%20tls", isCore: false },
        ]},
        { label: "Study", focus: "Proxies, load balancers & DNS", resources: [
          { type: "YouTube", item: "Hussein Nasser – 'Proxy vs Reverse Proxy'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'hussein nasser proxy reverse proxy'", mins: 20, url: "https://www.youtube.com/results?search_query=hussein%20nasser%20proxy%20reverse%20proxy", isCore: false },
          { type: "YouTube", item: "ByteByteGo – 'DNS Explained'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego dns explained'", mins: 15, url: "https://www.youtube.com/results?search_query=bytebytego%20dns%20explained", isCore: false },
        ]},
        { label: "Build", focus: "Full networking diagram", resources: [
          { type: "Build", item: "Draw end-to-end: app calls api.twitter.com → DNS → TCP → TLS → HTTP → LB → App → DB", where: "Use Excalidraw. No code — just architecture.", mins: 45 },
          { type: "Ask Claude", item: "Share your diagram. Ask: 'What failure points did I miss?'", where: "Pressure-test your mental model", mins: 20 },
        ]},
      ]},
    ],
  },
  {
    phase: 7, title: "High-Level Design (HLD)", icon: "🏛️",
    accent: "#D97706", light: "#FDE68A",
    desc: "Design large-scale distributed systems end-to-end — 10 weeks of HLD case studies and framework",
    weeks: [
      { n: 32, title: "HLD Framework & Estimation", sessions: [
        { label: "Study", focus: "The canonical scale-up story", resources: [
          { type: "Book", item: "System Design Interview Vol 1 – Ch 1 'Scale from Zero to Millions'", where: "Read the named chapter; paid book access may be required. Summarize the design assumptions and tradeoffs.", mins: 40, url: "https://bytebytego.com/courses/system-design-interview" },
          { type: "Book", item: "System Design Interview Vol 1 – Ch 2 'Back-of-Envelope Estimation'", where: "memorize these numbers", mins: 30, url: "https://bytebytego.com/courses/system-design-interview" },
        ]},
        { label: "Study", focus: "HLD answer structure", resources: [
          { type: "YouTube", item: "ByteByteGo – 'System Design Interview Framework'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego system design framework'", mins: 20, url: "https://www.youtube.com/results?search_query=bytebytego%20system%20design%20framework", isCore: false },
          { type: "Article", item: "GitHub: donnemartin/system-design-primer", where: "github.com/donnemartin/system-design-primer — bookmark this now", mins: 30, url: "https://github.com/donnemartin/system-design-primer" },
        ]},
        { label: "Build", focus: "Estimation practice", resources: [
          { type: "Build", item: "Estimate for Twitter: DAU, tweets/day, read/write ratio, storage/year, bandwidth.", where: "Aim for order-of-magnitude accuracy.", mins: 40 },
          { type: "Ask Claude", item: "Ask: 'Check my Twitter estimates. Where am I off?'", where: "Get the standard interviewer numbers", mins: 20 },
        ]},
      ]},
      { n: 33, title: "Load Balancing & Horizontal Scaling", sessions: [
        { label: "Study", focus: "Load balancers deep dive", resources: [
          { type: "YouTube", item: "Hussein Nasser – 'Load Balancing'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'hussein nasser load balancing'", mins: 30, url: "https://www.youtube.com/results?search_query=hussein%20nasser%20load%20balancing", isCore: false },
          { type: "YouTube", item: "ByteByteGo – 'Cache Systems Every Developer Should Know'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego cache systems'", mins: 18, url: "https://www.youtube.com/results?search_query=bytebytego%20cache%20systems", isCore: false },
        ]},
        { label: "Study", focus: "Stateless design", resources: [
          { type: "Book", item: "System Design Interview Vol 1 – Ch 1 (stateless web tier section)", where: "Re-read the stateless + data tier sections", mins: 25, url: "https://bytebytego.com/courses/system-design-interview" },
          { type: "YouTube", item: "ByteByteGo – 'Horizontal vs Vertical Scaling'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego horizontal vertical scaling'", mins: 12, url: "https://www.youtube.com/results?search_query=bytebytego%20horizontal%20vertical%20scaling", isCore: false },
        ]},
        { label: "Build", focus: "Design: URL Shortener (bit.ly)", resources: [
          { type: "Build", item: "Design URL shortener on Excalidraw FIRST (45 min) — then read the book chapter", where: "API, ID gen (base62), redirect, analytics, expiry", mins: 45 },
          { type: "Book", item: "System Design Interview Vol 1 – Ch 8 'Design a URL Shortener'", where: "read after your own attempt", mins: 35, url: "https://bytebytego.com/courses/system-design-interview" },
        ]},
      ]},
      { n: 34, title: "Consistent Hashing & Key-Value Stores", sessions: [
        { label: "Study", focus: "Consistent hashing", resources: [
          { type: "Book", item: "System Design Interview Vol 1 – Ch 5 'Design Consistent Hashing'", where: "critical HLD building block", mins: 40, url: "https://bytebytego.com/courses/system-design-interview" },
          { type: "YouTube", item: "ByteByteGo – 'Consistent Hashing Explained'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego consistent hashing'", mins: 15, url: "https://www.youtube.com/results?search_query=bytebytego%20consistent%20hashing", isCore: false },
        ]},
        { label: "Study", focus: "Distributed key-value stores", resources: [
          { type: "Book", item: "System Design Interview Vol 1 – Ch 6 'Design a Key-Value Store'", where: "Read the named chapter; paid book access may be required. Summarize the design assumptions and tradeoffs.", mins: 45, url: "https://bytebytego.com/courses/system-design-interview" },
          { type: "Article", item: "AWS DynamoDB architecture blog", where: "aws.amazon.com/blogs → search 'DynamoDB architecture'", mins: 25, url: "https://aws.amazon.com/blogs" },
        ]},
        { label: "Build", focus: "Design: Pastebin", resources: [
          { type: "Build", item: "Design Pastebin: paste storage (S3 + metadata DB), URL shortening, expiry, CDN", where: "Full Excalidraw diagram.", mins: 50 },
        ]},
      ]},
      { n: 35, title: "Social Media Feed Design", sessions: [
        { label: "Study", focus: "Feed generation strategies", resources: [
          { type: "Book", item: "System Design Interview Vol 1 – Ch 11 'Design a News Feed'", where: "push vs pull vs hybrid, fanout", mins: 40, url: "https://bytebytego.com/courses/system-design-interview" },
          { type: "YouTube", item: "Gaurav Sen – 'Design Facebook / Twitter News Feed'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'gaurav sen news feed design'", mins: 25, url: "https://www.youtube.com/results?search_query=gaurav%20sen%20news%20feed%20design", isCore: false },
        ]},
        { label: "Study", focus: "Instagram & Twitter reality", resources: [
          { type: "Docs", item: "Meta Engineering — How Threads infrastructure was built", where: "A historical production case study. Compare its constraints with your own feed design rather than copying its architecture.", mins: 25, url: "https://engineering.fb.com/2023/12/19/core-infra/how-meta-built-the-infrastructure-for-threads/" },
          { type: "YouTube", item: "ByteByteGo – 'Design Twitter'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego design twitter'", mins: 18, url: "https://www.youtube.com/results?search_query=bytebytego%20design%20twitter", isCore: false },
        ]},
        { label: "Build", focus: "Design: Twitter/Instagram feed", resources: [
          { type: "Build", item: "Full design doc + Excalidraw: Twitter feed. Fanout, timeline, caching, media. 45-min timed.", where: "Write a 1-page design doc after.", mins: 60 },
        ]},
      ]},
      { n: 36, title: "Messaging & Chat Systems", sessions: [
        { label: "Study", focus: "Chat system architecture", resources: [
          { type: "Book", item: "System Design Interview Vol 1 – Ch 12 'Design a Chat System'", where: "Read the named chapter; paid book access may be required. Summarize the design assumptions and tradeoffs.", mins: 45, url: "https://bytebytego.com/courses/system-design-interview" },
          { type: "YouTube", item: "ByteByteGo – 'WhatsApp System Design'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego whatsapp system design'", mins: 18, url: "https://www.youtube.com/results?search_query=bytebytego%20whatsapp%20system%20design", isCore: false },
        ]},
        { label: "Study", focus: "Engineering at WhatsApp scale", resources: [
          { type: "Docs", item: "Slack Engineering — real-time messaging", where: "Study persistent connections and routing; explain reconnect, delivery and fanout behavior in your own design.", mins: 25, url: "https://slack.engineering/real-time-messaging/" },
          { type: "YouTube", item: "Gaurav Sen – 'Messenger / WhatsApp system design'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'gaurav sen messenger system design'", mins: 25, url: "https://www.youtube.com/results?search_query=gaurav%20sen%20messenger%20system%20design", isCore: false },
        ]},
        { label: "Build", focus: "Design: WhatsApp / Messenger", resources: [
          { type: "Build", item: "Design WhatsApp: 1:1 + group, delivery receipts, presence, offline storage. 45-min timed.", where: "Full Excalidraw + 1-page design doc.", mins: 60 },
        ]},
      ]},
      { n: 37, title: "Distributed Transactions & Ride-Sharing", sessions: [
        { label: "Study", focus: "Saga pattern", resources: [
          { type: "Article", item: "Chris Richardson – 'Pattern: Saga' at microservices.io", where: "microservices.io/patterns/data/saga.html", mins: 30, url: "https://microservices.io/patterns/data/saga.html" },
          { type: "YouTube", item: "CodeOpinion – 'Saga Pattern for Microservices'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'codeopinion saga pattern microservices'", mins: 25, url: "https://www.youtube.com/results?search_query=codeopinion%20saga%20pattern%20microservices", isCore: false },
        ]},
        { label: "Study", focus: "Uber engineering deep dive", resources: [
          { type: "YouTube", item: "ByteByteGo – 'Uber System Design'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego uber system design'", mins: 20, url: "https://www.youtube.com/results?search_query=bytebytego%20uber%20system%20design", isCore: false },
          { type: "Docs", item: "Uber — Domain-Oriented Microservice Architecture", where: "Study service boundaries and dependencies; identify when a modular monolith is simpler for your project.", mins: 25, url: "https://www.uber.com/us/en/blog/microservice-architecture/" },
        ]},
        { label: "Build", focus: "Design: Ride-sharing (Uber/Ola)", resources: [
          { type: "Build", item: "Design Uber: driver matching (geohash), trip tracking, surge pricing, saga payment. 45-min timed.", where: "Use geohash or quadtree for location search.", mins: 60 },
        ]},
      ]},
      { n: 38, title: "Search Systems & Typeahead", sessions: [
        { label: "Study", focus: "Autocomplete & trie structures", resources: [
          { type: "Book", item: "System Design Interview Vol 1 – Ch 13 'Design a Search Autocomplete System'", where: "Read the named chapter; paid book access may be required. Summarize the design assumptions and tradeoffs.", mins: 40, url: "https://bytebytego.com/courses/system-design-interview" },
          { type: "YouTube", item: "Gaurav Sen – 'Typeahead Suggestion System Design'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'gaurav sen typeahead suggestion'", mins: 20, url: "https://www.youtube.com/results?search_query=gaurav%20sen%20typeahead%20suggestion", isCore: false },
        ]},
        { label: "Study", focus: "Web crawlers & full-text search", resources: [
          { type: "YouTube", item: "ByteByteGo – 'How does Google Search work?'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego google search'", mins: 15, url: "https://www.youtube.com/results?search_query=bytebytego%20google%20search", isCore: false },
          { type: "Docs", item: "Stanford — Introduction to Information Retrieval", where: "Free textbook: start with Boolean retrieval and inverted indexes; use the web crawling chapter for crawl-frontier and politeness design.", mins: 40, url: "https://nlp.stanford.edu/IR-book/" },
        ]},
        { label: "Build", focus: "Design: Search Autocomplete", resources: [
          { type: "Build", item: "Design Google-style typeahead: trie vs DB, aggregation pipeline, caching hot queries. 45-min timed.", where: "Draw keypress → suggestion data flow.", mins: 55 },
        ]},
      ]},
      { n: 39, title: "Video Streaming (YouTube / Netflix)", sessions: [
        { label: "Study", focus: "Video system design", resources: [
          { type: "Docs", item: "Netflix Open Connect — CDN architecture", where: "Study content placement and delivery. Design upload/transcoding separately; do not assume the CDN handles the whole video pipeline.", mins: 45, url: "https://openconnect.netflix.com/en/" },
          { type: "YouTube", item: "ByteByteGo – 'Netflix System Design'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego netflix system design'", mins: 18, url: "https://www.youtube.com/results?search_query=bytebytego%20netflix%20system%20design", isCore: false },
        ]},
        { label: "Study", focus: "Real Netflix engineering", resources: [
          { type: "Docs", item: "Netflix Open Connect — deployment and delivery", where: "Compare embedded and peering delivery; identify origin, cache and network failure modes.", mins: 25, url: "https://openconnect.netflix.com/en/" },
          { type: "Docs", item: "Apple — HTTP Live Streaming", where: "Read manifests and adaptive bitrate basics. Explain segment duration, startup delay and buffering; compare DASH separately if needed.", mins: 20, url: "https://developer.apple.com/streaming/" },
        ]},
        { label: "Build", focus: "Design: YouTube", resources: [
          { type: "Build", item: "Design YouTube: upload → async transcoding (Kafka) → CDN → view count → recommendations. 45-min timed.", where: "Focus on the async pipeline.", mins: 60 },
        ]},
      ]},
      { n: 40, title: "Payment Systems & Notifications", sessions: [
        { label: "Study", focus: "Payment system design", resources: [
          { type: "YouTube", item: "ByteByteGo – 'Payment System Design'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego payment system design'", mins: 20, url: "https://www.youtube.com/results?search_query=bytebytego%20payment%20system%20design", isCore: false },
          { type: "Docs", item: "Stripe — Designing robust APIs with idempotency", where: "Distinguish retry-safe operations from exactly-once delivery. Test duplicate requests, unknown outcomes after timeouts, and reconciliation.", mins: 25, url: "https://stripe.com/blog/idempotency" },
        ]},
        { label: "Study", focus: "Notification system at scale", resources: [
          { type: "Book", item: "System Design Interview Vol 1 – Ch 10 'Design a Notification System'", where: "Read the named chapter; paid book access may be required. Summarize the design assumptions and tradeoffs.", mins: 35, url: "https://bytebytego.com/courses/system-design-interview" },
          { type: "YouTube", item: "Gaurav Sen – 'Notification Service Design'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'gaurav sen notification service'", mins: 20, url: "https://www.youtube.com/results?search_query=gaurav%20sen%20notification%20service", isCore: false },
        ]},
        { label: "Build", focus: "Design: Payment system", resources: [
          { type: "Build", item: "Design payment system: idempotency key, double-entry ledger, saga, reconciliation. 45-min timed.", where: "Correctness over speed.", mins: 60 },
        ]},
      ]},
      { n: 41, title: "HLD Mock Interview Gauntlet", sessions: [
        { label: "Practice", focus: "Mock 1: URL Shortener", resources: [
          { type: "Practice", item: "Timed mock: Design bit.ly in 45 min. No notes. Whiteboard only.", where: "Requirements → estimates → components → bottlenecks.", mins: 50 },
          { type: "YouTube", item: "Watch a system design mock and compare your approach", where: "Optional video discovery (search results, not a verified video): YouTube → search 'system design interview URL shortener mock'", mins: 30, url: "https://www.youtube.com/results?search_query=system%20design%20interview%20URL%20shortener%20mock", isCore: false },
        ]},
        { label: "Practice", focus: "Mock 2: Twitter or WhatsApp", resources: [
          { type: "Practice", item: "Timed mock: Design Twitter feed OR WhatsApp in 45 min. Record yourself.", where: "Watch it back. Find where you stalled.", mins: 50 },
          { type: "Ask Claude", item: "Ask: 'Critique my WhatsApp design. What would break at 1 billion users?'", where: "Stress-test your design", mins: 20 },
        ]},
        { label: "Practice", focus: "Mock 3: Your weakest system", resources: [
          { type: "Practice", item: "Pick the system you felt weakest on. Redo it cold. No notes.", where: "Use Pramp.com or ask a friend.", mins: 50 },
          { type: "Build", item: "Write 'HLD Lessons Learned': top 5 things you do differently now vs Week 32", where: "Review before every interview.", mins: 25 },
        ]},
      ]},
    ],
  },
  {
    phase: 8, title: "Reliability, Observability & DevOps", icon: "🔧",
    accent: "#E11D48", light: "#FDA4AF",
    desc: "Make your systems production-ready: SRE, resilience patterns, observability, Docker, and Kubernetes",
    weeks: [
      { n: 42, title: "SRE, Error Budgets & Resilience", sessions: [
        { label: "Study", focus: "SRE fundamentals", resources: [
          { type: "Book", item: "Google SRE Book – Ch 1 + Ch 2 'The Production Environment'", where: "sre.google/sre-book/ — FREE online.", mins: 45, url: "https://sre.google/sre-book/" },
          { type: "Book", item: "Google SRE Book – Ch 3 'Embracing Risk' + Ch 4 'Service Level Objectives'", where: "SLIs, SLOs, error budgets", mins: 40, url: "https://sre.google/sre-book/table-of-contents/" },
        ]},
        { label: "Study", focus: "Resilience patterns", resources: [
          { type: "Article", item: "Martin Fowler – 'CircuitBreaker' pattern", where: "martinfowler.com/bliki/CircuitBreaker.html", mins: 25, url: "https://martinfowler.com/bliki/CircuitBreaker.html" },
          { type: "YouTube", item: "ByteByteGo – 'Resilience Patterns: Retry, Circuit Breaker, Timeout'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego resilience patterns'", mins: 15, url: "https://www.youtube.com/results?search_query=bytebytego%20resilience%20patterns", isCore: false },
        ]},
        { label: "Build", focus: "Circuit breaker on your services", resources: [
          { type: "Docs", item: "pybreaker library (Python circuit breaker)", where: "github.com/danielfm/pybreaker", mins: 15, url: "https://github.com/danielfm/pybreaker" },
          { type: "Build", item: "Circuit breaker + exponential backoff on Kafka order service. Kill services to watch it open/close.", where: "Simulate failures. Add alerting.", mins: 60 },
        ]},
      ]},
      { n: 43, title: "Observability: Logs, Metrics & Traces", sessions: [
        { label: "Study", focus: "The 3 pillars of observability", resources: [
          { type: "Docs", item: "OpenTelemetry — observability primer", where: "Connect logs, metrics and traces to a debugging question; identify which signal would expose a slow downstream dependency.", mins: 20, url: "https://opentelemetry.io/docs/concepts/observability-primer/" },
          { type: "YouTube", item: "ByteByteGo – 'Logging, Metrics, Tracing Explained'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego logging metrics tracing'", mins: 15, url: "https://www.youtube.com/results?search_query=bytebytego%20logging%20metrics%20tracing", isCore: false },
        ]},
        { label: "Study", focus: "OpenTelemetry + Prometheus", resources: [
          { type: "Docs", item: "OpenTelemetry Python – Getting Started", where: "opentelemetry.io/docs/languages/python/getting-started/", mins: 35, url: "https://opentelemetry.io/docs/languages/python/getting-started/" },
          { type: "YouTube", item: "TechWorld with Nana – 'Prometheus and Grafana Tutorial'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'nana prometheus grafana tutorial'", mins: 35, url: "https://www.youtube.com/results?search_query=nana%20prometheus%20grafana%20tutorial", isCore: false },
        ]},
        { label: "Build", focus: "Full observability on chat service", resources: [
          { type: "Build", item: "Add: structlog JSON logging, Prometheus metrics, OpenTelemetry traces, Grafana dashboard via docker-compose.", where: "See your own system in a real dashboard!", mins: 60 },
        ]},
      ]},
      { n: 44, title: "Docker & Kubernetes", sessions: [
        { label: "Study", focus: "Docker fundamentals + Compose", resources: [
          { type: "YouTube", item: "TechWorld with Nana – 'Docker Tutorial for Beginners'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'nana docker tutorial beginners'", mins: 50, url: "https://www.youtube.com/results?search_query=nana%20docker%20tutorial%20beginners", isCore: false },
          { type: "YouTube", item: "TechWorld with Nana – 'Docker Compose Tutorial'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'nana docker compose tutorial'", mins: 30, url: "https://www.youtube.com/results?search_query=nana%20docker%20compose%20tutorial", isCore: false },
        ]},
        { label: "Study", focus: "Kubernetes core concepts", resources: [
          { type: "YouTube", item: "TechWorld with Nana – 'Kubernetes Tutorial for Beginners'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'nana kubernetes tutorial beginners'", mins: 50, url: "https://www.youtube.com/results?search_query=nana%20kubernetes%20tutorial%20beginners", isCore: false },
          { type: "Docs", item: "Kubernetes – Getting started with minikube", where: "kubernetes.io/docs/tutorials/hello-minikube/", mins: 30, url: "https://kubernetes.io/docs/tutorials/hello-minikube/" },
        ]},
        { label: "Build", focus: "Containerize and deploy Blog API", resources: [
          { type: "Build", item: "Dockerize Blog API: multi-stage Dockerfile, docker-compose (PostgreSQL + Redis + API), health checks. Deploy to minikube with Deployment + Service.", where: "Teach yourself the full container lifecycle. Ask Claude to review the Dockerfile!", mins: 90 },
        ]},
      ]},
      { n: 45, title: "CI/CD & Deployment", sessions: [
        { label: "Study", focus: "CI/CD pipeline design", resources: [
          { type: "YouTube", item: "TechWorld with Nana – 'CI/CD Pipeline with GitHub Actions'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'nana github actions ci cd'", mins: 30, url: "https://www.youtube.com/results?search_query=nana%20github%20actions%20ci%20cd", isCore: false },
          { type: "Article", item: "Google Cloud – 'DevOps: Continuous Delivery'", where: "cloud.google.com/architecture/devops/devops-tech-continuous-delivery", mins: 20, url: "https://cloud.google.com/architecture/devops/devops-tech-continuous-delivery" },
        ]},
        { label: "Study", focus: "Deployment strategies — blue/green, canary", resources: [
          { type: "YouTube", item: "ByteByteGo – 'Blue-Green Deployment vs Canary Deployment'", where: "Optional video discovery (search results, not a verified video): YouTube → search 'bytebytego blue green canary deployment'", mins: 15, url: "https://www.youtube.com/results?search_query=bytebytego%20blue%20green%20canary%20deployment", isCore: false },
          { type: "Ask Claude", item: "Ask: 'Design a zero-downtime deployment pipeline for my Blog API. What strategy fits?'", where: "Understand trade-offs before choosing", mins: 20 },
        ]},
        { label: "Build", focus: "Deploy to cloud with full CI/CD", resources: [
          { type: "Build", item: "Deploy Blog API: Dockerize → registry → Railway/Render/Fly.io → GitHub Actions CI on every push → pytest + mypy + coverage gates.", where: "Teaches the full deployment lifecycle. Ask Claude for the Actions YAML!", mins: 75 },
        ]},
      ]},
    ],
  },
  {
    phase: 9, title: "Interview Prep & Capstone", icon: "🎓",
    accent: "#16A34A", light: "#86EFAC",
    desc: "Mock interviews, capstone project, and portfolio",
    weeks: [
      { n: 46, title: "LLD Mock Interviews & Review", sessions: [
        { label: "Practice", focus: "Mock LLD 1 & 2", resources: [
          { type: "Practice", item: "Timed LLD mock: Parking Lot, 40 min. No notes. Speak aloud.", where: "Draw on paper or Excalidraw.", mins: 45 },
          { type: "Platform", item: "Schedule a Pramp interview (free peer system design interviews)", where: "pramp.com — free, matches you with another engineer", mins: 60, url: "https://pramp.com" },
        ]},
        { label: "Practice", focus: "Claude as your interviewer", resources: [
          { type: "Ask Claude", item: "Ask: 'Interview me on designing a ride-sharing LLD. Start simple, add complexity. Push back.'", where: "Ask for scoring after.", mins: 40 },
          { type: "Build", item: "Write 'My LLD Playbook': 2-page cheat sheet of patterns you reach for first", where: "Your mental checklist for every future problem.", mins: 35 },
        ]},
        { label: "Review", focus: "Gap analysis", resources: [
          { type: "Build", item: "Re-read all your LLD design docs from Phase 3. Annotate what you'd change now.", where: "You'll see how much your thinking has evolved.", mins: 45 },
        ]},
      ]},
      { n: 47, title: "HLD Mock Interviews", sessions: [
        { label: "Practice", focus: "Mock HLD 1 & 2", resources: [
          { type: "Platform", item: "Peer mock interview — schedule feedback with another engineer", where: "Use a peer or check the platform’s current availability and pricing; do not assume a free professional mock is available.", mins: 60, url: "https://interviewing.io/" },
          { type: "Practice", item: "Timed mock: Design YouTube in 45 min. Record on camera. Watch back.", where: "Ask: 'What degrades gracefully?'", mins: 50 },
        ]},
        { label: "Practice", focus: "Mock HLD 3 + gap identification", resources: [
          { type: "Practice", item: "Timed mock: Your weakest HLD system, cold. No notes.", where: "Real interview conditions. Strict timing.", mins: 50 },
          { type: "Ask Claude", item: "Tell Claude your top 3 HLD weaknesses. Ask for 5 tough follow-up questions for each.", where: "The hardest interview prep drill you can do", mins: 30 },
        ]},
        { label: "Review", focus: "Final consolidation", resources: [
          { type: "Build", item: "Re-read ALL design docs from Phase 7. Annotate what you'd change now.", where: "Fastest way to close remaining gaps.", mins: 60 },
        ]},
      ]},
      { n: 48, title: "Capstone: Mini Twitter Clone", sessions: [
        { label: "Build", focus: "Architecture doc + foundation", resources: [
          { type: "Build", item: "Write 1-page architecture doc BEFORE writing any code: components, data models, API contracts.", where: "No shortcuts — this discipline separates great engineers.", mins: 45 },
          { type: "Build", item: "Set up: FastAPI + PostgreSQL + Redis + Kafka in docker-compose. Schema + migrations working.", where: "Get the plumbing right first.", mins: 60 },
        ]},
        { label: "Build", focus: "Core services", resources: [
          { type: "Build", item: "User service (JWT auth) + Tweet service + Follow service. Apply all your LLD patterns.", where: "Budget several sessions. Start with a modular service; prove authentication and ownership checks with integration tests before adding distributed components.", mins: 360 },
        ]},
        { label: "Build", focus: "Feed + notifications + observability", resources: [
          { type: "Build", item: "Feed (fan-out via Redis) + Kafka notifications + Prometheus metrics + Grafana dashboard.", where: "Test duplicate notification events, stale timeline entries and Redis/Kafka outages. Include a runnable local stack and one dashboard explaining a failure.", mins: 360 },
        ]},
      ]},
      { n: 49, title: "Deploy, Portfolio & Celebration 🎉", sessions: [
        { label: "Build", focus: "Deploy + portfolio docs", resources: [
          { type: "Build", item: "Deploy to cloud with CI/CD. README with Excalidraw architecture diagram.", where: "What you show in interviews and to the world.", mins: 60 },
          { type: "Build", item: "Record a 10-min Loom video: architecture decisions, trade-offs, what you'd change at 10x scale.", where: "loom.com — free. Link in GitHub and LinkedIn.", mins: 30, url: "https://loom.com" },
        ]},
        { label: "Build", focus: "Community + reflection", resources: [
          { type: "Build", item: "Write a LinkedIn post: your journey. Key lessons + what you built.", where: "Tag #systemdesign #python #softwarearchitecture", mins: 30 },
          { type: "Ask Claude", item: "Full mock: LLD (30 min) + HLD (45 min) back to back. Ask for 1–10 scoring per dimension.", where: "The ultimate stress test. You've earned this.", mins: 75 },
        ]},
        { label: "Review", focus: "The meta-level view", resources: [
          { type: "Ask Claude", item: "Ask: 'What are the most common mistakes senior engineers make in system design?'", where: "The final boss question. You're ready for it.", mins: 30 },
        ]},
      ]},
    ],
  },
];

for (const phase of pythonRoadmap) {
  phase.outcomes = PHASE_OUTCOMES.python[phase.phase];
  for (const week of phase.weeks) week.learningObjectives = WEEK_OBJECTIVES.python[week.n];
}
