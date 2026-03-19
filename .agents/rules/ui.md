---
trigger: always_on
---

# UI Rules

Use the existing UI system in this repo first.

## Main rules

- Prefer components from `$lib/components/ui`.
- For forms, prefer `$lib/components/form`.
- Keep page-specific UI in route-local `_components`.
- Do not build custom UI from raw HTML/Tailwind if a shared component already exists.

## If a component does not exist

Before creating a new custom component:

1. Check whether this repo already has it in `$lib/components/ui`.
2. If not, check `https://shadcn-svelte.com/llms.txt` for available components and docs.
3. If it exists there, add it with the official `shadcn-svelte` flow instead of reinventing it.
4. Only build a custom component if the repo does not have it and the `llms.txt` index does not provide a good fit.

## shadcn-svelte guidance

This project follows `shadcn-svelte` style patterns.

When adding a missing component, use `https://shadcn-svelte.com/llms.txt` to confirm it exists and follow the linked docs and official CLI flow.

## Styling and patterns

- Reuse existing variants, spacing, and interaction patterns.
- Prefer accessible primitives like shared `Dialog`, `Popover`, `DropdownMenu`, `Button`, `Card`, `Table`, and form fields.
- Keep pages thin and compose small UI pieces.

## Avoid

- custom buttons when shared `Button` exists
- custom dialogs when shared dialog components exist
- manual form wiring when shared form fields exist
- introducing a different UI style from the rest of the repo

## Summary

Default order of choice:

1. existing repo component
2. component listed in `https://shadcn-svelte.com/llms.txt`
3. custom component only if needed
