# dga-runner

Reverse-engineering harness for DGA «كود المنصات» template zips. It mounts a
template's `(t|j)sx` source in a Vite app wired to the **real**
`platformscode-new-react` / `@platformscode/core` packages, serves it, and
drives headless Chrome against the OG implementation — screenshots, computed
styles per pseudo-state, and real click/hover interaction, including inside
shadow DOM.

## Setup

```sh
pnpm install   # or npm install
```

## Fetch a template

```sh
node fetch.mjs home            # → zips/home.zip
node fetch.mjs cookiesBanner
```

Known names: `home contact form customer-service feedback service FAQS
sitemap error search eParticipation about content cookiesBanner chatbot
rating hajj-option-1 SaudiFoundingDayTwo NationalDayOptionOne`.

## Run + inspect

```sh
node run.mjs zips/home.zip --shot home.png --console

node run.mjs zips/home.zip \
  --states "dga-button >>> .dga-btn" \
  --hover  "dga-button >>> .dga-btn" --shot hover.png \
  --click  "dga-nav-header >>> button" --shot after-click.png

node run.mjs zips/home.zip --width 390 --shot mobile.png

node run.mjs zips/home.zip --eval "dqa('dga-button').length"

node run.mjs zips/home.zip --keep   # leave vite+chrome running for manual poking
```

- Selectors support `>>>` to pierce shadow roots: `host >>> inner`.
- `dq(sel)` / `dqa(sel)` are available inside `--eval` expressions.
- `--states` prints height/padding/font/border/background/color/outline/shadow
  at default, hover, active and focus-visible (via CDP forcePseudoState).
- Imports that climb out of the zip (`../../utils/guid`, shared `../Feedback`)
  are shimmed automatically; unresolved ones are stubbed and logged.

## Ports

Vite on `4390`, Chrome CDP on `9390` — override with `RUNNER_PORT` /
`RUNNER_CDP_PORT`. Chrome path override: `CHROME_PATH`.
