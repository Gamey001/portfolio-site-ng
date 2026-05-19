<script lang="ts">
  import { projects, categories, type Project } from '$lib/data/projects';
  import Reveal from './Reveal.svelte';

  let active: (typeof categories)[number]['id'] = 'all';
  $: filtered = active === 'all' ? projects : projects.filter((p) => p.category === active);

  function onCardMove(e: PointerEvent) {
    const card = e.currentTarget as HTMLElement;
    const r = card.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty('--mx', mx + '%');
    card.style.setProperty('--my', my + '%');
    const tiltX = (my - 50) / 30;
    const tiltY = (mx - 50) / 30;
    card.style.transform = `perspective(900px) rotateX(${-tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;
  }
  function onCardLeave(e: PointerEvent) {
    (e.currentTarget as HTMLElement).style.transform = '';
  }
</script>

<section id="projects" class="section">
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 flex flex-col gap-6 md:col-span-7">
      <Reveal>
        <p class="eyebrow">03 — Selected work</p>
        <h2 class="h-display mt-4 text-[clamp(2.4rem,6vw,4.6rem)]">
          Things I built<br />and shipped.
        </h2>
      </Reveal>
    </div>

    <div class="col-span-12 md:col-span-5 md:flex md:items-end md:justify-end">
      <Reveal delay={0.1}>
        <div class="flex flex-wrap gap-2">
          {#each categories as cat}
            <button
              type="button"
              data-cursor="link"
              on:click={() => (active = cat.id)}
              class="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-all"
              class:border-bone={active === cat.id}
              class:bg-bone={active === cat.id}
              class:text-ink={active === cat.id}
              class:border-white={false}
              style={active === cat.id ? '' : 'border-color: var(--line); color: var(--bone-2);'}
              aria-pressed={active === cat.id}
            >
              {cat.label}
            </button>
          {/each}
        </div>
      </Reveal>
    </div>

    <div class="col-span-12 mt-8 grid grid-cols-12 gap-5">
      {#each filtered as project, i (project.id)}
        <Reveal delay={i * 0.06}>
          <article
            class="project-card group h-full p-7 md:p-9"
            on:pointermove={onCardMove}
            on:pointerleave={onCardLeave}
            style="--accent: {project.accent};"
            data-cursor="magnet"
          >
            <div class="relative z-10 flex h-full flex-col">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="eyebrow mb-3" style="color: {project.accent};">
                    {project.category}
                  </p>
                  <h3 class="h-display text-3xl md:text-4xl">{project.title}</h3>
                  <p class="mt-1 text-sm text-[var(--bone-2)]">{project.tagline}</p>
                </div>
                <span
                  class="grid h-12 w-12 shrink-0 place-items-center rounded-full border transition-transform group-hover:rotate-45"
                  style="border-color: var(--line);"
                  aria-hidden="true"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                    <path d="M7 17L17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </div>

              <p class="mt-6 text-[var(--bone-2)]">{project.description}</p>

              <ul class="mt-6 flex flex-wrap gap-1.5">
                {#each project.stack as tech}
                  <li
                    class="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--bone-2)]"
                    style="border-color: var(--line);"
                  >
                    {tech}
                  </li>
                {/each}
              </ul>

              <div class="mt-auto flex items-center gap-4 pt-8">
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener"
                  data-cursor="link"
                  class="inline-flex items-center gap-1.5 text-sm font-semibold"
                  style="color: {project.accent};"
                >
                  Live site
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                    <path d="M7 17L17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </a>
                {#if project.repo}
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener"
                    data-cursor="link"
                    class="inline-flex items-center gap-1.5 text-sm text-[var(--bone-2)] hover:text-[var(--bone)]"
                  >
                    Repo
                  </a>
                {/if}
              </div>
            </div>
          </article>
        </Reveal>
      {/each}
    </div>
  </div>
</section>

<style>
  /* Each Reveal wraps a project card; make wrappers span columns properly */
  section :global(.reveal) {
    grid-column: span 12 / span 12;
  }
  @media (min-width: 768px) {
    section :global(.reveal) {
      grid-column: span 6 / span 6;
    }
  }
  .project-card {
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease;
  }
</style>
