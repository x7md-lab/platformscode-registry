# platformscode-registry

A custom shadcn registry distributing components in the DGA «كود المنصات» design
language — re-implemented shadcn-style over [Base UI](https://base-ui.com) with
framer-motion, using [HugeIcons](https://hugeicons.com) as the icon set. Tokens
(SA Flag green, gold, IBM Plex Sans Arabic, DGA radii) are extracted from
`@platformscode/core`; no official DGA assets are used. This registry is built
by community contributor X7md.

Items: `platformscode-theme` (cssVars), `button`, `badge`, `card`, `skeleton`,
`accordion`, `drawer`, `reveal`, `use-media-query`, `digital-stamp`, `doc-dialog`.

## Getting Started

Vite + React 19 only — no Next.js.

- The template uses a `registry.json` file to define components and their files.
- The `shadcn build` command is used to build the registry.
- The registry items are served as static files under `public/r/[name].json` (available at `/r/[name].json` in dev and in the production build).
- Every registry item is compatible with the `shadcn` CLI.
- Each demo section has a preview/code switcher (CodeMirror) showing the item's source.

```bash
pnpm install
pnpm registry:build   # compiles registry.json -> public/r/*.json
pnpm dev              # demo page at http://localhost:5173
pnpm build            # static output in dist/ (includes /r/*.json)
```

## Documentation

Visit the [shadcn documentation](https://ui.shadcn.com/docs/registry) to view the full documentation.
