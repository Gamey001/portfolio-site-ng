<script lang="ts">
  import { onMount } from 'svelte';
  import { prefersReducedMotion } from '$lib/stores/motion';
  import { theme } from '$lib/stores/theme';
  import type * as THREE_TYPES from 'three';

  let heroRoot: HTMLElement;
  let sceneHost: HTMLDivElement;
  let mounted = false;

  onMount(() => {
    mounted = true;

    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE: typeof THREE_TYPES = await import('three');

      const width = () => sceneHost.clientWidth;
      const height = () => sceneHost.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width() / height(), 0.1, 100);
      camera.position.set(0, 0, 7);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width(), height());
      renderer.setClearColor(0x000000, 0);
      sceneHost.appendChild(renderer.domElement);

      // Lighting
      const ambient = new THREE.AmbientLight(0xffffff, 0.55);
      scene.add(ambient);
      const key = new THREE.DirectionalLight(0xffffff, 1.1);
      key.position.set(4, 5, 6);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xa78bfa, 0.9);
      rim.position.set(-6, -2, 2);
      scene.add(rim);
      const accent = new THREE.PointLight(0x7c5cff, 1.2, 18);
      accent.position.set(-2, 2, 4);
      scene.add(accent);

      // Materials
      const accentMat = new THREE.MeshPhysicalMaterial({
        color: 0x7c5cff,
        roughness: 0.18,
        metalness: 0.35,
        clearcoat: 1.0,
        clearcoatRoughness: 0.15,
        sheen: 0.6,
        sheenColor: 0xc4b5fd
      });
      const ivoryMat = new THREE.MeshPhysicalMaterial({
        color: 0xf4f1ea,
        roughness: 0.32,
        metalness: 0.05,
        clearcoat: 0.85
      });
      const violetMat = new THREE.MeshPhysicalMaterial({
        color: 0xc4b5fd,
        roughness: 0.22,
        metalness: 0.4,
        clearcoat: 1.0
      });
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xddd6fe,
        wireframe: true,
        transparent: true,
        opacity: 0.32
      });

      type Drift = {
        mesh: THREE_TYPES.Object3D;
        spin: THREE_TYPES.Vector3;
        float: THREE_TYPES.Vector3;
        base: THREE_TYPES.Vector3;
      };
      const drifts: Drift[] = [];

      // Lead form — icosahedron (hero shape)
      const icoGeo = new THREE.IcosahedronGeometry(1.3, 0);
      const ico = new THREE.Mesh(icoGeo, accentMat);
      ico.position.set(0.2, 0.1, 0);
      scene.add(ico);
      drifts.push({
        mesh: ico,
        spin: new THREE.Vector3(0.12, 0.18, 0.05),
        float: new THREE.Vector3(0.3, 0.35, 0),
        base: ico.position.clone()
      });

      // Wireframe shell around the lead form for depth
      const shellGeo = new THREE.IcosahedronGeometry(1.85, 1);
      const shell = new THREE.Mesh(shellGeo, wireMat);
      shell.position.copy(ico.position);
      scene.add(shell);
      drifts.push({
        mesh: shell,
        spin: new THREE.Vector3(-0.06, -0.09, 0.02),
        float: new THREE.Vector3(0, 0, 0),
        base: shell.position.clone()
      });

      // Torus knot — secondary accent
      const knotGeo = new THREE.TorusKnotGeometry(0.45, 0.14, 110, 16);
      const knot = new THREE.Mesh(knotGeo, ivoryMat);
      knot.position.set(-1.85, -1.1, 0.8);
      scene.add(knot);
      drifts.push({
        mesh: knot,
        spin: new THREE.Vector3(0.22, 0.28, 0.1),
        float: new THREE.Vector3(0.22, 0.18, 0),
        base: knot.position.clone()
      });

      // Floating sphere — small highlight
      const sphereGeo = new THREE.SphereGeometry(0.32, 32, 32);
      const sphere = new THREE.Mesh(sphereGeo, violetMat);
      sphere.position.set(1.75, 1.4, 0.6);
      scene.add(sphere);
      drifts.push({
        mesh: sphere,
        spin: new THREE.Vector3(0, 0.3, 0),
        float: new THREE.Vector3(0.2, 0.3, 0),
        base: sphere.position.clone()
      });

      // Soft capsule — adds layout balance
      const capGeo = new THREE.CapsuleGeometry(0.18, 0.7, 8, 16);
      const cap = new THREE.Mesh(capGeo, ivoryMat);
      cap.position.set(1.7, -1.3, 0.4);
      cap.rotation.z = Math.PI / 4;
      scene.add(cap);
      drifts.push({
        mesh: cap,
        spin: new THREE.Vector3(0.05, 0.12, 0.2),
        float: new THREE.Vector3(0.15, 0.2, 0),
        base: cap.position.clone()
      });

      const target = { x: 0, y: 0 };
      const eased = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        const r = heroRoot.getBoundingClientRect();
        target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        target.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
      };

      const onResize = () => {
        const w = width();
        const h = height();
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);
      window.addEventListener('pointermove', onMove, { passive: true });

      const start = performance.now();
      let raf = 0;
      const draw = () => {
        const t = (performance.now() - start) / 1000;

        eased.x += (target.x - eased.x) * 0.06;
        eased.y += (target.y - eased.y) * 0.06;

        for (const d of drifts) {
          d.mesh.rotation.x += d.spin.x * 0.01;
          d.mesh.rotation.y += d.spin.y * 0.01;
          d.mesh.rotation.z += d.spin.z * 0.01;
          d.mesh.position.x = d.base.x + Math.sin(t * 0.6 + d.base.x) * d.float.x * 0.5 + eased.x * 0.25;
          d.mesh.position.y = d.base.y + Math.cos(t * 0.5 + d.base.y) * d.float.y * 0.5 + eased.y * 0.18;
        }

        camera.position.x = eased.x * 0.4;
        camera.position.y = eased.y * 0.3;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        raf = requestAnimationFrame(draw);
      };

      if (!$prefersReducedMotion) {
        draw();
      } else {
        renderer.render(scene, camera);
      }

      // React to theme changes — keep tones balanced against the bg
      const themeUnsub = theme.subscribe((mode) => {
        if (mode === 'light') {
          accentMat.color.setHex(0x7c3aed);
          ivoryMat.color.setHex(0x1f1235);
          violetMat.color.setHex(0x6d28d9);
          wireMat.color.setHex(0x4c1d95);
          wireMat.opacity = 0.28;
          ambient.intensity = 0.7;
        } else {
          accentMat.color.setHex(0x7c5cff);
          ivoryMat.color.setHex(0xf4f1ea);
          violetMat.color.setHex(0xc4b5fd);
          wireMat.color.setHex(0xddd6fe);
          wireMat.opacity = 0.32;
          ambient.intensity = 0.55;
        }
      });

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('pointermove', onMove);
        themeUnsub();
        renderer.dispose();
        icoGeo.dispose();
        shellGeo.dispose();
        knotGeo.dispose();
        sphereGeo.dispose();
        capGeo.dispose();
        accentMat.dispose();
        ivoryMat.dispose();
        violetMat.dispose();
        wireMat.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      cleanup?.();
    };
  });

  const title = 'full-stack by craft.';
  const words = title.split(' ');
