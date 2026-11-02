> **Scope:** This document describes the principles that govern autofill and every experience the
> browser extension injects into a host page (credential autofill, the inline menu, page
> notifications, and passkey / FIDO2 handling).
>
> **Audience:** Engineers should weigh their decisions, and code generators should align their
> implementation, against the principles described within this document. The design documents
> listed in the [module README](./README.md) apply these principles to specific surfaces.

# Autofill Principles

Autofill code runs in two places with very different standing. Background and popup code runs in the
extension's own context. Content scripts run inside pages the user visits: on the page's main thread,
against the page's DOM, next to the page's own JavaScript, and in the same place the user's
credentials are filled. Many of the principles below follow from that second position.

These principles describe the standard autofill holds itself to, not a guarantee about the current
experience; existing code does not meet all of them. They exist to gate further drift. An existing
violation is not precedent for a new one, and a change that would move further from a principle should
prompt its proposers and stakeholders to question whether its impact is justified.

## Every dependency is attack surface

Code bundled into a content script is shipped into every page the user visits, and it executes where
decrypted credentials are placed. A dependency there is a supply-chain risk with unusually direct
access to user secrets, so injected code avoids dependencies it does not need.

- **Prefer platform APIs.** Reach for the DOM and Web Extension APIs before a library. A helper that
  is a few lines of local code is preferable to a package that does the same.
