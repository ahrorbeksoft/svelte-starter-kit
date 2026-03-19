---
trigger: always_on
---

# Docs Sync

Keep the agent docs in sync with the codebase whenever you make structural or utility-related changes.

## Main rule

When you change the project structure, add new shared helpers, create utilities, rename utility modules, move files, or introduce new reusable functions, you must also review and update:

- `.agents/rules/project-structure.md`
- `.agents/rules/utils.md`

Do not treat those files as optional follow-up documentation. They are part of the change.

## When to update `project-structure.md`

Update `.agents/rules/project-structure.md` when your change affects how the codebase is organized or where code should live.

Examples:

- adding a new top-level feature area or folder convention
- introducing a new route-local pattern
- moving files to a new shared location
- adding a new category under `src/lib`
- changing where components, hooks, queries, services, or state should live
- establishing a new naming or placement convention
- restructuring feature folders or route folders

If the answer to “where should this kind of code go now?” changes, update `project-structure.md`.

## When to update `utils.md`

Update `.agents/rules/utils.md` when your change affects shared functions, helper modules, or utility conventions.

Examples:

- adding a new utility function or utility module
- creating shared formatters, parsers, mappers, validators, or helpers
- changing the recommended utility patterns
- renaming or removing utility APIs
- adding new reusable helper functions that other features should know about
- changing how existing utilities should be used

If the answer to “what helper exists for this?” or “how should shared utility logic be written?” changes, update `utils.md`.

## Required behavior

Before finishing a task, do a quick docs sync check:

1. Did I add or change shared functions, helpers, or utility modules?
2. Did I add or change folder structure, placement conventions, or architecture patterns?
3. If yes, did I update the relevant docs in `.agents/rules/`?

If the change affects either area, update the docs in the same task.

## Do not skip updates just because

Do not skip these doc updates because:

- the code change seems small
- the helper is “obvious”
- the structure change is local
- the docs are currently minimal
- you expect someone else to document it later

Small changes compound quickly. Keep the rules current.

## Documentation style

When updating these docs:

- describe the new rule or convention clearly
- prefer actionable guidance over vague descriptions
- mention where code should live and why
- include new utility names or categories when useful
- keep examples aligned with the current repo structure
- update existing guidance instead of adding contradictory notes

## Summary

If you change code organization or shared utility logic, you must review and update:

- `.agents/rules/project-structure.md`
- `.agents/rules/utils.md`

This is a default requirement for agent work in this repo.