</script>

<section
  bind:this={heroRoot}
  id="main"
  class="hero relative min-h-screen overflow-hidden"
  aria-label="Intro"
>
  <!-- Refined background: aurora mesh + soft grid -->
  <div class="absolute inset-0 z-0" aria-hidden="true">
    <div class="hero-bg absolute inset-0"></div>
    <img
      src="/images/gamaliel-cutout.png"
      alt=""
      class="hero-portrait"
      loading="eager"
      decoding="async"
    />
    <div class="hero-grid absolute inset-0"></div>
    <div class="hero-vignette absolute inset-0"></div>
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
        Gamaliel Dashua · Full-Stack Developer · Nigeria
      </p>

      <h1 class="h-display hero-title text-[clamp(3.4rem,9vw,8.5rem)]">
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
        class="hero-lede mt-8 max-w-xl text-base sm:text-lg"
        style="animation: fadeUp 1s 0.55s cubic-bezier(0.22,1,0.36,1) both;"
      >
        I'm <span class="hero-name">Gamaliel</span> — a full-stack developer with 4+
        years shipping production software. React &amp; TypeScript on the front,
        Java/Spring Boot, Node, and Python on the back. I design APIs, sweat the
        pixels, and care about every frame, focus state, and byte in between.
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
          download="Gamaliel_Dashua_Resume.pdf"
          target="_blank"
          rel="noopener"
          aria-label="Download resume (PDF)"
        >
          Resume
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
            <path d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </div>
    </div>

    <!-- Right column: 3D scene -->
    <div class="col-span-12 flex items-center justify-center lg:col-span-5">
      <div class="scene-frame relative aspect-square w-full max-w-md">
        <!-- Soft glow plate behind the scene -->
        <div class="scene-glow" aria-hidden="true"></div>

        <!-- The actual 3D mount -->
        <div
          bind:this={sceneHost}
          class="scene-host"
          role="img"
          aria-label="Floating geometric scene reacting to your cursor"
        ></div>

        <!-- Editorial badges (no mouse-move prompt) -->
        <span class="scene-badge scene-badge--top">
          <span class="scene-badge-dot"></span> AVAILABLE · 2026
        </span>
        <span class="scene-badge scene-badge--bottom">
          ISSUE №01 · BSc CS · NG
        </span>

        <!-- Corner crop marks -->
        <span class="scene-crop scene-crop--tl" aria-hidden="true"></span>
        <span class="scene-crop scene-crop--tr" aria-hidden="true"></span>
        <span class="scene-crop scene-crop--bl" aria-hidden="true"></span>
        <span class="scene-crop scene-crop--br" aria-hidden="true"></span>
      </div>
    </div>

    <!-- Bottom strip -->
    <div class="col-span-12 mt-auto flex items-end justify-between border-t pt-4" style="border-color: var(--hero-rule);">
      <div class="font-mono text-[11px] uppercase tracking-[0.22em]" style="color: var(--hero-muted);">
        <span class="text-[var(--accent)]">●</span> Open to Any WEB Developer role
      </div>
      <a href="#about" class="font-mono text-[11px] uppercase tracking-[0.22em] hover:opacity-100" style="color: var(--hero-muted);" aria-label="Scroll to next section">
        Scroll ↓
      </a>
    </div>
  </div>