- **A package approved for the repo is not approved for injected code.** Adding a dependency to the
  repo has its own organization-level gate; that gate weighs the package for the extension as a whole,
  not for code running in every page. Bringing any third-party package into a content script bundle,
  including one the repo already depends on, needs an explicit justification in the pull request:
  what it provides, why a platform API or local code is insufficient, and what it adds to the bundle. For example, [Lit](https://lit.dev/) is the established choice for injected UI; prefer it over introducing
  another rendering library.
- **Import narrowly from shared libraries.** Content scripts are separate webpack entry points.
  Importing from a shared barrel can pull unrelated code (and its transitive dependencies) into every
  page. Import the specific module, or keep the code local to the content script.

## Keep the injected data footprint small

Injected experiences carry valuable user data from a protected space (the extension) into an
unprotected one (the page). That includes content scripts, injected iframes such as the inline menu
and notification bar, and page scripts. These are encapsulated and employ defense in layers, but exposure should be
limited with a mindset that those layers will fail: any vault data sent into the page's context is treated as data a
hostile page can reach. User data is a liability to be minimized, not an asset or resource to be
leveraged. Injected experiences receive the least user data they need, and only at the moment they need
it.

- **Send projections of data, not full models.** For example, injected components receive only the cipher properties they
  render or act on, never a full cipher or cipher view.
- **Strip data in the background.** Build the projection in the background context before the message
  is sent. Data that reaches the page and is filtered there has already been exposed.
- **Send data when it is needed, not ahead of time.** Prefer sending data in response to the user
  engaging with an experience over pushing it into the page in anticipation of some need. Do not cache vault
  data in injected code longer than the experience that needs it.
- **Widening exposure is a high bar.** Any proposed work that nessecitates sending more or new user data into the page should be scrutinized as a risk vector.
  That scrutiny identifies what data newly reaches the page and what is at risk if a hostile page
  obtains it. The burden is on the proposal to justify the exposure; convenience alone does not meet
  it. Offering wider data exposure as a user opt-in, with the risk clearly explained, is a legitimate way to meet
  the burden, within the limits on what risk users may accept (see
  [Users have different risk tolerances](#users-have-different-risk-tolerances)).
- **Avoid identifying ourselves to the page.** What a page can observe about Bitwarden is exposure
  too, even when no vault data is involved. Stable, Bitwarden-specific markers (element and attribute
  names, globals, message shapes, timing) allow adversarial scripts
  to target Bitwarden experiences. Avoid such markers where possible.
- **Assume an attacker has read the source.** Bitwarden is open source, so any obfuscation of the
  live experience must hold up when the code is fully transparent. A fixed name or pattern that is merely
  unusual is still a marker once it appears in the source. Prefer values generated at runtime and
  behavior that is absent rather than hidden.

## We are guests on the page

The page's performance is not ours to degrade. Content scripts share the main thread with the page, so
any work we do delays the page's rendering, input handling, and layout. Users experience that cost as
the page being slow, and page authors attribute it to the extension.

- **Treat observer callbacks and event handlers as hot paths.** Mutation observer callbacks are
  synchronous and can fire hundreds of times per second on dynamic pages. Keep their work bounded;
  defer, batch, or coalesce anything that scales with the size of the page.
- **Measure before and after.** Use the [content script instrumentation](./content/performance.md) to
  quantify hot-path changes rather than reasoning about their cost. Its
  [design](./content/performance.design.md) describes the operating environment in more detail.
- **Leave the page as we found it.** Do not modify page globals or prototypes, and do not alter the
  page's DOM beyond what an injected experience needs to render.
- **Clean up after ourselves.** Tear down listeners, observers, timers, and injected elements when they
  are no longer needed. Content scripts get no framework lifecycle to do this for them.

## We are delegates of the user's intent

Bitwarden acts on behalf of the user, not the host page. A page may describe itself (its fields,
their purpose, its structure), and autofill uses those descriptions as hints. A page does not get to
control how the user decides to interact with the page. A website that resticts assistive technologies, or only allows mobile devices would be considered user-antagonistic; the same applies to blocking the user's chosen autofill experience.

- **Page signals are hints, not controls.** Attributes such as `autocomplete="off"` inform field
  classification; they are not an opt-out from autofill.
- **The user decides if autofill runs.** Turning autofill off for a site or page is a user perference with many available setting options (e.g. blocked domains), not a page capability.
- **Organizations may decide on behalf of their members.** An organization administers the vault and
  account its members use, so organization policy may set or constrain autofill behavior for those
  members (for example, the default URI match detection, autofill on page load, or the identity
  provider hosts approved for automated login). Policy comes from the organization through Bitwarden,
  never from the host page.
- **Organization authority follows ownership.** Items an organization owns are the organization's;
  items in a user's personal vault are owned by the user, not the organization. Organization policy
  may govern how autofill behaves for a member, but autofill does not give an organization visibility
  into personal vault data it does not own. Event logs, for example, never report personal vault
  ciphers to the organization. Capabilities an organization holds by design over accounts under its
  ownership, such as account recovery, are part of that ownership model and not a violation of it.

## Users have different risk tolerances

Users differ in their security posture and in how much convenience they will trade for it. A setting
that is a reasonable risk for one user is unacceptable for another, so autofill avoids one-size-fits-all
security decisions.

- **Avoid all-or-nothing solutions.** A hard security stance with no user control (a capability that is
  either always on or always off for everyone), or a single global switch that gates a whole capability,
  forces every user into the same trade-off. Prefer controls scoped to where the risk actually lies.
  Responding to HTTP basic authentication prompts, for example, is a per-login setting that carries its
  own risk warning, rather than one switch for every site.
- **Prefer a choice over a fixed behavior** when a trade-off is a matter of risk tolerance rather than
  a clear defect. A default still has to be chosen (see below), but it is a starting point, not the
  only option.
- **Do not remove a user's ability to accept a risk** solely because most users should not. Make the
  risk clear and leave the decision with the user, or with their organization's policy.
- **User choice has limits.** Some dangers are severe enough that Bitwarden will not offer them as an
  option, and granular control over every behavior is not always practical. Granular control remains
  the goal; a coarser or fixed behavior is a trade-off to be justified, not a default.

## Surface risk; do not decide it for the user

Autofill regularly trades security for convenience. When an experience carries a risk trade-off, the
user should be able to (a) understand the level of risk and (b) choose not to take it. Injected
experiences should avoid making risk decisions silently on the user's behalf, in either direction.

- **Default to the lower-risk behavior; let the user opt into the risk.** Autofill on page load is off
  by default, and its setting states that compromised or untrusted websites can exploit it.
- **Explain the risk where the choice is made.** A setting description, an inline warning, or a link
  to help documentation should accompany any choice that changes the user's exposure. The URI match
  detection warning and its "More about match detection" link are an example.
- **When the user is directing an action, warn and let them proceed.** A manual fill into a frame
  hosted by a different domain than the saved login asks the user to confirm, and tells them how to
  avoid the warning in the future. The user, who can see the page, makes the call.
- **When automation would act unattended, refuse rather than take the risk.** An automatic page-load
  fill into an untrusted frame is refused, because there is no user present to accept the risk (see
  [autofill on page load](./autofill.design.md#autofill-on-page-load)).
- **Do not withhold silently.** When a setting or policy prevents an experience, say so and point to
  where it can be changed, as the blocked-site notice does.

## Fail safe; when intent is uncertain, security comes first

When autofill cannot be sure what the user wants, or is missing information it needs to decide, it
chooses the outcome that best protects the user's data. That is "fail safe" rather than "fail closed":
the safest outcome depends on the situation, and simply refusing or switching off is not always it.

- **Uncertain intent resolves toward security.** An automatic page-load fill into an untrusted frame
  is refused, and a reprompt-protected cipher is never surfaced on page load. Without the user
  present to direct the action, there is no intent to weigh against the risk.
- **Missing information resolves toward security.** An event that cannot be tied to a tab, frame, or
  URL cannot target a secure operation. Page-authored attributes such as `data-bwignore` stay
  unhonored if the user's setting for them cannot be read; here the safe outcome is to withhold
  control from the page, not to withhold autofill.
- **Make the safe path the default path.** Safety checks should apply unless deliberately bypassed,
  not only when remembered. Every fill verifies its target is in the foreground by default; the
  single opt-out is reachable only from the orchestrator's own code and is flagged by a lint (see
  [the orchestrator](./orchestrator.design.md#a-credential-fills-only-the-tab-the-user-is-working-in)).
  A new path is then safe unless its author chooses otherwise.

## Hostile pages: out of scope, but not ignored

A page whose own scripts are compromised is generally beyond what autofill can defend against: script
running in the page can read whatever the user types or Bitwarden fills into it, and a compromised
legitimate site is usually indistinguishable from the uncompromised one. Autofill does not claim to
protect credentials from such a page.

Autofill still makes a basic, best-effort attempt to resist hostile pages, provided the defense is
cheap and does not degrade legitimate pages.

- **Fill only where the credential belongs.** Fills are gated on the saved login's URI matching the
  page, and a manual fill into a frame hosted by a different domain requires confirmation (see above).
- **Protect injected UI from manipulation by the page.** Injected UI should resist being disguised,
  obscured, or repositioned to trick the user into a click (clickjacking). The inline menu, for
  example, reverts style and attribute changes the page makes to its iframe and closes itself when the
  page keeps tampering with it.
- **Do not overstate these defenses.** UI copy and documentation should not present best-effort
  protections as guarantees.

## When Bitwarden vouches, Bitwarden is responsible

Some features extend trust on the user's behalf based on data Bitwarden curates rather than data the
user entered. In doing so, Bitwarden takes on responsibility it would not otherwise have.

- **Global equivalent domains** are defaults provided by the Bitwarden server. Treating two domains as
  equivalent lets a credential saved for one be offered on the other, so Bitwarden is responsible for
  the relationship between the listed sites being sound.
- **Fill assist** relies on curated targeting rules and trusts them when assessing some security
  concerns, which implies the targeted pages and fields are what the rules say they are.

Treat curated trust data as security-relevant: changes to it, and to the code that consumes it,
deserve the same scrutiny as changes to fill logic. Make it visible to the user when curated data is
shaping an experience (as the "Autofill is using fill assist on this page" notice does), and give the
user a way to opt out.
