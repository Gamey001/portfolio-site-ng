<script lang="ts">
  import { profile } from '$lib/data/skills';
  const year = new Date().getFullYear();
</script>

<footer class="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-14">
  <div class="mx-auto flex max-w-[1480px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
    <div>
      <p class="font-display text-3xl tracking-tight">gd<span class="text-[var(--accent)]">.</span></p>
      <p class="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
        Built with SvelteKit · Canvas · Care
      </p>
    </div>

    <div class="flex flex-col items-start gap-2 text-sm text-[var(--bone-2)] sm:items-end">
      <div class="flex gap-4">
        <a href={profile.github} target="_blank" rel="noopener" data-cursor="link" class="hover:text-bone">GitHub</a>
        <a href={profile.linkedin} target="_blank" rel="noopener" data-cursor="link" class="hover:text-bone">LinkedIn</a>
        <a href="mailto:{profile.email}" data-cursor="link" class="hover:text-bone">Email</a>
      </div>
      <p class="font-mono text-xs text-[var(--muted)]">© {year} Gamaliel Dashua — All frames considered.</p>
    </div>
  </div>
</footer>
