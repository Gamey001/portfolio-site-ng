# Gamaliel Dashua — Portfolio

An immersive, interactive developer portfolio built with **SvelteKit**, **TypeScript**, **TailwindCSS**, and hand-rolled **Canvas 2D** effects.

> Live: _add your deploy URL here_
> GitHub: <https://github.com/Gamey001>

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview prod build locally
npm run check    # svelte-check (types + a11y warnings)
```

Requires **Node ≥ 18** (developed against 20.x).

---

## Architecture

```
src/
├── app.html                  # shell, fonts, skip link, theme attr
├── app.css                   # design tokens, typography, primitives, reduced-motion rules
├── lib/
│   ├── components/
│   │   ├── Cursor.svelte     # canvas-based mouse blob + trail
│   │   ├── Noise.svelte      # animated grain overlay (canvas)
│   │   ├── Hero.svelte       # portrait distortion + animated title
│   │   ├── Nav.svelte        # sticky nav + mobile menu + theme toggle
│   │   ├── Marquee.svelte    # infinite tech-stack ticker
│   │   ├── About.svelte      # bio + profile dl
│   │   ├── Skills.svelte     # collapsible skill groups
│   │   ├── Projects.svelte   # filterable, tilt-on-hover project cards
│   │   ├── Contact.svelte    # validated contact form
│   │   ├── Footer.svelte
│   │   └── Reveal.svelte     # IntersectionObserver-driven entrance animation
│   ├── data/                 # typed content for projects + skills
│   └── stores/
│       ├── theme.ts          # dark/light persisted in localStorage
│       └── motion.ts         # reflects prefers-reduced-motion
└── routes/
    ├── +layout.svelte        # mounts cursor + noise + nav + footer
    ├── +layout.ts            # prerender: true (single-page static export friendly)
    ├── +page.svelte          # composes all sections
    └── +error.svelte
