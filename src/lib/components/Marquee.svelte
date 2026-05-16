<script lang="ts">
  export let items: string[] = [];
</script>

<div class="overflow-hidden border-y border-white/10 bg-black/30 py-6">
  <div class="marquee gap-12 whitespace-nowrap font-display text-2xl tracking-tight sm:text-4xl md:text-6xl">
    {#each [...items, ...items, ...items] as item, i}
      <span class="flex items-center gap-12">
        <span class:opacity-30={i % 2 === 0}>{item}</span>
        <span class="text-[var(--accent)]">●</span>
      </span>
    {/each}
  </div>
</div>
