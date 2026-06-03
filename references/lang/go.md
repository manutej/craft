# Language addendum — Go

Apply the universal `craft` rules; these are the Go-specific tells and idioms.

## Boundary validation & errors
- Errors are values: **always** handle them. `if err != nil { return fmt.Errorf("doing
  X: %w", err) }`. Never `_ = err` or ignore a returned error to make the compiler
  quiet — that's the Go form of a swallowed exception.
- Wrap with `%w` to preserve the chain; check with `errors.Is`/`errors.As`. Add
  context at each layer; don't just bubble the bare error.
- Validate inputs at exported-function boundaries; return an error rather than panicking.
  Reserve `panic` for truly unrecoverable programmer errors.

## Purity & side effects
- Keep decision logic in pure functions that take inputs and return outputs; isolate
  I/O. Inject `time.Now`/RNG/clients via interfaces so the core is testable without
  hitting the world.
- Be deliberate about pointer receivers and shared slices/maps — accidental aliasing
  mutates caller state.

## Smells & over-engineering
- "A little copying is better than a little dependency" — but *knowledge* duplication is
  still a DRY violation; copy data, not decisions.
- **Accept interfaces, return structs.** Don't define an interface until there are ≥2
  real implementers — premature interfaces are Speculative Generality in Go.
- Keep interfaces small (1–3 methods). A big interface is a shallow-module smell.
- Reach for the stdlib first (`slices`, `maps`, `strings`, `errors`, `context`).

## Tests
- Table-driven tests with `testing` + subtests. Assert on observable behavior/returned
  values. Use real types; fake only boundaries via small interfaces.
- `go test -race` on anything concurrent — non-negotiable for shared state.

## Supply chain
- Verify a module path exists and is canonical (pkg.go.dev) before `go get`; watch
  typosquatted import paths. Commit `go.sum`; let it pin checksums.
- Secrets via env / secret manager — never literals. `go vet` + `staticcheck` in CI.
