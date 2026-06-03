---
applyTo: '**/*.go'
description: Go-specific craft tells — error handling, purity, interfaces, tests, and supply chain.
---

# Go Craft

Apply universal craft rules; these are the Go-specific tells and idioms.

## Do
- Errors are values: always handle them. `if err != nil { return fmt.Errorf("doing X: %w", err) }`.
- Wrap with `%w` to preserve the chain; check with `errors.Is` / `errors.As`. Add context at each layer.
- Validate inputs at exported-function boundaries; return an error rather than panicking. Reserve `panic` for truly unrecoverable programmer errors.
- Keep decision logic in pure functions; inject `time.Now`, RNG, and clients via interfaces so the core is testable without hitting the network or clock.
- Be deliberate about pointer receivers and shared slices/maps — accidental aliasing mutates caller state.
- Accept interfaces, return structs. Don't define an interface until there are ≥2 real implementers.
- Keep interfaces small (1–3 methods); a large interface is a shallow-module smell.
- Write table-driven tests with `testing` + subtests; assert on returned values and observable behavior.
- Run `go test -race` on anything with shared state — non-negotiable.
- Reach for `slices`, `maps`, `strings`, `errors`, `context` before adding a dependency.
- Verify module paths on pkg.go.dev before `go get`; commit `go.sum` to pin checksums.
- Secrets via env / secret manager — never literals. Run `go vet` + `staticcheck` in CI.

## Red flags
- `_ = err` or a returned error discarded to silence the compiler.
- An error returned bare with no added context (`return err` across layers).
- `panic` used for normal error conditions rather than truly unrecoverable errors.
- `time.Now()` or `rand.Float64()` called inline inside business logic (not injected).
- An interface defined for a single implementer (Speculative Generality in Go).
- A large interface (5+ methods) where a small one or a struct would do.
- A module path used with `go get` that wasn't verified on pkg.go.dev.
- `go.sum` not committed, leaving dependency checksums unpinned.
