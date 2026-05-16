<script lang="ts">
  import { onMount } from 'svelte';
  import { prefersReducedMotion } from '$lib/stores/motion';

  let canvas: HTMLCanvasElement;
  let frame = 0;
  let reduced = false;
  $: reduced = $prefersReducedMotion;

  type Trail = { x: number; y: number; vx: number; vy: number; life: number };

  onMount(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return; // touch devices: skip custom cursor

    document.documentElement.classList.add('has-cursor');
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const palette = ['#ff4d2e', '#7c5cff', '#19e6a0', '#ffb84d'];
    let hue = 0;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const main = { x: target.x, y: target.y };
    const trails: Trail[] = [];
    let hovered: 'default' | 'link' | 'magnet' = 'default';
    let pressing = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as HTMLElement | null;
      const interactive = el?.closest('a, button, [data-cursor]');
      if (interactive) {
        const role = (interactive as HTMLElement).dataset.cursor;
        hovered = role === 'magnet' ? 'magnet' : 'link';
      } else {
        hovered = 'default';
      }
    };
    const onDown = () => (pressing = true);
    const onUp = () => (pressing = false);
    const onLeave = () => (target.x = target.y = -9999);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointerleave', onLeave);

    const tick = () => {
      // near-1:1 follow with a tiny ease so high-frequency jitter still smooths
      main.x += (target.x - main.x) * 0.72;
      main.y += (target.y - main.y) * 0.72;

      // emit trail particle
      if (Math.hypot(target.x - main.x, target.y - main.y) > 0.3) {
        trails.push({
          x: main.x,
          y: main.y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          life: 1
        });
      }
      if (trails.length > 60) trails.splice(0, trails.length - 60);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = 'lighter';

      // trails
      for (let i = trails.length - 1; i >= 0; i--) {
        const t = trails[i];
        t.x += t.vx;
        t.y += t.vy;
        t.life -= 0.022;
        if (t.life <= 0) {
          trails.splice(i, 1);
          continue;
        }
        const colorIndex = (i + Math.floor(hue / 8)) % palette.length;
        const c = palette[colorIndex];
        const r = 14 * t.life + 4;
        const grd = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, r);
        grd.addColorStop(0, hexToRgba(c, 0.55 * t.life));
        grd.addColorStop(1, hexToRgba(c, 0));
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // main soft glow
      const baseR = hovered === 'magnet' ? 48 : hovered === 'link' ? 36 : 26;
      const r = baseR * (pressing ? 0.65 : 1);
      const grad = ctx.createRadialGradient(main.x, main.y, 0, main.x, main.y, r);
      const c1 = palette[Math.floor(hue / 12) % palette.length];
      const c2 = palette[(Math.floor(hue / 12) + 1) % palette.length];
      grad.addColorStop(0, hexToRgba(c1, 0.85));
      grad.addColorStop(0.55, hexToRgba(c2, 0.35));
      grad.addColorStop(1, hexToRgba(c1, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(main.x, main.y, r, 0, Math.PI * 2);
      ctx.fill();

      // crisp center dot
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = hovered === 'default' ? '#f4f1ea' : '#0a0a0a';
      ctx.beginPath();
      ctx.arc(main.x, main.y, hovered === 'default' ? 3 : 5, 0, Math.PI * 2);
      ctx.fill();

      // outline ring when hovering links
      if (hovered !== 'default') {
        ctx.strokeStyle = '#f4f1ea';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(main.x, main.y, r * 0.7, 0, Math.PI * 2);
        ctx.stroke();
      }

      hue = (hue + 1) % 360;
      frame = requestAnimationFrame(tick);
    };

    if (!reduced) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointerleave', onLeave);
      document.documentElement.classList.remove('has-cursor');
    };
  });

  function hexToRgba(hex: string, a: number) {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
</script>

<canvas bind:this={canvas} class="fx-layer fx-cursor" aria-hidden="true"></canvas>
