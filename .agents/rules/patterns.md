---
trigger: always_on
---

# Patterns

Split route pages into small, route-local components.

The default assumption in this repo should be:

- `+page.svelte` should stay thin
- page-specific UI should be extracted into `src/routes/<route>/_components`
- repeated or large sections should become separate components
- route-specific helpers like `query.ts`, `queries.ts`, `columns.ts`, and small view models can also live in `_components` when they belong only to that route

Learn from the existing patterns in this repo and continue them instead of building large monolithic page files.

## 1. Main rule

When working on a route, do not keep all UI, state, dialogs, tables, filters, and sections inside `+page.svelte` unless the page is truly tiny.

Prefer:

- page shell in `+page.svelte`
- route-local pieces in `_components`
- shared cross-route components in `$lib/components`

Use `_components` for code splitting even if a page works without it. The goal is maintainability, readability, and easier future edits.

## 2. What belongs in `+page.svelte`

Keep `+page.svelte` focused on:

- route-level composition
- top-level data hookup
- page metadata/head usage when needed
- assembling child components
- very small glue logic

A good page file usually:

- imports route-local components from `./_components`
- wires data into those components
- avoids large blocks of markup
- avoids embedding modal internals, table internals, or long form internals directly

## 3. What belongs in `_components`

Put these in `src/routes/<route>/_components` when they are specific to that route:

- large visual sections
- cards, tables, charts, filters, toolbars
- dialogs, sheets, and modal forms
- empty states and loading states
- row/action menus
- route-specific form components
- route-specific query definitions
- route-specific table column definitions
- route-specific constants and option mappers

If a part of the page has a clear name, it should usually be its own component.

Examples:

- `header.svelte`
- `stats-cards.svelte`
- `filters.svelte`
- `table.svelte`
- `create-modal.svelte`
- `edit-sheet.svelte`
- `query.ts`
- `queries.ts`
- `columns.ts`

## 4. When to split a page

Split page code proactively when any of these are true:

- the page contains multiple visual sections
- one section can be named independently
- markup becomes long or hard to scan
- there is a modal/dialog/sheet inside the page
- there is a table with columns and row actions
- there is a form with several fields
- there are filters, tabs, or view-mode controls
- the page mixes fetching, presentation, and interaction logic in one file
- the page is likely to grow further

Do not wait until the file becomes huge. Split early.

## 5. Component extraction heuristics

As a default:

- one logical section -> one component
- one modal/sheet/dialog -> one component
- one table/list implementation -> one component
- one filter bar / toolbar -> one component
- one complex form -> one component
- one route-specific query module -> one `query.ts` or `queries.ts`

If you can describe a block as “the X part of the page”, that is a good sign it should move to `_components`.

## 6. Route-local first, shared second

Prefer `_components` first for page-specific pieces.

Only move something to `$lib/components` when it is truly reusable across multiple routes and not tightly coupled to one page's data model or wording.

Use this decision rule:

- used only by one route -> `src/routes/<route>/_components`
- reused across routes/features -> `$lib/components`

Do not promote route-specific components into global shared folders too early.

## 7. Recommended page shape

A typical route should look like:

- `src/routes/<route>/+page.svelte`
- `src/routes/<route>/_components/...`

Example structure:

- `+page.svelte`
- `_components/header.svelte`
- `_components/filters.svelte`
- `_components/table.svelte`
- `_components/create-modal.svelte`
- `_components/query.ts`

This keeps route logic close to the route and avoids scattering files across the repo.

## 8. Good pattern

Good pattern:

- `+page.svelte` imports a few route-local components
- `_components` contains named UI building blocks
- queries and route-only helpers live close to the page
- each file has one clear responsibility

Good outcomes:

- easier to read
- easier to edit safely
- easier to test
- easier to make targeted changes
- fewer merge conflicts in giant page files

## 9. Avoid these anti-patterns

Avoid:

- giant `+page.svelte` files with all logic inline
- embedding long dialogs directly inside page markup
- keeping table columns inline when they are substantial
- mixing data fetching, filters, forms, and rendering in one large file
- creating deeply nested anonymous markup sections instead of named components
- moving everything to `$lib/components` even when it is route-specific

## 10. Naming guidance

Use simple descriptive names based on responsibility.

Prefer names like:

- `header.svelte`
- `toolbar.svelte`
- `filters.svelte`
- `list.svelte`
- `table.svelte`
- `stats.svelte`
- `overview.svelte`
- `form.svelte`
- `create-dialog.svelte`
- `edit-dialog.svelte`
- `delete-alert.svelte`

Avoid vague names unless the context is obvious.

## 11. Implementation rule

When generating or refactoring a page:

1. check whether the page has multiple responsibilities
2. create a local `_components` folder if needed
3. move named sections into small route-local components
4. keep `+page.svelte` as the composition layer
5. keep route-specific helpers close to the route
6. only use `$lib/components` for truly shared building blocks

This should be the default behavior, not an exception.

## 12. Summary

For this repo, prefer page code splitting.

The standard pattern is:

- thin `+page.svelte`
- route-local UI in `_components`
- route-local queries/helpers beside those components
- shared reusable primitives in `$lib/components`

When in doubt, split the page into clear components under `_components`.
