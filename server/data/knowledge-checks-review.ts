import type { WeekCheckSeed } from './knowledge-checks';

// Scenario checks for topics corrected in the content review. Explain the failure
// mode before selecting an answer; these complement each week's practical build.
export const REVIEW_CHECKS: WeekCheckSeed[] = [
  {
    language: 'python', phase: 2, week: 5, title: 'Interfaces and runtime guarantees',
    mcq: [
      { prompt: 'A class implements the methods of a Protocol without inheriting from it. What can a static type checker do?', options: ['Reject it because inheritance is mandatory', 'Accept it when the required signatures match', 'Guarantee all input values are valid at runtime'], correct: [1], explanation: 'Protocols support structural subtyping. Static compatibility does not validate arbitrary runtime inputs. See the typing.Protocol documentation.' },
      { prompt: 'A frozen dataclass contains a list. Which statement is correct?', options: ['The list cannot change', 'Normal field reassignment is prevented, but the list can still mutate', 'The class is automatically safe for all concurrent use'], correct: [1], explanation: 'Frozen dataclasses prevent normal attribute assignment; they do not recursively freeze referenced objects. Use immutable components or defensive copies when required.' },
    ],
  },
  {
    language: 'python', phase: 2, week: 8, title: 'Async cancellation and bounded concurrency',
    mcq: [
      { prompt: 'One TaskGroup child raises an unhandled non-cancellation exception. What happens to unfinished sibling tasks?', options: ['They run indefinitely', 'They are cancelled and the group waits for cleanup', 'Their work is automatically retried'], correct: [1], explanation: 'TaskGroup uses structured cancellation and reports failures after tasks finish cleanup. Catch expected per-URL failures inside tasks when partial results are the chosen policy.' },
      { prompt: 'An async scraper schedules 10,000 requests. What bounds pressure on the remote server?', options: ['Using async def alone', 'A concurrency limit plus timeouts and rate-aware retry policy', 'Suppressing every exception'], correct: [1], explanation: 'Coroutines alone do not impose backpressure. Bound active requests, respect server limits, close sessions, and preserve cancellation.' },
    ],
  },
  {
    language: 'python', phase: 2, week: 10, title: 'Choosing a concurrency model',
    mcq: [
      { prompt: 'An image resize benchmark is faster with threads on GIL-enabled CPython. Is that necessarily an invalid result?', options: ['Yes, threads can never run CPU work in parallel', 'No, the native image library may release the GIL', 'Yes, processes always outperform threads'], correct: [1], explanation: 'Native extensions can release the GIL. Separate I/O and compute timing and record the runtime, extension behavior, process startup and serialization overhead.' },
      { prompt: 'Which benchmark comparison is meaningful?', options: ['Different URLs and response sizes in each mode', 'Identical controlled inputs, reported runtime settings, repeated runs and error counts', 'Only the fastest run, excluding failed requests'], correct: [1], explanation: 'Control the workload and report variability and failures. There is no universal fixed speedup from switching concurrency models.' },
    ],
  },
  {
    language: 'python', phase: 5, week: 21, title: 'Transactions and business invariants',
    mcq: [
      { prompt: 'Two transactions both read the last available seat and then book it. Which approach can enforce the invariant?', options: ['A Python if statement before an unconstrained insert', 'A database constraint or atomic conditional update, with transaction handling', 'An index alone guarantees that no two users book it'], correct: [1], explanation: 'Enforce the invariant atomically in the database. An ordinary check-then-write can race; an index used only for performance does not prevent the conflicting write.' },
      { prompt: 'PostgreSQL rejects a serializable transaction with a serialization failure. What should a retry repeat?', options: ['Only the final write using the old reads', 'The whole transaction, with a bounded retry policy', 'Nothing; suppress the error and report success'], correct: [1], explanation: 'Retry the entire transaction so reads and decisions are recomputed. External side effects require separate idempotency or coordination.' },
    ],
  },
  {
    language: 'python', phase: 6, week: 30, title: 'Authentication versus authorization',
    mcq: [
      { prompt: 'A valid signed JWT identifies Alice. Is that sufficient to return any requested user document?', options: ['Yes, the signature grants access to every resource', 'No, check ownership or permissions for the requested object', 'Yes, if the document ID is difficult to guess'], correct: [1], explanation: 'Authentication establishes identity. Object-level authorization decides whether that identity may access the specific resource.' },
      { prompt: 'Which JWT validations belong on the server? Select all that apply.', options: ['Signature using an explicitly allowed algorithm', 'Expiry and applicable issuer/audience constraints', 'Trusting a token because its payload decodes as JSON'], correct: [0, 1], explanation: 'Encoding is not authenticity. Validate the signature and the claims required by the application before accepting the identity.' },
    ],
  },
  {
    language: 'java', phase: 1, week: 4, title: 'Virtual threads and downstream limits',
    mcq: [
      { prompt: 'Moving HTTP requests onto virtual threads overloads a downstream service. What is missing?', options: ['A larger number of virtual threads', 'A downstream concurrency/rate limit and bounded deadlines', 'A guarantee that virtual threads make calls faster'], correct: [1], explanation: 'Virtual threads make waiting tasks cheaper; they do not increase downstream capacity. Bound concurrent requests and measure throughput and tail latency.' },
      { prompt: 'Which statement applies to the Java 21 baseline?', options: ['Virtual threads and StructuredTaskScope are both final APIs', 'Virtual threads are final; StructuredTaskScope is a separate preview API', 'Virtual threads require preview flags'], correct: [1], explanation: 'JEP 444 finalized virtual threads in Java 21. Structured concurrency was separately previewed in JEP 453; core exercises need not enable it.' },
    ],
  },
  {
    language: 'java', phase: 1, week: 6, title: 'Collection invariants',
    mcq: [
      { prompt: 'To retain the K largest values from a long input using O(K) heap space, which heap should you maintain?', options: ['A min-heap of at most K values', 'An unbounded min-heap containing all values', 'A max-heap of K values, always discarding its largest'], correct: [0], explanation: 'The smallest retained value is the replacement threshold. Insert a candidate and remove the minimum when the heap exceeds K.' },
      { prompt: 'Why can get() need exclusive locking on an access-order LinkedHashMap?', options: ['It modifies the access order', 'All Java reads always modify memory', 'A read lock automatically upgrades itself'], correct: [0], explanation: 'A successful access can move an entry in the linked order. Treat it as a mutation when coordinating concurrent access to an LRU cache.' },
    ],
  },
  {
    language: 'java', phase: 4, week: 21, title: 'Redis leases and ownership',
    mcq: [
      { prompt: 'Why is SET key token NX PX timeout preferable to SETNX followed by EXPIRE for acquiring a lease?', options: ['It makes acquisition and expiry atomic', 'It prevents every failover anomaly', 'It prevents a client from ever pausing'], correct: [0], explanation: 'A crash between SETNX and EXPIRE can leave an indefinite key. Atomic acquisition with expiry avoids that gap, but does not solve all distributed coordination problems.' },
      { prompt: 'A lease expires and another client acquires it. How should the original owner release its lease?', options: ['Unconditionally DEL the key', 'Atomically delete only if the stored token still matches its ownership token', 'Delete all keys with the same prefix'], correct: [1], explanation: 'An ownership check prevents deleting another owner’s lease. A stale client may still act after expiry; correctness-sensitive writes may require fencing at the protected resource.' },
    ],
  },
  {
    language: 'java', phase: 4, week: 23, title: 'Messaging guarantees and duplicate effects',
    mcq: [
      { prompt: 'A consumer updates PostgreSQL, then crashes before committing its Kafka offset. What can happen?', options: ['Kafka automatically undoes the PostgreSQL transaction', 'The message is redelivered and the database effect may be repeated', 'The message can never be read again'], correct: [1], explanation: 'Offset commits and independent database transactions are not automatically atomic. Make processing idempotent, for example with a deduplication record in the same DB transaction as the effect.' },
      { prompt: 'Does an idempotent Kafka producer ensure exactly one email is sent by a consumer?', options: ['Yes, for every external system', 'No, external effects need their own deduplication and failure handling', 'Only if the topic has one partition'], correct: [1], explanation: 'Kafka producer/transaction guarantees have a defined boundary. Email delivery outside that boundary is not automatically deduplicated.' },
    ],
  },
  {
    language: 'java', phase: 8, week: 47, title: 'Safe retries and unknown outcomes',
    mcq: [
      { prompt: 'A payment provider times out after possibly charging the customer. What should the service do?', options: ['Immediately charge through another provider', 'Record the unknown outcome and reconcile or retry using the provider’s idempotency contract', 'Return a cached successful charge'], correct: [1], explanation: 'A timeout does not prove failure. Blind fallback can double-charge; preserve the operation identity and reconcile the outcome before creating another charge.' },
      { prompt: 'Why add jitter and a retry budget to exponential backoff?', options: ['They guarantee eventual success', 'They reduce synchronized retry bursts and limit amplification', 'They replace the need for deadlines'], correct: [1], explanation: 'Correlated retries can overload a recovering dependency. Jitter spreads retries and a budget bounds extra work; deadlines and idempotency remain necessary.' },
    ],
  },
];
