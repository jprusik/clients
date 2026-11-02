---
paths:
  - "apps/browser/src/autofill/**"
  - "libs/common/src/autofill/**"
---

# Autofill Principles

Before designing, implementing, or reviewing changes in this directory, read
[apps/browser/src/autofill/principles.md](../../apps/browser/src/autofill/principles.md) and align
the work with it. In brief:

- Every dependency in injected code is attack surface; avoid unnecessary ones
- Keep the injected data footprint small: send injected experiences only the vault data they need, when they need it, stripped in the background; avoid Bitwarden-identifying markers on the page, using strategies that hold up even though the source is public
- We are guests on the page; do not degrade its performance
- We represent the user; host pages do not override user (or organization policy) direction, and organization authority follows ownership (no org visibility into personal vault data)
- Users have different risk tolerances; avoid one-size-fits-all security decisions
- Surface risk trade-offs to the user rather than deciding them silently
- Avoid all-or-nothing controls; scope them to where the risk lies
- Fail safe: when user intent or needed information is uncertain, choose the outcome that best protects the user's data; make the safe path the default
- Compromised pages are out of scope, but injected experiences still make a best-effort defense
- When Bitwarden vouches through curated data (equivalent domains, fill assist targeting rules), Bitwarden is responsible for it

The principles are a standard, not a description of the current code; existing code violates some of
them. Do not treat an existing violation as precedent. When a change conflicts with a principle, call
out the trade-off explicitly rather than resolving it silently.
