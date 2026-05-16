<script lang="ts">
  import { onMount } from 'svelte';
  import { prefersReducedMotion } from '$lib/stores/motion';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    if (typeof window === 'undefined') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let last = 0;
    const size = 180; // small tile, scaled up via CSS for grain
    canvas.width = size;
    canvas.height = size;

    const draw = () => {
      const img = ctx.createImageData(size, size);
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 32 + ((Math.random() * 60) | 0);
      }
      ctx.putImageData(img, 0, 0);
    };

    const tick = (t: number) => {
      // throttle to ~22fps for a stable but lively grain
      if (t - last > 45) {
        draw();
        last = t;
      }
      raf = requestAnimationFrame(tick);
    };

    draw();
    if (!$prefersReducedMotion) raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  });
</script>

<canvas
  bind:this={canvas}
  class="fx-layer fx-noise"
  aria-hidden="true"
  style="width:100vw;height:100vh;image-rendering:pixelated;"
></canvas>
