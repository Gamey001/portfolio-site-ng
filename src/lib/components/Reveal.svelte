<script lang="ts">
  import { onMount } from 'svelte';
  export let delay = 0;
  export let y = 28;

  let el: HTMLElement;
  let visible = false;

  onMount(() => {
    if (!('IntersectionObserver' in window)) {
      visible = true;
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            visible = true;
            io.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  });
</script>

<div
  bind:this={el}
  style="--delay: {delay}s; --y: {y}px;"
  class="reveal"
  class:is-visible={visible}
>
  <slot />
</div>

<style>
  .reveal {
    opacity: 0;
    transform: translateY(var(--y));
    transition: opacity 0.9s var(--delay) cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.9s var(--delay) cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, opacity;
  }
  .reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  @media (prefers-reduced-motion: reduce) {
    .reveal {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
