<script lang="ts">
  import { onMount } from 'svelte';
  import { prefersReducedMotion } from '$lib/stores/motion';

  let heroRoot: HTMLElement;
  let portraitCanvas: HTMLCanvasElement;
  let mounted = false;

  onMount(() => {
    mounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/images/gamaliel-cutout.png';

    let raf = 0;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    const onMove = (e: PointerEvent) => {
      const r = heroRoot.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = (e.clientY - r.top) / r.height;
    };

    img.onload = () => {
      const ctx = portraitCanvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const sizeCanvas = () => {
        const rect = portraitCanvas.getBoundingClientRect();
        portraitCanvas.width = rect.width * dpr;
        portraitCanvas.height = rect.height * dpr;
      };
      sizeCanvas();
      window.addEventListener('resize', sizeCanvas);

      const draw = () => {
        // ease toward target
        mouse.x += (mouse.tx - mouse.x) * 0.08;
        mouse.y += (mouse.ty - mouse.y) * 0.08;

        const w = portraitCanvas.width;
        const h = portraitCanvas.height;
        ctx.clearRect(0, 0, w, h);

        // contain-fit the cutout so the full subject is visible
        const iw = img.width;
        const ih = img.height;
        const scale = Math.min(w / iw, h / ih) * 1.05; // slight upscale for presence
        const dw = iw * scale;
        const dh = ih * scale;
        const ox = (w - dw) / 2;
        const oy = (h - dh) / 2 + h * 0.04; // anchor slightly lower

        // grid slice displacement toward cursor (kept gentle so the subject reads cleanly)
        const cols = 10;
        const rows = 14;
        const dx = (mouse.x - 0.5) * 22 * dpr;
        const dy = (mouse.y - 0.5) * 22 * dpr;

        const cellW = dw / cols;
        const cellH = dh / rows;
        const sCellW = iw / cols;
        const sCellH = ih / rows;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const cx = (c + 0.5) / cols;
            const cy = (r + 0.5) / rows;
            const dist = Math.hypot(cx - mouse.x, cy - mouse.y);
            const falloff = Math.max(0, 1 - dist * 1.6);
            const offX = dx * falloff;
            const offY = dy * falloff;
            ctx.drawImage(
              img,
              c * sCellW,
              r * sCellH,
              sCellW,
              sCellH,
              ox + c * cellW + offX,
              oy + r * cellH + offY,
              cellW + 1,
              cellH + 1
            );
          }
        }

        raf = requestAnimationFrame(draw);
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      if (!$prefersReducedMotion) {
        draw();
      } else {
        // single static draw — contain-fit for parity with animated path
        const iw = img.width;
        const ih = img.height;
        const scale = Math.min(portraitCanvas.width / iw, portraitCanvas.height / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        ctx.drawImage(img, 0, 0, iw, ih, (portraitCanvas.width - dw) / 2, (portraitCanvas.height - dh) / 2, dw, dh);
      }
    };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  });

  // simple title splitter for staggered reveal
  const title = 'engineer of interfaces.';
  const words = title.split(' ');
</script>

<section
  bind:this={heroRoot}
  id="main"
  class="relative min-h-screen overflow-hidden vignette"
  aria-label="Intro"
