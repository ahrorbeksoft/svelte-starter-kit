---
trigger: always_on
---

# Package Management Rules

Use `bun` for package management and project commands in this repo.

## Main rules

- Use `bun install` to install dependencies.
- Use `bun add <package>` or `bun add -D <package>` to add packages.
- Use `bun remove <package>` to remove packages.
- Use `bun run <script>` to run scripts from `package.json`.
- Use `bunx <cli>` for one-off CLI commands.

## Do not use

Avoid using:

- `npm`
- `pnpm`
- `yarn`

Do not suggest commands with those package managers unless the user explicitly asks for them.

## Examples

- `bun install`
- `bun add zod`
- `bun add -D prettier`
- `bun remove zod`
- `bun run dev`
- `bun run check`
- `bunx shadcn-svelte@latest add button`

## Summary

For this repo, default to `bun` for installing packages, removing packages, running scripts, and one-off CLI usage.
