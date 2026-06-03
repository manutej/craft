# Worked example: over-engineered vs. right-sized

The request: *"Add a function that applies a discount code to a cart total."*

---

## ❌ What the AI agent produces (slop: structure the spec never asked for)

```typescript
// discounts/IDiscountStrategy.ts
export interface IDiscountStrategy {
  apply(total: number): number;
}

// discounts/PercentageDiscountStrategy.ts
export class PercentageDiscountStrategy implements IDiscountStrategy {
  constructor(private readonly percent: number) {}
  apply(total: number): number { return total * (1 - this.percent / 100); }
}

// discounts/DiscountStrategyFactory.ts
export class DiscountStrategyFactory {
  private registry = new Map<string, (cfg: any) => IDiscountStrategy>();
  register(type: string, builder: (cfg: any) => IDiscountStrategy) {
    this.registry.set(type, builder);
  }
  create(type: string, cfg: any): IDiscountStrategy {
    const b = this.registry.get(type);
    if (!b) throw new Error(`Unknown discount type: ${type}`);
    return b(cfg);
  }
}

// discounts/DiscountManager.ts
export class DiscountManager {
  constructor(private readonly factory: DiscountStrategyFactory) {}
  applyDiscount(total: number, type: string, cfg: any): number {
    return this.factory.create(type, cfg).apply(total);
  }
}
```

**Why this is slop** (every craft red flag at once):
- An `interface` with **one** implementation → Speculative Generality.
- A `Factory` + registry for a single discount type that doesn't exist yet.
- A `Manager` that's a Pass-Through / Middle Man.
- `cfg: any` — the abstraction skipped the one thing that mattered (validation).
- 4 files, ~40 lines, for a one-line calculation. The diff is ~10× the request.
- Shallow modules: every interface is as complex as what it hides.

It *looks* professional. It is the opposite. Nobody asked for plug-in discount types,
and when a second type is finally needed, the real shape will differ from this guess —
so this is rework waiting to happen, not flexibility.

---

## ✅ Right-sized (what a senior writes)

```typescript
// cart.ts — next to the code that uses it
/** Applies a percentage discount (0–100). Throws on out-of-range codes. */
export function applyDiscount(total: number, percentOff: number): number {
  if (percentOff < 0 || percentOff > 100) {
    throw new RangeError(`percentOff must be 0–100, got ${percentOff}`);
  }
  return total * (1 - percentOff / 100);
}
```

**Why this is right-sized:**
- Solves exactly the request — nothing more.
- Robust where it counts: the **boundary is validated** (the thing the slop version
  skipped). Simple structure, safe edge.
- A pure function → trivially testable without mocks.
- When a second discount type genuinely arrives (2–3 real call sites), *then* you
  extract — and you'll extract the *real* shape, not a guessed one.

---

## The lesson

> The agent added complexity to the **structure** and skipped robustness at the
> **boundary**. The senior did the exact opposite: minimal structure, validated edge.

If a reviewer can delete a layer and lose no behavior, it was never needed. Build for
today; ETC guarantees you can grow it cheaply tomorrow.
