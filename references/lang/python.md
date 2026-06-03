# Language addendum — Python

Apply the universal `craft` rules; these are the Python-specific tells and idioms.

## Boundary validation & errors
- Validate at the edge with **pydantic** / **dataclasses** + explicit checks; don't let
  unvalidated dicts flow inward. Parse, don't validate-and-pass-raw.
- **Never** `except Exception: pass` or bare `except:`. Catch the *specific* exception
  you can handle. Re-raise with `raise ... from e` to preserve the chain.
- Prefer raising a precise exception over returning `None` to signal failure — `None`
  propagates silently until it `AttributeError`s far away.
- "Define errors out of existence": e.g. `dict.get(k, default)`, `collections.defaultdict`,
  empty-list iteration instead of None-guards everywhere.

## Purity & side effects
- Keep pure logic in plain functions; isolate I/O (DB, network, files, `datetime.now`,
  `random`) at the edges. Inject the clock/RNG rather than calling them inline — that's
  what makes a function testable without `freezegun`/mocks.
- Beware the **mutable default argument** trap: `def f(x, acc=[])` shares state across
  calls. Use `acc=None` then `acc = acc or []`.
- Don't mutate caller-owned lists/dicts unless that's the documented contract.

## Smells & over-engineering
- You rarely need a class. A module of functions or a `@dataclass` usually beats a
  class hierarchy. Resist `AbstractBaseFactoryManager`.
- Primitive Obsession fix: `NewType`, `Enum`, small frozen dataclasses for ids/money/units.
- Use the stdlib before reaching for a dependency (`itertools`, `functools`,
  `pathlib`, `collections`). Reinventing these is DRY slop.

## Tests
- `pytest` + parametrize. Assert on **return values / observable state**, not on
  `mock.assert_called` as the *only* assertion (that's tautological).
- Use real objects over mocks where cheap; mock only true boundaries (network).

## Supply chain
- Confirm a package exists on PyPI and matches the import name before `pip install`
  (e.g. `pip index versions <pkg>` / check pypi.org). Watch typosquats.
- Secrets via `os.environ` / a secrets manager — never literals in source.