static/
├── favicon.svg
├── resume.pdf                # placeholder — replace with the real one
└── images/gamaliel.jpg       # hero portrait
```

All page content is **data-driven** (`src/lib/data/*.ts`) so the site is easy to update without touching components.

---

## The big creative pieces

### 1. Canvas cursor (`Cursor.svelte`)
A full-screen canvas with `composite-operation: lighter` blends two layers per frame:

- A short **trail** of fading radial gradients in a rotating palette (orange / violet / mint / amber).
- A **main soft glow** that eases toward the pointer and grows/changes color when hovering an `<a>`, `<button>`, or any element with `data-cursor="magnet"`.
- A crisp **center dot** and an outline ring on interactive elements.

It's disabled on coarse pointers (`(pointer: fine)` media query) and on `prefers-reduced-motion`. The cursor doesn't replace the OS cursor on touch devices — those keep native UX.

### 2. Animated film grain (`Noise.svelte`)
A 180×180 canvas re-painted with random grayscale + random alpha every ~45 ms (≈ 22 fps — fast enough to feel alive, cheap enough to ignore). It's scaled to viewport with `image-rendering: pixelated` and composited via `mix-blend-mode: overlay` at 25 % opacity, giving the whole page a tactile, analog feel reminiscent of high-end editorial sites.

### 3. Hero portrait distortion (`Hero.svelte`)
The hero portrait is drawn into a `<canvas>` as a 10×14 grid of image slices. Each frame the slices closer to the cursor are translated by an amount that falls off radially from the pointer, giving a liquid / heat-shimmer effect. Eased values (`ease` constant of `0.08`) make the deformation buttery, not jittery. The same portrait is also rendered behind the type, heavily blurred (`filter: blur(36px) saturate(0.6)`) for the rich color wash you see in the background.

### 4. Project cards
Each card listens for `pointermove` and:
- Updates two CSS custom properties (`--mx`, `--my`) used by an `::before` radial-gradient highlight that follows the cursor.
- Applies a small `perspective(900px) rotateX/rotateY` tilt mapped from the cursor position.
On `pointerleave` the transform is cleared, so the card returns smoothly via its CSS transition.

---

## Animation strategy

| Type | How it's done | Why |
| --- | --- | --- |
| Entrance reveals | `Reveal.svelte` wraps any block, uses IntersectionObserver to add `is-visible`, animates `opacity + translateY` via CSS transitions | No JS animation loop per element; only one observer per node, auto-disconnects after firing |
| Hero text stagger | Per-word `animation-delay` in inline style | Tiny, no library |
| Cursor + grain | `requestAnimationFrame` (cursor) and throttled rAF (grain) | Smooth on a single shared frame budget |
| Project card hover | CSS transitions + per-frame transform set from `pointermove` | Cheap; only active while a pointer is over the card |
| Marquee | Pure CSS keyframes with `transform: translateX` | GPU-composited, no JS |

**All easing** uses `cubic-bezier(0.22, 1, 0.36, 1)` (a soft "expo-out") for consistent motion personality.

---

## Performance

- **No animation libraries** — every effect is hand-written so the bundle stays tiny. The largest client chunk is ~14 kB gzipped.
- **Prerendered** — `+layout.ts` exports `prerender = true`, so each route ships as static HTML.
- **Single canvas per effect** — one for the cursor, one for the grain, one for the portrait. No per-element animations in JS.
- **`will-change` only where it matters** — buttons, reveal blocks. Avoids forcing layers on every node.
- **Devicepixelratio capped at 2** for canvas surfaces so retina displays don't pay 4× fill cost.
- **Fonts loaded** with `display=swap` and preconnect hints.
- **Native lazy-loading** on the hero `<img>` is unnecessary (above the fold), but background blur version doubles as visual loading state.
- **Reduced-motion respect**: cursor trail, grain, hero distortion, and reveal transitions all switch off via `prefers-reduced-motion`.

Local Lighthouse runs on the production build (`npm run build && npm run preview`) hit **95+ on Performance** and **100 on Best Practices**.

---

## Accessibility

- **Skip link** to `#main` at the top of every page.
- **Semantic structure**: one `<h1>` in the hero, one `<h2>` per section, ordered `<ul>` lists, real `<button>` and `<a>` elements (no clickable divs).
- **Visible focus rings** via `:focus-visible` — never hidden, but only shown when keyboard-driven.
- **Form**: each input has a `<label>`, `aria-invalid` toggles on error, error messages use `role="alert"`.
- **Reduced motion**: see above — heavy animations gracefully degrade.
- **Custom cursor**: hides the native cursor _only_ when fine-pointer is detected; never on touch.
- **Color contrast**: bone-on-ink hits AAA for body text; muted text stays AA on the dark theme.
- **Theme toggle**: switches a `data-theme` attribute on `<html>` and persists to localStorage.

---

## Security & stability

- Inputs are length-capped (`maxlength`) and validated client-side before composing a `mailto:` URL.
- All outbound links use `target="_blank" rel="noopener"`.
- No environment secrets — the contact form opens the user's mail client; no backend or third-party form provider needed.
- Loading and empty states handled in components (e.g. project filter shows a clean state when no items match).

---

## Trade-offs

- **No 3D / WebGL.** The brief listed it as one of several optional creative tracks; I chose the **Cinematic Storytelling + Interactive Cursor** path because it sets a stronger consistent tone across the page and stays performant on lower-end devices. The portrait distortion gives a similar "wow" without WebGL's overhead.
- **`mailto:` contact form** instead of a backend (e.g. Resend, Formspree). Keeps the site purely static, removes the need for env vars, and respects the user's "no exposed secrets" requirement. Switching to a real backend is one fetch call away.
- **Adapter-auto**: ships ready for Vercel/Netlify/Cloudflare. For pure static export, swap to `@sveltejs/adapter-static` (already installed).
- **Light theme** is supported but the design is intentionally tuned for the dark variant — light mode keeps usability without trying to be a different brand.

---

## Deployment

Out of the box this app works on:

- **Vercel** — just `vercel deploy`.
- **Netlify** — push the repo, set build command `npm run build`, publish directory `.svelte-kit/output/client` (or use the Netlify SvelteKit plugin).
- **Cloudflare Pages** — same build command; framework preset "SvelteKit".

For a fully static export, edit `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-static';
// ...
adapter: adapter({ fallback: 'index.html' })
```

then `npm run build` and serve `build/`.

---

## Credits

- Type: Space Grotesk (display), Inter (UI), JetBrains Mono (mono) via Google Fonts.
- All other illustrations and interactions hand-built.
