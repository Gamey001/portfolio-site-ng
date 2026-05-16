<script lang="ts">
  import { toggleTheme, theme } from '$lib/stores/theme';
  import { onMount } from 'svelte';

  let scrolled = false;
  onMount(() => {
    const onScroll = () => (scrolled = window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  let mobileOpen = false;

  const links = [
    { href: '#about', label: 'About' },
    { href: '#work', label: 'Work' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' }
  ];
</script>

<header
  class="fixed inset-x-0 top-0 z-50 transition-all duration-500"
  class:bg-black={scrolled}
  class:backdrop-blur-md={scrolled}
  class:border-b={scrolled}
  style={scrolled ? 'border-color: var(--line);' : ''}
>
  <nav class="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-4 sm:px-8 lg:px-14">
    <a href="#main" class="flex items-center gap-2" data-cursor="link" aria-label="Home">
      <span class="font-display text-xl font-bold tracking-tight">gd.</span>
      <span class="ml-1 h-1.5 w-1.5 rounded-full bg-[var(--accent)]"></span>
    </a>

    <ul class="hidden items-center gap-1 md:flex">
      {#each links as link}
        <li>
          <a
            href={link.href}
            data-cursor="link"
            class="rounded-full px-4 py-2 text-sm text-[var(--bone-2)] transition-colors hover:text-bone"
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>

    <div class="flex items-center gap-2">
      <button
        type="button"
        class="rounded-full border border-white/15 p-2 text-xs"
        data-cursor="link"
        on:click={toggleTheme}
        aria-label="Toggle color theme"
        title="Toggle theme"
      >
        {#if $theme === 'dark'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke-linecap="round" />
          </svg>
        {:else}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        {/if}
      </button>
      <a class="btn hidden md:inline-flex" data-cursor="magnet" href="#contact">Hire me</a>

      <button
        type="button"
        class="rounded-full border border-white/15 p-2 md:hidden"
        on:click={() => (mobileOpen = !mobileOpen)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          {#if mobileOpen}
            <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
          {:else}
            <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
          {/if}
        </svg>
      </button>
    </div>
  </nav>

  {#if mobileOpen}
    <div
      class="border-t border-white/10 bg-black/95 px-5 pb-6 pt-4 md:hidden"
    >
      <ul class="flex flex-col gap-2">
        {#each links as link}
          <li>
            <a
              href={link.href}
              class="block rounded-xl px-4 py-3 text-base hover:bg-white/5"
              on:click={() => (mobileOpen = false)}
            >
              {link.label}
            </a>
          </li>
        {/each}
        <li>
          <a href="#contact" class="btn mt-2 inline-flex w-full justify-center">Hire me</a>
        </li>
      </ul>
    </div>
  {/if}
</header>
