---
applyTo: '**/*.py'
description: Python-specific craft tells — validation, purity, smells, tests, and supply chain.
---

# Python Craft

Apply universal craft rules; these are the Python-specific tells and idioms.

## Do
- Validate untrusted input at the edge with **pydantic** or explicit dataclass checks; parse into a typed model, don't pass raw dicts inward.
- Catch the specific exception you can handle; re-raise with `raise ... from e` to preserve the chain.
- Raise a precise exception rather than returning `None` to signal failure — `None` propagates silently until `AttributeError` fires far away.
- Define errors out of existence: `dict.get(k, default)`, `collections.defaultdict`, empty-list iteration over None-guards.
- Inject the clock/RNG rather than calling `datetime.now()` / `random()` inline — that's what makes a function testable without `freezegun`.
- Prefer a module of functions or a `@dataclass` over a class hierarchy.
- Use `NewType`, `Enum`, or a small frozen dataclass to kill Primitive Obsession (`UserId`, `Money`, `Email`).
- Use `pytest` + parametrize; assert on return values or observable state.
- Reach for `itertools`, `functools`, `pathlib`, `collections` before adding a dependency.
- Confirm a package exists on PyPI (`pip index versions <pkg>`) before installing; watch for typosquats.
- Secrets via `os.environ` / a secrets manager — never literals in source.

## Red flags
- `except Exception: pass` or bare `except:`.
- `datetime.now()` or `random()` called inline inside business logic.
- Mutable default argument: `def f(x, acc=[])` — use `acc=None` then `acc = acc or []`.
- `AbstractBaseFactoryManager` class hierarchies where a function would do.
- `mock.assert_called()` as the *only* assertion in a test.
- `pip install` of a package name the AI produced without verifying it first.
