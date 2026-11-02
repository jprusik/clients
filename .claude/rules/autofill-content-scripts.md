---
paths:
  - "apps/browser/src/autofill/content/**"
  - "apps/browser/src/autofill/fido2/content/**"
  - "apps/browser/src/autofill/notification/**"
  - "apps/browser/src/autofill/overlay/inline-menu/**"
---

# Autofill Content Scripts - Critical Rules

## Scope

These rules apply to all **injected code**: any module reachable from a content script or injected page
entry point (see the autofill entries in `apps/browser/webpack.base.js`), wherever it lives. This
includes shared services outside the directories above, such as the content-side services in
`apps/browser/src/autofill/services/`, when they are imported by an injected entry point.

## Angular Exception

Injected code runs as **content scripts**, not within the Angular application context.

- **DO NOT** use Angular patterns (components, services, dependency injection, RxJS Observable Data Services, Signals, `takeUntilDestroyed()`, `async` pipe, etc.)
- **DO NOT** import Angular modules or dependencies
- The Angular patterns defined in [angular.md](./angular.md) and [angular-components.md](./angular-components.md), and the Observable Data Services pattern in [typescript.md](./typescript.md), do not apply here
- The build enforces this: `AngularCheckPlugin` (`apps/browser/webpack/angular-check.js`) fails the build if `@angular` appears in any non-popup bundle

## Lit Components

- Injected UI uses [Lit](https://lit.dev/), not Angular. Most components live in `content/components/`; Lit is also used in `notification/` and `overlay/inline-menu/`
- Lit components should consume shared concepts (constants, values) from the component library when possible, without introducing Angular or other dependency entanglements

## Vault Data Exposure

- Injected code receives only the cipher properties it needs (for example `InlineMenuCipherData`, `NotificationCipherData`), never a full cipher or cipher view
- Build these projections in the background context; never strip or filter vault data in injected code
- Treat injected contexts as if their defenses will fail; any vault data sent to them is reachable by a hostile page
- Do not widen the user data an injected experience receives without explicit sign-off from feature scoping; if a change would send new or additional user data to the page, stop and flag it rather than implementing it
- See [Keep the injected data footprint small](../../apps/browser/src/autofill/principles.md#keep-the-injected-data-footprint-small)

## Dependencies

- Do not import a third-party package into injected code without flagging it for justification, even if the repo already depends on it
- See [Every dependency is attack surface](../../apps/browser/src/autofill/principles.md#every-dependency-is-attack-surface)

## Browser API Usage

- Content scripts cannot import the `BrowserApi` abstraction required elsewhere in the browser extension
- Direct use of `chrome.*` / `browser.*` APIs (e.g., `chrome.runtime.sendMessage`) is expected here
- This is an exception to the `BrowserApi` rule in the parent `apps/browser/CLAUDE.md`

## Cross-Browser Compatibility

- Ensure injected code is compatible across browser clients, particularly Firefox, Chrome, and Safari
- Use polyfills and vendor-specific implementations where needed

## Memory Management

- Ensure proper teardown of listeners, observers, and other concerns that might linger in memory
- Content scripts do not benefit from Angular's lifecycle hooks — cleanup must be handled manually