</section>

<style>
  /* Hero owns its own color tokens so it stays balanced in both themes
     without depending on the global ink/bone values. */
  .hero {
    --hero-fg: #f4f1ea;
    --hero-fg-soft: rgba(244, 241, 234, 0.78);
    --hero-muted: rgba(244, 241, 234, 0.55);
    --hero-rule: rgba(244, 241, 234, 0.16);
  }
  :global([data-theme='light']) .hero {
    --hero-fg: #0a0a16;
    --hero-fg-soft: rgba(10, 10, 22, 0.78);
    --hero-muted: rgba(10, 10, 22, 0.58);
    --hero-rule: rgba(10, 10, 22, 0.16);
  }

  /* Modern aurora mesh — dark by default */
  .hero-bg {
    background:
      radial-gradient(60% 70% at 18% 24%, rgba(167, 139, 250, 0.42), transparent 60%),
      radial-gradient(55% 65% at 82% 78%, rgba(124, 58, 237, 0.5), transparent 60%),
      radial-gradient(40% 50% at 68% 22%, rgba(25, 230, 160, 0.18), transparent 70%),
      radial-gradient(70% 90% at 50% 110%, rgba(76, 29, 149, 0.55), transparent 70%),
      linear-gradient(160deg, #0b0617 0%, #1a0b2e 40%, #2d1b69 100%);
  }
  /* Editorial portrait — sits in the background layer, never covers content.
     Slid leftward enough to bring the face fully into view without crowding
     the headline column on the left. */
  .hero-portrait {
    position: absolute;
    bottom: 0;
    left: 38%;
    height: 92%;
    width: auto;
    max-width: 50%;
    object-fit: contain;
    object-position: bottom left;
    opacity: 0.18;
    filter: grayscale(1) contrast(1.05);
    mix-blend-mode: luminosity;
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
    /* Fade only the very top edge (above the head) so the face stays fully
       opaque; soften the right edge so it doesn't fight the 3D scene. */
    mask-image: linear-gradient(to top, black 90%, transparent 100%),
                linear-gradient(to right, black 75%, transparent 100%);
    -webkit-mask-image: linear-gradient(to top, black 90%, transparent 100%),
                        linear-gradient(to right, black 75%, transparent 100%);
    mask-composite: intersect;
    -webkit-mask-composite: source-in;
  }
  :global([data-theme='light']) .hero-portrait {
    opacity: 0.22;
    mix-blend-mode: multiply;
  }
  /* Below lg (1024px) the hero stacks single-column — re-anchor so the photo
     stays visible without crowding the headline or the 3D scene. */
  @media (max-width: 1023px) {
    .hero-portrait {
      left: 22%;
      height: 55%;
      max-width: 70%;
      opacity: 0.12;
    }
  }
  @media (max-width: 640px) {
    .hero-portrait {
      left: 15%;
      height: 48%;
      max-width: 80%;
      opacity: 0.1;
    }
  }

  /* Light-mode aurora — luminous off-white with violet wash */
  :global([data-theme='light']) .hero-bg {
    background:
      radial-gradient(60% 70% at 18% 24%, rgba(196, 181, 253, 0.55), transparent 60%),
      radial-gradient(55% 65% at 82% 78%, rgba(167, 139, 250, 0.45), transparent 60%),
      radial-gradient(40% 50% at 68% 22%, rgba(125, 211, 252, 0.25), transparent 70%),
      radial-gradient(70% 90% at 50% 110%, rgba(124, 58, 237, 0.22), transparent 70%),
      linear-gradient(160deg, #f8f5ff 0%, #efe9ff 45%, #e3d7ff 100%);
  }

  .hero-grid {
    background-image:
      linear-gradient(to right, currentColor 1px, transparent 1px),
      linear-gradient(to bottom, currentColor 1px, transparent 1px);
    background-size: 80px 80px;
    color: rgba(255, 255, 255, 0.05);
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 35%, transparent 80%);
    -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 35%, transparent 80%);
  }
  :global([data-theme='light']) .hero-grid {
    color: rgba(10, 10, 22, 0.06);
  }

  .hero-vignette {
    background: radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.45) 100%);
    pointer-events: none;
  }
  :global([data-theme='light']) .hero-vignette {
    background: radial-gradient(ellipse at center, transparent 60%, rgba(76, 29, 149, 0.12) 100%);
  }

  /* Type contrast — locked to the hero token, not the global */
  .hero-title {
    color: var(--hero-fg);
  }
  .hero-lede {
    color: var(--hero-fg-soft);
  }
  .hero-name {
    color: var(--hero-fg);
    font-weight: 600;
  }

  /* Scene frame */
  .scene-frame {
    isolation: isolate;
  }
  .scene-glow {
    position: absolute;
    inset: 8%;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, rgba(167, 139, 250, 0.55), rgba(124, 58, 237, 0.25) 45%, transparent 70%);
    filter: blur(28px);
    z-index: 0;
  }
  :global([data-theme='light']) .scene-glow {
    background: radial-gradient(circle at 35% 35%, rgba(124, 58, 237, 0.35), rgba(167, 139, 250, 0.2) 45%, transparent 70%);
  }
  .scene-host {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  .scene-host :global(canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }

  /* Crop marks */
  .scene-crop {
    position: absolute;
    z-index: 3;
    width: 18px;
    height: 18px;
    border-style: solid;
    border-width: 0;
    border-color: var(--hero-fg);
    opacity: 0.55;
  }
  .scene-crop--tl { top: 0; left: 0; border-top-width: 1.5px; border-left-width: 1.5px; }
  .scene-crop--tr { top: 0; right: 0; border-top-width: 1.5px; border-right-width: 1.5px; }
  .scene-crop--bl { bottom: 0; left: 0; border-bottom-width: 1.5px; border-left-width: 1.5px; }
  .scene-crop--br { bottom: 0; right: 0; border-bottom-width: 1.5px; border-right-width: 1.5px; }

  /* Badges around the scene */
  .scene-badge {
    position: absolute;
    z-index: 4;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 6px 12px;
    border-radius: 999px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.62rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    backdrop-filter: blur(8px);
    background: rgba(10, 6, 23, 0.65);
    color: #f4f1ea;
    border: 1px solid rgba(255, 255, 255, 0.12);
    white-space: nowrap;
  }
  :global([data-theme='light']) .scene-badge {
    background: rgba(255, 255, 255, 0.78);
    color: #1a0b2e;
    border-color: rgba(10, 10, 22, 0.12);
  }
  .scene-badge--top { top: 14px; left: 14px; }
  .scene-badge--bottom { bottom: 14px; left: 50%; transform: translateX(-50%); }

  .scene-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #19e6a0;
    box-shadow: 0 0 8px #19e6a0;
    animation: heroDotPulse 1.6s ease-in-out infinite;
  }

  @keyframes heroDotPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.55; transform: scale(0.85); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .scene-badge-dot { animation: none; }
  }
</style>