>
  <!-- Clean gradient mesh background (no busy photo) -->
  <div class="absolute inset-0 z-0" aria-hidden="true">
    <div
      class="absolute inset-0"
      style="background:
        radial-gradient(60% 80% at 20% 30%, rgba(124,92,255,0.22), transparent 65%),
        radial-gradient(50% 70% at 80% 70%, rgba(255,77,46,0.18), transparent 65%),
        radial-gradient(45% 60% at 60% 20%, rgba(25,230,160,0.10), transparent 65%),
        linear-gradient(180deg, #0a0a0a 0%, #0c0a14 55%, #050505 100%);"
    ></div>
    <!-- Faint vertical rule grid to add structure without noise -->
    <div
      class="absolute inset-0 opacity-[0.06]"
      style="background-image: linear-gradient(to right, #fff 1px, transparent 1px); background-size: 8.333% 100%;"
    ></div>
  </div>

  <!-- Foreground content grid -->
  <div class="relative z-10 mx-auto grid min-h-screen max-w-[1480px] grid-cols-12 gap-6 px-5 pb-16 pt-28 sm:px-8 md:pt-36 lg:px-14">
    <!-- Left column: type + meta -->
    <div class="col-span-12 flex flex-col justify-end lg:col-span-7">
      <p
        class="eyebrow mb-6"
        class:opacity-0={!mounted}
        style="animation: fadeUp 0.7s 0.05s cubic-bezier(0.22,1,0.36,1) both;"
      >
        Gamaliel Dashua · Frontend Engineer · Nigeria
      </p>

      <h1 class="h-display text-[clamp(3.4rem,9vw,8.5rem)]">
        {#each words as word, wi}
          <span class="mr-[0.18em] inline-block overflow-hidden align-top">
            <span
              class="inline-block"
              style="animation: fadeUp 1s {0.1 + wi * 0.12}s cubic-bezier(0.22,1,0.36,1) both;"
            >
              {word}
              {#if wi === words.length - 1}
                <span class="inline-block translate-y-2 text-[var(--accent)]">·</span>
              {/if}
            </span>
          </span>
        {/each}
      </h1>

      <p
        class="mt-8 max-w-xl text-base text-[var(--bone-2)] sm:text-lg"
        style="animation: fadeUp 1s 0.55s cubic-bezier(0.22,1,0.36,1) both;"
      >
        I'm <span class="text-bone">Gamaliel</span> — I build immersive, performant
        web experiences. From end-to-end encrypted messaging to offline-first dashboards,
        I care about every frame, every focus state, every byte.
      </p>

      <div
        class="mt-10 flex flex-wrap items-center gap-3"
        style="animation: fadeUp 1s 0.7s cubic-bezier(0.22,1,0.36,1) both;"
      >
        <a class="btn" data-cursor="magnet" href="#projects">
          See the work
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
            <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
        <a class="btn btn--ghost" data-cursor="magnet" href="#contact">Get in touch</a>
        <a
          class="btn btn--ghost"
          data-cursor="magnet"
          href="/resume.pdf"
          download
          aria-label="Download resume (PDF)"
        >
          Resume
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
            <path d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </div>
    </div>

    <!-- Right column: editorial poster portrait -->
    <div class="col-span-12 flex items-end justify-center lg:col-span-5">
      <div class="poster relative aspect-[3/4] w-full max-w-md" data-cursor="magnet">
        <!-- Color panel (the "paper") with grain + radial sheen -->
        <div class="poster__paper" aria-hidden="true">
          <div class="poster__sheen"></div>
          <div class="poster__grain"></div>
        </div>

        <!-- Giant monogram behind the subject -->
        <div class="poster__monogram" aria-hidden="true">G</div>

        <!-- Diagonal label strip behind subject's shoulder -->
        <div class="poster__strip" aria-hidden="true">
          FRONTEND · ENGINEER · FRONTEND · ENGINEER ·
        </div>

        <!-- Corner crop marks -->
        <span class="poster__crop poster__crop--tl" aria-hidden="true"></span>
        <span class="poster__crop poster__crop--tr" aria-hidden="true"></span>
        <span class="poster__crop poster__crop--bl" aria-hidden="true"></span>
        <span class="poster__crop poster__crop--br" aria-hidden="true"></span>

        <!-- Subject -->
        <canvas
          bind:this={portraitCanvas}
          class="portrait-canvas relative z-10 h-full w-full"
          aria-label="Portrait of Gamaliel Dashua. Moves with your cursor."
        ></canvas>

        <!-- Floor shadow under subject -->
        <div class="poster__floor" aria-hidden="true"></div>

        <!-- Editorial badges -->
        <span class="poster__badge poster__badge--top">
          <span class="poster__badge-dot"></span> AVAILABLE · 2026
        </span>
        <span class="poster__badge poster__badge--right">
          ISSUE №01 — GAMALIEL DASHUA · BSc CS · NG
        </span>
        <span class="poster__badge poster__badge--bottom">
          MOVE · YOUR · MOUSE
        </span>
      </div>
    </div>

    <!-- Bottom strip -->
    <div class="col-span-12 mt-auto flex items-end justify-between border-t border-white/10 pt-4">
      <div class="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
        <span class="text-[var(--accent)]">●</span> Open to senior frontend roles
      </div>
      <a href="#about" class="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 hover:text-white" aria-label="Scroll to next section">
        Scroll ↓
      </a>
    </div>
  </div>
</section>

<style>
  .poster {
    isolation: isolate;
    overflow: hidden;
    border-radius: 18px;
    box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.65),
      0 0 0 1px rgba(255, 255, 255, 0.06);
  }

  /* Solid color "paper" — warm coral panel inspired by editorial print */
  .poster__paper {
    position: absolute;
    inset: 0;
    z-index: 0;
    background:
      radial-gradient(120% 80% at 20% 0%, #ff7a5c 0%, #ff4d2e 45%, #d63a1c 100%);
  }
  .poster__sheen {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(60% 50% at 80% 10%, rgba(255, 255, 255, 0.28), transparent 60%),
      radial-gradient(50% 40% at 10% 90%, rgba(0, 0, 0, 0.22), transparent 60%);
    mix-blend-mode: overlay;
  }
  .poster__grain {
    position: absolute;
    inset: 0;
    opacity: 0.35;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  }

  /* Giant monogram behind the subject */
  .poster__monogram {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: grid;
    place-items: center;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-weight: 700;
    font-size: clamp(18rem, 30vw, 28rem);
    line-height: 0.78;
    color: rgba(255, 255, 255, 0.18);
    letter-spacing: -0.06em;
    transform: translateY(-2%);
    user-select: none;
    pointer-events: none;
  }

  /* Diagonal text strip behind the shoulder */
  .poster__strip {
    position: absolute;
    z-index: 2;
    bottom: 14%;
    left: -10%;
    right: -10%;
    transform: rotate(-7deg);
    background: #0a0a0a;
    color: #f4f1ea;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.7rem;
    letter-spacing: 0.28em;
    padding: 6px 18px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
  }

  /* Subject sits on top with a clean grade */
  .portrait-canvas {
    z-index: 4;
    filter: contrast(1.06) brightness(1.02) saturate(1.05)
      drop-shadow(0 18px 26px rgba(0, 0, 0, 0.55));
    background: transparent;
  }

  /* Floor / plinth shadow */
  .poster__floor {
    position: absolute;
    z-index: 3;
    left: 18%;
    right: 18%;
    bottom: 4%;
    height: 14px;
    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.7), transparent 70%);
    filter: blur(8px);
  }

  /* Corner crop marks for the magazine feel */
  .poster__crop {
    position: absolute;
    z-index: 5;
    width: 18px;
    height: 18px;
    border-color: rgba(255, 255, 255, 0.85);
    border-style: solid;
    border-width: 0;
  }
  .poster__crop--tl {
    top: 10px;
    left: 10px;
    border-top-width: 1.5px;
    border-left-width: 1.5px;
  }
  .poster__crop--tr {
    top: 10px;
    right: 10px;
    border-top-width: 1.5px;
    border-right-width: 1.5px;
  }
  .poster__crop--bl {
    bottom: 10px;
    left: 10px;
    border-bottom-width: 1.5px;
    border-left-width: 1.5px;
  }
  .poster__crop--br {
    bottom: 10px;
    right: 10px;
    border-bottom-width: 1.5px;
    border-right-width: 1.5px;
  }

  /* Editorial badges around the edges */
  .poster__badge {
    position: absolute;
    z-index: 6;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 6px 12px;
    background: rgba(10, 10, 10, 0.78);
    color: #f4f1ea;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.62rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    white-space: nowrap;
  }
  .poster__badge--top {
    top: 22px;
    left: 22px;
    border-radius: 999px;
  }
  .poster__badge--right {
    top: 50%;
    right: -10px;
    transform: rotate(90deg) translateX(-50%);
    transform-origin: right center;
    border-radius: 4px;
  }
  .poster__badge--bottom {
    bottom: 22px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 999px;
  }
  .poster__badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #19e6a0;
    box-shadow: 0 0 8px #19e6a0;
    animation: dotPulse 1.6s ease-in-out infinite;
  }

  @keyframes dotPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.55; transform: scale(0.85); }
  }

  @media (prefers-reduced-motion: reduce) {
    .poster__badge-dot {
      animation: none;
    }
  }
</style>
