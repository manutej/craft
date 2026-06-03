# Worked example: swallowed error + skipped validation vs. robust boundary

The request: *"Add an endpoint that creates a user from the request body and emails them
a welcome message."*

---

## ❌ What the AI agent produces (the #1 omission pattern)

```python
@app.post("/users")
def create_user(body: dict):
    user = User(
        email=body["email"],            # KeyError if missing; no format check
        name=body["name"],              # trusts arbitrary client input
        role=body.get("role", "admin"), # silently defaults to ADMIN (!)
    )
    db.save(user)
    try:
        send_welcome_email(user.email)
    except Exception:
        pass                            # swallowed — failures vanish
    return {"id": user.id}
```

**Why this is the classic AI failure:**
- **No boundary validation.** `body` is untrusted; a missing `email` throws a raw
  `KeyError` (→ 500), a malformed email sails straight into the DB.
- **A silent insecure default** — unspecified role becomes `admin`. This is exactly the
  kind of security bug Stanford found AI users ship *while feeling safe*.
- **A swallowed exception** — if the email service is down, the failure disappears. No
  log, no retry, no signal. You'll find out from an angry customer.
- It *looks* done and the happy path works in a demo — the trap.

---

## ✅ Robust boundary (what a senior writes)

```python
from pydantic import BaseModel, EmailStr
from enum import Enum
import logging

log = logging.getLogger(__name__)

class Role(str, Enum):
    USER = "user"
    ADMIN = "admin"

class CreateUserRequest(BaseModel):    # the boundary: parse + validate once
    email: EmailStr
    name: str
    role: Role = Role.USER             # safe default, explicit type

@app.post("/users")
def create_user(req: CreateUserRequest):   # framework validates → 422 on bad input
    user = User(email=req.email, name=req.name, role=req.role)
    db.save(user)

    # Welcome email is best-effort, but failures must be visible, not swallowed.
    try:
        send_welcome_email(user.email)
    except EmailServiceError as e:
        log.warning("welcome email failed for user %s: %s", user.id, e)
        enqueue_retry("welcome_email", user.id)   # degrade gracefully, don't pretend
    return {"id": user.id}
```

**Why this is right:**
- **Validated at the edge, once.** Past `CreateUserRequest`, the code trusts its types —
  no defensive sludge in the interior.
- **Safe default**, explicit enum — no accidental admin.
- The email failure is **caught specifically, logged, and retried** — handled
  meaningfully, never silenced. A *known* boundary failure degrades gracefully.
- Bad input returns a clear 422, not a 500 stack trace.

---

## The lesson

> The agent built the happy path and skipped every edge that matters in production:
> validation, safe defaults, and visible failure. The senior made the **boundary**
> trustworthy and left the core simple.

Robustness lives at the seams. Validate where data enters, never swallow a failure, and
design so the dangerous default can't be the easy one.
