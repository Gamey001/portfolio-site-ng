<script lang="ts">
  import { page } from '$app/stores';
</script>

<section class="grid min-h-screen place-items-center px-6 text-center">
  <div>
    <p class="eyebrow">Error · {$page.status}</p>
    <h1 class="h-display mt-4 text-6xl">
      Lost in the<br /><span class="text-[var(--accent)]">grain.</span>
    </h1>
    <p class="mx-auto mt-6 max-w-md text-[var(--bone-2)]">
      {$page.error?.message ?? 'Something went sideways.'}
    </p>
    <a href="/" class="btn mt-8" data-cursor="magnet">Back home</a>
  </div>
</section>
