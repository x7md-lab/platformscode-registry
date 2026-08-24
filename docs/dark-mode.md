# الوضع الداكن — dark mode

DGA's design system publishes no dark ramp. It ships light tokens plus a set of
"on-color" foregrounds, and stops there. So the dark theme in this registry is
derived, not copied — and the two references it is derived from are the DGA
platforms that actually shipped one.

Everything below was measured with headless Chrome against the live sites
(`tools/dga-runner` and the CDP probes), not read off a spec. Ratios are WCAG
relative-luminance contrast.

## The two references

| | نفاذ — `iam.gov.sa/sso/nafath` | المساعد — `almusaid.bog.gov.sa` |
| --- | --- | --- |
| stack | Chakra v3 | Angular + PrimeNG + Bootstrap |
| dark switch | `html.dark` + `color-scheme: dark` | `html.dark-mode` + `data-bs-theme="dark"` |
| toggle | `aria-label="Toggle Color Mode"` | `aria-label="Switch to light mode"` |

### Surfaces — the two agree exactly

Both land on the same neutral ramp, which is why this registry uses it verbatim:

| role | hex | source |
| --- | --- | --- |
| page | `#0d121c` | neutral-950 |
| elevated / card | `#1f2a37` | neutral-800 |
| sunken / muted | `#111927` | neutral-900 |
| border | `#384250` | neutral-700 |
| body text | `#f9fafb` | neutral-50 |

نفاذ paints `#0d121c` on 257 elements and `#1f2a37` on 32; المساعد paints
`#1f2a37` on 14 and `#0d121c` on 2. Same palette, different density.

### Brand — the two diverge, and one of them is wrong

This is the part that matters, because it is where the naive port fails.

**Solid brand fills.** Both keep the light-mode 600-step green and put white on
it: `#1b8354` + `#ffffff` = **4.75:1**. نفاذ does this on its primary button,
المساعد on its footer. That clears AA for a button label and preserves brand
identity, so this registry keeps it too — `bg-primary text-primary-foreground`
is unchanged in dark.

**Brand as ink on a dark surface.** نفاذ simply carried the light tokens over,
and the result fails outright:

| painted | ratio | verdict |
| --- | --- | --- |
| `#166a45` on `#1f2a37` — «كيف تتحقق» body text | **2.20:1** | fails AA (needs 4.5) |
| `#1b8354` on `#1f2a37` — «gov.sa» wordmark, 18px/600 | **3.06:1** | fails AA (needs 4.5) |

Its own token layer knows better — Chakra resolves `green.fg` to `#86efac`
(the 300 step) in dark — but the components above were hardcoded past it.

المساعد's PrimeNG layer states the correct rule declaratively:

```
--p-primary-color:          #34d399   /* 400 — the accent */
--p-primary-hover-color:    #6ee7b7   /* 300 */
--p-primary-active-color:   #a7f3d0   /* 200 */
--p-primary-contrast-color: #18181b   /* dark ink on that accent */
```

**Brand-tinted surfaces.** نفاذ's tag is the one brand pairing it gets right,
and it is the pattern worth copying: a 950-step green surface carrying near-white
green ink — `#ecfdf3` on `#053321` = **13.26:1**.

## The rule this registry applies

> A brand colour that is *fill* keeps its light-mode step. A brand colour that is
> *ink*, or a hairline, moves to the light end of the ramp.

That split is expressed as one token, `--primary-accent`:

```css
:root { --primary-accent: #1b8354; }  /* identical to --primary: a no-op in light */
.dark { --primary-accent: #88d8ad; }  /* 300 step — 8.63:1 on the card */
```

Because the light value equals `--primary`, adopting the token changed nothing
in light mode; it only diverges under `.dark`. `text-primary` was replaced by
`text-primary-accent` everywhere the brand is used as ink — links, list markers,
tab labels, step numbers, select ticks, icon glyphs — and on the two hairlines
(the tab indicator and the pagination underline). All three brand palettes carry
it, so الذهبي and الخزامى retint correctly too (`src/brand.ts`).

`#88d8ad` is within rounding distance of نفاذ's own `green.fg` (`#86efac`),
which is the corroboration that this is the intended step and not an invention.

## Small controls go further

DGA's 4.75:1 white-on-green is acceptable for a button label. It is thin for a
14px glyph inside a 20px box, and the fill itself only reaches 3.06:1 against
the `#1f2a37` card — so in dark the box outline barely registers. The checkbox,
radio and switch therefore invert in dark: the fill takes `--primary-accent` and
the mark goes to the page colour, which is exactly المساعد's
`primary.color` / `primary.contrastColor` pairing.

## Measured result

Driven through the real UI — palette picked from the settings sheet, mode from
`prefers-color-scheme` — and read back off computed styles.

| | tick/fill | fill/card | dot/card | thumb/track | worst accent ink |
| --- | --- | --- | --- | --- | --- |
| dark / الأخضر | 11.13 | 8.63 | 8.63 | 11.13 | 8.30 |
| dark / الذهبي | 15.32 | 11.88 | 11.88 | 15.32 | 11.41 |
| dark / الخزامى | 9.41 | 7.30 | 7.30 | 9.41 | 7.01 |
| light / الأخضر | 4.75 | 4.75 | 8.56 | 4.75 | 4.32 |
| light / الذهبي | 2.30 | 2.30 | 5.54 | 2.30 | 5.03 |
| light / الخزامى | 7.43 | 7.43 | 13.67 | 7.43 | 6.75 |

Every dark cell clears AAA (7:1). That was the goal: dark mode is ours to
define, so it is held to the higher bar.

**Light mode is deliberately left on the DGA values**, which is why its numbers
are worse. Two known shortfalls, both inherited rather than introduced:

- الأخضر accent ink reaches 4.32:1 on the `#f3f4f6` muted surface — 4% under
  the 4.5 AA floor. Fixing it means darkening `#1b8354`, i.e. no longer being
  DGA green. Not done.
- الذهبي fills are 2.30:1 (white on `#dba102`). Gold is a low-contrast hue and
  DGA ships it this way; the white foreground here is an explicit product
  decision. Only gold *ink* was corrected, to `#945c01` (5.03:1).
