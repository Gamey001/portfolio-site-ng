<script lang="ts">
  import { skillGroups } from '$lib/data/skills';
  import Reveal from './Reveal.svelte';
</script>

<section id="work" class="section">
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 lg:col-span-4">
      <Reveal>
        <p class="eyebrow mb-6">02 — Capabilities</p>
        <h2 class="h-display text-[clamp(2.4rem,6vw,4.4rem)]">
          What I bring<br />to the kit.
        </h2>
        <p class="mt-6 max-w-sm text-[var(--bone-2)]">
          Years of building production interfaces — from React/TypeScript on the front
          to Java/Spring Boot, Node, and MongoDB on the back. Comfortable across the stack,
          most at home in the browser.
        </p>
      </Reveal>
    </div>

    <div class="col-span-12 lg:col-span-7 lg:col-start-6">
      <div class="space-y-3">
        {#each skillGroups as group, gi}
          <Reveal delay={0.05 * gi}>
            <details
              class="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 open:bg-white/[0.04]"
              open={gi === 0}
            >
              <summary
                class="flex cursor-pointer list-none items-center justify-between"
                data-cursor="link"
              >
                <span class="font-display text-2xl">{group.heading}</span>
                <span class="font-mono text-xs text-[var(--muted)]">
                  {group.items.length.toString().padStart(2, '0')}
                </span>
              </summary>
              <ul class="mt-5 flex flex-wrap gap-2">
                {#each group.items as item}
                  <li
                    class="rounded-full border border-white/10 bg-black/30 px-3.5 py-1.5 text-sm text-[var(--bone-2)] transition-colors hover:border-[var(--accent)] hover:text-bone"
                  >
                    {item}
                  </li>
                {/each}
              </ul>
            </details>
          </Reveal>
        {/each}
      </div>
    </div>
  </div>
</section>
