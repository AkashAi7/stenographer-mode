window.__STENO_BENCHMARK__ = {
  "tokenizer": "gpt-tokenizer",
  "generatedAt": "2026-04-24T11:11:28.126Z",
  "sampleCount": 51,
  "categories": 7,
  "averages": {
    "baseline": 50,
    "caveman": 28,
    "steno": 24,
    "cavemanReduction": 44,
    "stenoReduction": 52,
    "stenoBeatsCavemanPct": 86
  },
  "categoryStats": {
    "debugging": {
      "count": 7,
      "avgBaseline": 47,
      "avgCaveman": 24,
      "avgSteno": 19,
      "cavemanReduction": 49,
      "stenoReduction": 60,
      "stenoBeatsCavemanPct": 100,
      "verdict": "steno-favored"
    },
    "code-review": {
      "count": 11,
      "avgBaseline": 45,
      "avgCaveman": 24,
      "avgSteno": 20,
      "cavemanReduction": 47,
      "stenoReduction": 56,
      "stenoBeatsCavemanPct": 91,
      "verdict": "steno-favored"
    },
    "architecture": {
      "count": 8,
      "avgBaseline": 42,
      "avgCaveman": 24,
      "avgSteno": 22,
      "cavemanReduction": 43,
      "stenoReduction": 48,
      "stenoBeatsCavemanPct": 75,
      "verdict": "steno-favored"
    },
    "docs": {
      "count": 6,
      "avgBaseline": 46,
      "avgCaveman": 29,
      "avgSteno": 27,
      "cavemanReduction": 37,
      "stenoReduction": 41,
      "stenoBeatsCavemanPct": 67,
      "verdict": "steno-favored"
    },
    "onboarding": {
      "count": 7,
      "avgBaseline": 61,
      "avgCaveman": 34,
      "avgSteno": 27,
      "cavemanReduction": 44,
      "stenoReduction": 56,
      "stenoBeatsCavemanPct": 100,
      "verdict": "steno-favored"
    },
    "ambiguous": {
      "count": 5,
      "avgBaseline": 56,
      "avgCaveman": 33,
      "avgSteno": 30,
      "cavemanReduction": 41,
      "stenoReduction": 46,
      "stenoBeatsCavemanPct": 80,
      "verdict": "steno-favored"
    },
    "stakeholder": {
      "count": 7,
      "avgBaseline": 58,
      "avgCaveman": 32,
      "avgSteno": 29,
      "cavemanReduction": 45,
      "stenoReduction": 50,
      "stenoBeatsCavemanPct": 86,
      "verdict": "steno-favored"
    }
  },
  "samples": [
    {
      "label": "Bug explanation",
      "category": "debugging",
      "prompt": "Why does this API retry loop never stop?",
      "baseline": "The retry loop never stops because the retry counter is stored inside the request handler, so it resets to zero on every new attempt. The terminating condition is therefore never reached, and the code keeps retrying indefinitely. Move the counter to state that survives across attempts.",
      "caveman": "Retry counter stored inside request handler. Each retry resets counter to zero. Terminal condition never hit. Move counter to state that survives retries.",
      "steno": "Retry ctr lives inside req handler -> resets each attempt -> no terminal hit. Persist ctr across attempts.",
      "tokens": {
        "baseline": 52,
        "caveman": 27,
        "steno": 20,
        "cavemanReduction": 48,
        "stenoReduction": 62,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Race condition",
      "category": "debugging",
      "prompt": "Why does this test fail intermittently?",
      "baseline": "The test fails intermittently because the async operation completes at different times depending on system load. When it completes before the assertion runs, the test passes. When it completes after, the assertion sees stale state. Add an await or use a test helper that waits for the expected state.",
      "caveman": "Async op completes at different times. Sometimes before assertion, sometimes after. Stale state when slow. Add await or wait helper.",
      "steno": "Async timing varies w/ load -> assertion hits stale state when op slow. await or use wait helper.",
      "tokens": {
        "baseline": 56,
        "caveman": 26,
        "steno": 21,
        "cavemanReduction": 54,
        "stenoReduction": 63,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Memory leak",
      "category": "debugging",
      "prompt": "Why does memory usage grow over time?",
      "baseline": "Memory usage grows because event listeners are added on each render but never removed. The old listeners hold references to stale closures, preventing garbage collection. Return a cleanup function that removes the listener.",
      "caveman": "Event listeners added each render. Never removed. Old listeners hold stale closures. GC blocked. Return cleanup function.",
      "steno": "Listeners added per render, never removed -> stale closure refs block GC. Return cleanup fn.",
      "tokens": {
        "baseline": 37,
        "caveman": 22,
        "steno": 18,
        "cavemanReduction": 41,
        "stenoReduction": 51,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Null pointer",
      "category": "debugging",
      "prompt": "Why does this crash with null reference?",
      "baseline": "The crash happens because the optional chain stops at the first null, but the code then calls a method on the result without checking. The optional chain returns undefined, and calling a method on undefined throws. Add another optional chain or guard the call.",
      "caveman": "Optional chain stops at null. Returns undefined. Method called on undefined throws. Add guard or another optional chain.",
      "steno": "Optional chain -> undefined at null, then method call on undefined throws. Guard or extend chain.",
      "tokens": {
        "baseline": 49,
        "caveman": 22,
        "steno": 19,
        "cavemanReduction": 55,
        "stenoReduction": 61,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Deadlock",
      "category": "debugging",
      "prompt": "Why does this async code hang?",
      "baseline": "The code hangs because two awaits depend on each other. Function A awaits a value that function B produces, but function B awaits a value that function A produces. Neither can proceed. Restructure to break the circular dependency.",
      "caveman": "Two awaits depend on each other. A waits for B, B waits for A. Neither proceeds. Break circular dependency.",
      "steno": "A awaits B, B awaits A -> deadlock. Break circular dep.",
      "tokens": {
        "baseline": 44,
        "caveman": 24,
        "steno": 15,
        "cavemanReduction": 45,
        "stenoReduction": 66,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Off-by-one",
      "category": "debugging",
      "prompt": "Why is the last item missing?",
      "baseline": "The last item is missing because the loop uses a strict less-than comparison with the array length, but the index starts at one instead of zero. That shifts everything by one and excludes the final element. Start the index at zero or use less-than-or-equal.",
      "caveman": "Loop index starts at one. Uses strict less-than. Final element skipped. Start at zero or use less-than-or-equal.",
      "steno": "Index starts at 1 + strict < len -> last elem skipped. Start at 0 or use <=.",
      "tokens": {
        "baseline": 53,
        "caveman": 26,
        "steno": 22,
        "cavemanReduction": 51,
        "stenoReduction": 58,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Infinite loop",
      "category": "debugging",
      "prompt": "Why does this while loop never exit?",
      "baseline": "The while loop never exits because the condition variable is never updated inside the loop body. The initial value stays true forever. Add logic inside the loop to update the condition or add a break statement.",
      "caveman": "Condition variable never updated inside loop. Initial value stays true. Add update logic or break.",
      "steno": "Condition var unchanged in body -> stays true. Update var or add break.",
      "tokens": {
        "baseline": 39,
        "caveman": 18,
        "steno": 15,
        "cavemanReduction": 54,
        "stenoReduction": 62,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "State mutation review",
      "category": "code-review",
      "prompt": "Review this fix for shared-state mutation.",
      "baseline": "The null-input case is handled now, but the function still mutates shared state before returning. That can leak changes into later calls and make the bug intermittent. Clone the object before writing to it.",
      "caveman": "Null input handled. Shared state still mutated before return. Bug can leak into later calls. Clone object before write.",
      "steno": "Null case fixed. Shared state still mutates pre-return -> leaks into later calls. Clone object pre-write.",
      "tokens": {
        "baseline": 40,
        "caveman": 23,
        "steno": 22,
        "cavemanReduction": 43,
        "stenoReduction": 45,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Cache invalidation review",
      "category": "code-review",
      "prompt": "Review this caching change.",
      "baseline": "This change improves cache hit rate, but it also introduces a stale data risk because invalidation only occurs on create and not on update or delete. Add invalidation calls to the update and delete paths.",
      "caveman": "Cache hit rate better. Stale data risk. Invalidation only on create, not update or delete. Add invalidation to those paths.",
      "steno": "Hit rate up, but invalidation only covers create -> stale on update/delete. Add invalidation there.",
      "tokens": {
        "baseline": 40,
        "caveman": 28,
        "steno": 21,
        "cavemanReduction": 30,
        "stenoReduction": 48,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Error handling review",
      "category": "code-review",
      "prompt": "Review this error handling change.",
      "baseline": "The try-catch now logs the error, but it also swallows it silently. Callers have no way to know the operation failed. Either rethrow after logging or return an error result that callers can check.",
      "caveman": "Error logged but swallowed. Callers don't know it failed. Rethrow or return error result.",
      "steno": "Error logged but swallowed -> callers unaware of failure. Rethrow or return err result.",
      "tokens": {
        "baseline": 43,
        "caveman": 20,
        "steno": 18,
        "cavemanReduction": 53,
        "stenoReduction": 58,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "SQL injection review",
      "category": "code-review",
      "prompt": "Review this database query change.",
      "baseline": "The query now filters by user input, but the input is concatenated directly into the SQL string. That opens a SQL injection vulnerability. Use parameterized queries instead of string concatenation.",
      "caveman": "User input concatenated into SQL string. SQL injection risk. Use parameterized queries.",
      "steno": "Input concat'd into SQL -> injection vuln. Use parameterized queries.",
      "tokens": {
        "baseline": 37,
        "caveman": 17,
        "steno": 14,
        "cavemanReduction": 54,
        "stenoReduction": 62,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Performance review",
      "category": "code-review",
      "prompt": "Review this loop optimization.",
      "baseline": "The loop is faster now because it caches the array length, but it also mutates the original array during iteration. That can cause skipped elements or infinite loops depending on what the mutation does. Iterate over a copy or collect mutations separately.",
      "caveman": "Length cached, faster. But mutates original during iteration. Can skip elements or loop forever. Iterate copy or collect mutations.",
      "steno": "Len cached -> faster. But mutates during iter -> skips or infinite. Use copy or collect muts.",
      "tokens": {
        "baseline": 47,
        "caveman": 25,
        "steno": 21,
        "cavemanReduction": 47,
        "stenoReduction": 55,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Type safety review",
      "category": "code-review",
      "prompt": "Review this TypeScript change.",
      "baseline": "The type assertion fixes the immediate error, but it lies to the compiler. If the value is ever actually a different type at runtime, the code will crash downstream with a confusing error. Use a type guard instead of an assertion.",
      "caveman": "Type assertion hides error. Lies to compiler. Will crash if type wrong at runtime. Use type guard.",
      "steno": "Assertion hides err, lies to TS. Runtime mismatch -> confusing crash. Use type guard.",
      "tokens": {
        "baseline": 46,
        "caveman": 21,
        "steno": 18,
        "cavemanReduction": 54,
        "stenoReduction": 61,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Concurrency review",
      "category": "code-review",
      "prompt": "Review this async change.",
      "baseline": "The await is inside the loop now, so requests run sequentially instead of in parallel. That is much slower for independent operations. Use Promise.all to run them concurrently if order does not matter.",
      "caveman": "Await inside loop. Requests run sequentially. Slow for independent ops. Use Promise.all for parallel.",
      "steno": "await in loop -> sequential. Slow for indep ops. Promise.all if order irrelevant.",
      "tokens": {
        "baseline": 39,
        "caveman": 20,
        "steno": 18,
        "cavemanReduction": 49,
        "stenoReduction": 54,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Connection pooling",
      "category": "architecture",
      "prompt": "Explain database connection pooling.",
      "baseline": "Connection pooling keeps a reusable set of open database connections instead of creating and closing a new connection for every request. That reduces handshake overhead, improves latency, and prevents avoidable load spikes under traffic.",
      "caveman": "Pool reuses open database connections. No new connection for every request. Less handshake overhead. Faster under load.",
      "steno": "Pool reuses open DB conns vs per-req open-close. Cuts handshake cost + latency. Better under load.",
      "tokens": {
        "baseline": 39,
        "caveman": 22,
        "steno": 24,
        "cavemanReduction": 44,
        "stenoReduction": 38,
        "stenoBeatsCaveman": false
      }
    },
    {
      "label": "Event sourcing",
      "category": "architecture",
      "prompt": "Explain event sourcing.",
      "baseline": "Event sourcing stores every state change as an immutable event instead of overwriting the current state. You can reconstruct any past state by replaying events, audit changes completely, and add new projections later without migrating data.",
      "caveman": "Store state changes as immutable events. Reconstruct past state by replay. Full audit. Add projections without migration.",
      "steno": "Store changes as immutable events -> replay for past state, full audit, new projections w/o migration.",
      "tokens": {
        "baseline": 42,
        "caveman": 22,
        "steno": 20,
        "cavemanReduction": 48,
        "stenoReduction": 52,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "CQRS",
      "category": "architecture",
      "prompt": "Explain CQRS.",
      "baseline": "CQRS separates the read model from the write model. Commands go to a write-optimized store, and queries go to a read-optimized projection. That lets you scale reads and writes independently and optimize each model for its access pattern.",
      "caveman": "Separate read and write models. Commands to write store. Queries to read projection. Scale independently. Optimize each for its pattern.",
      "steno": "Split read/write models. Cmds -> write store, queries -> read projection. Scale + optimize each independently.",
      "tokens": {
        "baseline": 47,
        "caveman": 25,
        "steno": 22,
        "cavemanReduction": 47,
        "stenoReduction": 53,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Saga pattern",
      "category": "architecture",
      "prompt": "Explain the saga pattern.",
      "baseline": "A saga coordinates a distributed transaction across multiple services using a sequence of local transactions. If one step fails, compensating transactions undo the previous steps. That avoids distributed locks while maintaining eventual consistency.",
      "caveman": "Saga coordinates distributed transaction. Sequence of local transactions. Failure triggers compensating transactions. No distributed locks. Eventual consistency.",
      "steno": "Saga = local txns across services. Failure -> compensating txns undo prior steps. No dist locks, eventual consistency.",
      "tokens": {
        "baseline": 38,
        "caveman": 24,
        "steno": 25,
        "cavemanReduction": 37,
        "stenoReduction": 34,
        "stenoBeatsCaveman": false
      }
    },
    {
      "label": "Circuit breaker",
      "category": "architecture",
      "prompt": "Explain circuit breaker pattern.",
      "baseline": "A circuit breaker monitors failures to an external service. After too many failures, it opens and rejects requests immediately without calling the service. That prevents cascading failures and gives the service time to recover.",
      "caveman": "Monitor failures to external service. Too many failures, circuit opens. Rejects requests without calling. Prevents cascade. Gives recovery time.",
      "steno": "Monitors failures. Too many -> opens, rejects w/o call. Prevents cascade + allows recovery.",
      "tokens": {
        "baseline": 38,
        "caveman": 27,
        "steno": 21,
        "cavemanReduction": 29,
        "stenoReduction": 45,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Sidecar pattern",
      "category": "architecture",
      "prompt": "Explain sidecar pattern.",
      "baseline": "A sidecar is a helper container that runs alongside the main application container. It handles cross-cutting concerns like logging, monitoring, or proxying without modifying the application code. That keeps the main container focused on business logic.",
      "caveman": "Helper container runs alongside main app. Handles logging, monitoring, proxying. No app code changes. Main container stays focused.",
      "steno": "Sidecar container handles cross-cutting (logs, metrics, proxy) w/o app changes. Main stays focused.",
      "tokens": {
        "baseline": 45,
        "caveman": 25,
        "steno": 23,
        "cavemanReduction": 44,
        "stenoReduction": 49,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Backpressure",
      "category": "architecture",
      "prompt": "Explain backpressure.",
      "baseline": "Backpressure is a flow control mechanism where a slow consumer signals the producer to slow down. That prevents the producer from overwhelming the consumer with data it cannot process in time, avoiding memory bloat and dropped messages.",
      "caveman": "Slow consumer signals producer to slow down. Prevents overwhelming. No memory bloat. No dropped messages.",
      "steno": "Slow consumer signals producer -> producer slows. Prevents overwhelm, memory bloat, drops.",
      "tokens": {
        "baseline": 42,
        "caveman": 21,
        "steno": 18,
        "cavemanReduction": 50,
        "stenoReduction": 57,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Worker architecture",
      "category": "architecture",
      "prompt": "Explain the worker architecture.",
      "baseline": "The worker receives jobs from the API, enriches them with configuration from Redis, writes results to PostgreSQL, and emits metrics through OpenTelemetry. That decouples job submission from processing and allows horizontal scaling.",
      "caveman": "Worker gets jobs from API. Reads Redis config. Writes Postgres. Emits telemetry. Decouples submission from processing. Scales horizontally.",
      "steno": "API -> worker -> Redis cfg lookup -> Postgres write -> OTel emit. Decouples + scales.",
      "tokens": {
        "baseline": 42,
        "caveman": 28,
        "steno": 22,
        "cavemanReduction": 33,
        "stenoReduction": 48,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "API response format",
      "category": "docs",
      "prompt": "Document this API response format.",
      "baseline": "The response contains a data field with the requested resource, a meta field with pagination info, and an errors array that is empty on success. Status code 200 means success, 400 means validation error, and 500 means server error.",
      "caveman": "Response has data field with resource, meta with pagination, errors array empty on success. 200 success, 400 validation error, 500 server error.",
      "steno": "Resp: data (resource), meta (pagination), errors (empty on ok). 200 ok, 400 validation, 500 server.",
      "tokens": {
        "baseline": 48,
        "caveman": 31,
        "steno": 28,
        "cavemanReduction": 35,
        "stenoReduction": 42,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Config options",
      "category": "docs",
      "prompt": "Document the configuration options.",
      "baseline": "Set PORT to change the listening port, defaults to 3000. Set LOG_LEVEL to debug, info, warn, or error, defaults to info. Set DATABASE_URL to the PostgreSQL connection string, required with no default.",
      "caveman": "PORT sets listening port, default 3000. LOG_LEVEL debug/info/warn/error, default info. DATABASE_URL Postgres connection string, required.",
      "steno": "PORT: listen port (def 3000). LOG_LEVEL: debug|info|warn|error (def info). DATABASE_URL: Postgres conn (required).",
      "tokens": {
        "baseline": 46,
        "caveman": 30,
        "steno": 33,
        "cavemanReduction": 35,
        "stenoReduction": 28,
        "stenoBeatsCaveman": false
      }
    },
    {
      "label": "Error codes",
      "category": "docs",
      "prompt": "Document the error codes.",
      "baseline": "E001 means invalid input format. E002 means resource not found. E003 means authentication failed. E004 means rate limit exceeded. E005 means internal server error. Include the code in bug reports for faster triage.",
      "caveman": "E001 invalid input. E002 not found. E003 auth failed. E004 rate limited. E005 server error. Include code in bug reports.",
      "steno": "E001 bad input, E002 not found, E003 auth fail, E004 rate limit, E005 server err. Include in bug reports.",
      "tokens": {
        "baseline": 45,
        "caveman": 31,
        "steno": 30,
        "cavemanReduction": 31,
        "stenoReduction": 33,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "CLI usage",
      "category": "docs",
      "prompt": "Document the CLI usage.",
      "baseline": "Run the command with --help to see all options. Use --config to specify a config file path. Use --verbose for detailed output. Use --dry-run to preview changes without applying them. Exit code 0 means success, non-zero means failure.",
      "caveman": "--help shows options. --config sets config path. --verbose for detail. --dry-run previews. Exit 0 success, non-zero failure.",
      "steno": "--help: options. --config: cfg path. --verbose: detail. --dry-run: preview. Exit 0 ok, else fail.",
      "tokens": {
        "baseline": 51,
        "caveman": 30,
        "steno": 30,
        "cavemanReduction": 41,
        "stenoReduction": 41,
        "stenoBeatsCaveman": false
      }
    },
    {
      "label": "Migration guide",
      "category": "docs",
      "prompt": "Document the migration steps.",
      "baseline": "First, back up the database. Then run the migration script with --preview to check for conflicts. Fix any conflicts manually. Run the script again without --preview to apply changes. Finally, verify the new schema matches expectations.",
      "caveman": "Back up database. Run migration with --preview. Fix conflicts. Run without --preview. Verify new schema.",
      "steno": "Backup DB -> migrate --preview -> fix conflicts -> migrate (no flag) -> verify schema.",
      "tokens": {
        "baseline": 45,
        "caveman": 22,
        "steno": 19,
        "cavemanReduction": 51,
        "stenoReduction": 58,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Webhook format",
      "category": "docs",
      "prompt": "Document the webhook payload.",
      "baseline": "The webhook sends a POST request with a JSON body containing event type, timestamp, and payload. The payload structure varies by event type. Include a signature header for verification. Respond with 200 to acknowledge receipt.",
      "caveman": "Webhook sends POST with JSON. Contains event type, timestamp, payload. Payload varies by event. Include signature header. Respond 200 to ack.",
      "steno": "POST JSON: event type, ts, payload (varies). Signature header for verify. 200 to ack.",
      "tokens": {
        "baseline": 42,
        "caveman": 29,
        "steno": 23,
        "cavemanReduction": 31,
        "stenoReduction": 45,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "New dev setup",
      "category": "onboarding",
      "prompt": "How do I set up the dev environment?",
      "baseline": "First, clone the repository and run npm install to install dependencies. Then copy .env.example to .env and fill in the required values. Run docker-compose up to start the database. Finally, run npm run dev to start the development server.",
      "caveman": "Clone repo. npm install. Copy .env.example to .env, fill values. docker-compose up for database. npm run dev for server.",
      "steno": "Clone -> npm i -> cp .env.example .env (fill) -> docker-compose up -> npm run dev.",
      "tokens": {
        "baseline": 49,
        "caveman": 29,
        "steno": 23,
        "cavemanReduction": 41,
        "stenoReduction": 53,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "First PR",
      "category": "onboarding",
      "prompt": "How do I submit my first PR?",
      "baseline": "Create a branch from main with a descriptive name. Make your changes and commit with a conventional commit message. Push the branch and open a pull request. Fill in the PR template and request a review from the team. Address feedback and merge when approved.",
      "caveman": "Branch from main. Make changes. Commit with conventional message. Push. Open PR. Fill template. Request review. Address feedback. Merge when approved.",
      "steno": "Branch from main -> changes -> conventional commit -> push -> PR w/ template -> request review -> address feedback -> merge.",
      "tokens": {
        "baseline": 50,
        "caveman": 30,
        "steno": 24,
        "cavemanReduction": 40,
        "stenoReduction": 52,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Test setup",
      "category": "onboarding",
      "prompt": "How do I run the tests?",
      "baseline": "Install dependencies with npm install if you have not already. Run npm test to execute the full test suite. Use npm test -- --watch for watch mode during development. Run npm run test:coverage to generate a coverage report.",
      "caveman": "npm install first if needed. npm test runs full suite. npm test -- --watch for watch mode. npm run test:coverage for report.",
      "steno": "npm i (if needed) -> npm test (full) | --watch (dev) | test:coverage (report).",
      "tokens": {
        "baseline": 45,
        "caveman": 29,
        "steno": 25,
        "cavemanReduction": 36,
        "stenoReduction": 44,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Deploy process",
      "category": "onboarding",
      "prompt": "How do I deploy to production?",
      "baseline": "Merge your changes to main. The CI pipeline runs tests and builds a Docker image. If tests pass, the image is pushed to the registry. A deployment job then updates the Kubernetes manifests and triggers a rolling update. Monitor the deployment in Grafana.",
      "caveman": "Merge to main. CI runs tests, builds Docker image. Tests pass, image pushed to registry. Deployment updates K8s manifests. Rolling update. Monitor in Grafana.",
      "steno": "Merge main -> CI test + build -> push image -> K8s manifest update -> rolling deploy. Monitor in Grafana.",
      "tokens": {
        "baseline": 50,
        "caveman": 35,
        "steno": 25,
        "cavemanReduction": 30,
        "stenoReduction": 50,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Debug workflow",
      "category": "onboarding",
      "prompt": "How do I debug a failing test?",
      "baseline": "Run the test in isolation with the test name filter. Add console.log statements or use a debugger with the --inspect flag. Check the test output for assertion failures and compare expected versus actual values. Look at recent commits that touched the relevant code.",
      "caveman": "Run test in isolation. Add console.log or use debugger --inspect. Check assertion failures. Compare expected vs actual. Check recent commits.",
      "steno": "Isolate test -> logs or --inspect -> check assertions (expected vs actual) -> review recent commits.",
      "tokens": {
        "baseline": 49,
        "caveman": 27,
        "steno": 21,
        "cavemanReduction": 45,
        "stenoReduction": 57,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Vague bug report",
      "category": "ambiguous",
      "prompt": "It's not working.",
      "baseline": "I need more information to help you. What specific behavior are you seeing? What did you expect to happen instead? Can you share the error message, relevant code, or steps to reproduce? What environment are you running in?",
      "caveman": "Need more info. What behavior? What expected? Error message? Code? Repro steps? Environment?",
      "steno": "Need more info: behavior seen? expected? error msg? code? repro steps? env?",
      "tokens": {
        "baseline": 45,
        "caveman": 21,
        "steno": 19,
        "cavemanReduction": 53,
        "stenoReduction": 58,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "General question",
      "category": "ambiguous",
      "prompt": "Should I use React or Vue?",
      "baseline": "That depends on your context. React has a larger ecosystem and job market. Vue has a gentler learning curve and more opinionated structure. Consider your team's experience, project requirements, and long-term maintenance needs. Both are capable choices for modern web development.",
      "caveman": "Depends on context. React has larger ecosystem and job market. Vue easier to learn, more opinionated. Consider team experience, project needs, maintenance. Both capable.",
      "steno": "Context-dep. React: bigger ecosystem + jobs. Vue: easier, opinionated. Consider team exp, reqs, maintenance. Both viable.",
      "tokens": {
        "baseline": 51,
        "caveman": 33,
        "steno": 30,
        "cavemanReduction": 35,
        "stenoReduction": 41,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Broad request",
      "category": "ambiguous",
      "prompt": "How do I make this faster?",
      "baseline": "I need to see the code and understand the bottleneck first. Are you measuring actual performance or guessing? Profile the code to find where time is spent. Common issues include unnecessary re-renders, unoptimized database queries, missing indexes, or blocking I/O. Share specifics for targeted advice.",
      "caveman": "Need to see code and bottleneck. Are you measuring or guessing? Profile first. Common issues: re-renders, bad queries, missing indexes, blocking I/O. Share specifics.",
      "steno": "Show code + bottleneck. Measuring or guessing? Profile first. Common: re-renders, bad queries, missing idx, blocking I/O. Share specifics.",
      "tokens": {
        "baseline": 58,
        "caveman": 37,
        "steno": 32,
        "cavemanReduction": 36,
        "stenoReduction": 45,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Design decision",
      "category": "ambiguous",
      "prompt": "Is this a good approach?",
      "baseline": "I cannot evaluate the approach without more context. What problem are you solving? What alternatives did you consider? What are the constraints? Share the code or design and explain the tradeoffs you are weighing. Then I can give specific feedback.",
      "caveman": "Need more context. What problem? What alternatives? Constraints? Share code or design. Explain tradeoffs. Then I can give feedback.",
      "steno": "Need context: problem? alternatives? constraints? Share code/design + tradeoffs -> then feedback.",
      "tokens": {
        "baseline": 47,
        "caveman": 27,
        "steno": 19,
        "cavemanReduction": 43,
        "stenoReduction": 60,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Status report",
      "category": "stakeholder",
      "prompt": "What is the project status?",
      "baseline": "The project is on track for the planned release date. Core features are complete and in testing. Two minor bugs remain but have fixes in review. Performance testing starts next week. No blockers currently, but we are monitoring a dependency update that could require migration work.",
      "caveman": "On track for release. Core features done, in testing. Two minor bugs, fixes in review. Perf testing next week. No blockers. Watching dependency update.",
      "steno": "On track. Core done + testing. 2 minor bugs (fixes in review). Perf test next wk. No blockers. Watching dep update.",
      "tokens": {
        "baseline": 52,
        "caveman": 32,
        "steno": 30,
        "cavemanReduction": 38,
        "stenoReduction": 42,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Incident summary",
      "category": "stakeholder",
      "prompt": "What caused the outage?",
      "baseline": "The outage was caused by a database connection pool exhaustion. A recent code change introduced a connection leak that accumulated over several hours. Once the pool was full, new requests failed. We deployed a fix and added monitoring to catch pool exhaustion earlier.",
      "caveman": "Database connection pool exhausted. Recent code change leaked connections. Accumulated over hours. Pool full, requests failed. Fix deployed. Monitoring added.",
      "steno": "DB conn pool exhausted. Code change leaked conns over hrs -> pool full -> requests failed. Fix deployed + monitoring added.",
      "tokens": {
        "baseline": 48,
        "caveman": 29,
        "steno": 25,
        "cavemanReduction": 40,
        "stenoReduction": 48,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Feature explanation",
      "category": "stakeholder",
      "prompt": "What does this feature do?",
      "baseline": "This feature lets users export their data in multiple formats. They can choose CSV for spreadsheets, JSON for developer tools, or PDF for printable reports. Exports run in the background and send a notification when ready. Large exports are available for 24 hours before deletion.",
      "caveman": "Users can export data. CSV for spreadsheets, JSON for dev tools, PDF for print. Runs in background. Notification when ready. Large exports available 24 hours.",
      "steno": "Export data: CSV (sheets), JSON (dev), PDF (print). Background job -> notify on done. Large exports: 24h TTL.",
      "tokens": {
        "baseline": 53,
        "caveman": 33,
        "steno": 31,
        "cavemanReduction": 38,
        "stenoReduction": 42,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Risk assessment",
      "category": "stakeholder",
      "prompt": "What are the risks?",
      "baseline": "The main risks are timeline slippage if the third-party API integration takes longer than estimated, and data migration complexity if legacy records have inconsistent formats. We have mitigation plans for both: a fallback mock API and a validation script that flags inconsistent records for manual review.",
      "caveman": "Risks: timeline slippage if API integration slow, migration complexity if legacy data inconsistent. Mitigations: fallback mock API, validation script for inconsistent records.",
      "steno": "Risks: API integration delay, legacy data inconsistency. Mitigations: mock API fallback, validation script flags bad records.",
      "tokens": {
        "baseline": 52,
        "caveman": 32,
        "steno": 26,
        "cavemanReduction": 38,
        "stenoReduction": 50,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Tradeoff discussion",
      "category": "stakeholder",
      "prompt": "Why did we choose this approach?",
      "baseline": "We chose this approach because it balances implementation speed with long-term maintainability. The alternatives were either too risky for the timeline or would create technical debt that costs more to fix later. This approach ships on time and leaves room for iteration based on user feedback.",
      "caveman": "Balances speed and maintainability. Alternatives too risky or created tech debt. Ships on time. Leaves room for iteration.",
      "steno": "Balances speed + maintainability. Alts: too risky or tech debt. Ships on time w/ room for iteration.",
      "tokens": {
        "baseline": 51,
        "caveman": 23,
        "steno": 24,
        "cavemanReduction": 55,
        "stenoReduction": 53,
        "stenoBeatsCaveman": false
      }
    },
    {
      "label": "Failure case: nuanced explanation",
      "category": "ambiguous",
      "prompt": "Walk me through the tradeoffs of microservices.",
      "baseline": "Microservices offer independent deployment, technology flexibility, and team autonomy. However, they introduce operational complexity, network latency, distributed debugging challenges, and eventual consistency headaches. The tradeoffs favor microservices when you have a large team working on a complex domain that benefits from independent scaling and deployment. They favor a monolith when you have a small team, a well-understood domain, or tight latency requirements.",
      "caveman": "Microservices: independent deploy, tech flexibility, team autonomy. But operational complexity, latency, distributed debugging, eventual consistency. Good for large teams, complex domains, independent scaling. Monolith better for small teams, known domains, tight latency.",
      "steno": "Micro: indep deploy, tech flex, team autonomy. But: ops complexity, latency, dist debug, eventual consistency. Micro favors lg team + complex domain + indep scale. Mono favors sm team + known domain + tight latency.",
      "tokens": {
        "baseline": 80,
        "caveman": 48,
        "steno": 48,
        "cavemanReduction": 40,
        "stenoReduction": 40,
        "stenoBeatsCaveman": false
      }
    },
    {
      "label": "Failure case: teaching concept",
      "category": "onboarding",
      "prompt": "Explain how promises work to a beginner.",
      "baseline": "A promise is like a receipt for a value that is not ready yet. When you order food, you get a receipt immediately, and the food arrives later. In code, you start an async operation and get a promise immediately. When the operation finishes, the promise resolves with the result. You use .then() to run code when the result is ready, or .catch() to handle errors. Modern code uses async/await, which is syntactic sugar that makes promises look synchronous.",
      "caveman": "Promise is receipt for future value. Order food, get receipt now, food later. Start async op, get promise now, resolves later. .then() for result, .catch() for errors. async/await is syntactic sugar.",
      "steno": "Promise = receipt for future val. Async op -> promise now, resolves later. .then() for result, .catch() for err. async/await = sugar.",
      "tokens": {
        "baseline": 98,
        "caveman": 48,
        "steno": 34,
        "cavemanReduction": 51,
        "stenoReduction": 65,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Failure case: empathetic response",
      "category": "stakeholder",
      "prompt": "I'm frustrated with the bugs in production.",
      "baseline": "I understand the frustration. Production bugs are stressful, especially when they affect users. Let me help you prioritize. Which bugs are causing the most user impact right now? We can triage them together, identify quick wins, and create a plan to address the rest systematically. Would it help to set up a bug-fixing sprint?",
      "caveman": "Understand frustration. Production bugs stressful. Which bugs have most user impact? Triage together. Find quick wins. Plan for the rest. Bug-fixing sprint?",
      "steno": "Understood, prod bugs stressful. Which bugs = most user impact? Triage together -> quick wins + systematic plan. Bug sprint?",
      "tokens": {
        "baseline": 66,
        "caveman": 32,
        "steno": 27,
        "cavemanReduction": 52,
        "stenoReduction": 59,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Failure case: step-by-step tutorial",
      "category": "onboarding",
      "prompt": "Walk me through setting up authentication.",
      "baseline": "First, install the authentication library with npm install auth-lib. Then configure the provider in your app's entry point by calling initAuth with your client ID and secret. Create a login page that calls signIn when the user submits credentials. Add a middleware that checks the session on protected routes. Finally, create a logout button that calls signOut and redirects to the home page. Test each step before moving to the next.",
      "caveman": "npm install auth-lib. Configure provider with initAuth(clientId, secret). Create login page calling signIn. Add middleware checking session on protected routes. Create logout button calling signOut. Test each step.",
      "steno": "npm i auth-lib -> initAuth(clientId, secret) -> login page w/ signIn -> session middleware on protected routes -> logout btn w/ signOut. Test each step.",
      "tokens": {
        "baseline": 84,
        "caveman": 41,
        "steno": 37,
        "cavemanReduction": 51,
        "stenoReduction": 56,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Failure case: executive summary",
      "category": "stakeholder",
      "prompt": "Give me the executive summary for the board.",
      "baseline": "We are on track to meet Q3 revenue targets, with growth driven primarily by enterprise customer expansion. The new product launch exceeded initial adoption goals by 15%. Key risks include macroeconomic headwinds affecting SMB renewals and a competitive threat in the mid-market segment. Our mitigation strategy focuses on deepening enterprise relationships and accelerating product differentiation. We request board approval for the proposed infrastructure investment to support projected growth.",
      "caveman": "Q3 revenue on track. Growth from enterprise expansion. New product beat adoption by 15%. Risks: macro affecting SMB, mid-market competition. Mitigation: deepen enterprise, accelerate differentiation. Request approval for infrastructure investment.",
      "steno": "Q3 rev on track. Enterprise expansion drives growth. New product +15% adoption. Risks: macro on SMB, mid-mkt comp. Mitigation: enterprise depth + differentiation. Request infra invest approval.",
      "tokens": {
        "baseline": 81,
        "caveman": 44,
        "steno": 42,
        "cavemanReduction": 46,
        "stenoReduction": 48,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Import sorting",
      "category": "code-review",
      "prompt": "Review this import organization.",
      "baseline": "The imports are organized by type now, which improves scanability. However, the relative imports should come after the external packages, not before. Also, consider grouping the React imports separately from other external packages since they are conceptually different.",
      "caveman": "Imports organized by type. Good. Relative imports should come after external packages. Group React imports separately.",
      "steno": "Import org by type = good. Move relative imports after external pkgs. Consider separating React imports.",
      "tokens": {
        "baseline": 47,
        "caveman": 20,
        "steno": 20,
        "cavemanReduction": 57,
        "stenoReduction": 57,
        "stenoBeatsCaveman": false
      }
    },
    {
      "label": "Test coverage",
      "category": "code-review",
      "prompt": "Review this test.",
      "baseline": "The test covers the happy path well, but it does not test edge cases like empty input, null values, or error conditions. Add tests for those scenarios. Also, the test name describes what the code does, not what behavior it validates. Rename it to describe the expected outcome.",
      "caveman": "Happy path covered. Missing edge cases: empty input, null, errors. Add those tests. Test name describes code, should describe behavior. Rename.",
      "steno": "Happy path ok. Missing: empty, null, error cases. Test name = code desc -> rename to behavior desc.",
      "tokens": {
        "baseline": 57,
        "caveman": 30,
        "steno": 24,
        "cavemanReduction": 47,
        "stenoReduction": 58,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Variable naming",
      "category": "code-review",
      "prompt": "Review this variable naming.",
      "baseline": "The variable names are too short and do not convey meaning. Names like x, temp, and data force readers to track context. Use descriptive names like userCount, pendingOrders, and responsePayload. The extra characters are worth the clarity gain.",
      "caveman": "Names too short. x, temp, data don't convey meaning. Use userCount, pendingOrders, responsePayload. Extra chars worth the clarity.",
      "steno": "Names too short (x, temp, data). Use descriptive: userCount, pendingOrders, responsePayload. Clarity > brevity.",
      "tokens": {
        "baseline": 49,
        "caveman": 29,
        "steno": 28,
        "cavemanReduction": 41,
        "stenoReduction": 43,
        "stenoBeatsCaveman": true
      }
    },
    {
      "label": "Logging change",
      "category": "code-review",
      "prompt": "Review this logging change.",
      "baseline": "The new logs provide helpful context for debugging, but they include user email addresses in plain text. That violates privacy requirements and could expose PII in log aggregators. Hash or redact the email before logging, or remove it entirely.",
      "caveman": "Logs helpful for debugging. But include plain text emails. Privacy violation. PII exposure in log aggregators. Hash, redact, or remove email.",
      "steno": "Logs helpful, but plain-text emails -> privacy violation + PII exposure. Hash/redact/remove.",
      "tokens": {
        "baseline": 46,
        "caveman": 30,
        "steno": 20,
        "cavemanReduction": 35,
        "stenoReduction": 57,
        "stenoBeatsCaveman": true
      }
    }
  ]
};
