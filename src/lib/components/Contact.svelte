<script lang="ts">
  import { profile } from '$lib/data/skills';
  import Reveal from './Reveal.svelte';

  let name = '';
  let email = '';
  let message = '';
  let touched = { name: false, email: false, message: false };
  let sent = false;

  $: errors = {
    name: name.trim().length < 2 ? 'Please enter your name.' : '',
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid email.' : '',
    message: message.trim().length < 10 ? 'Tell me a little more (10+ chars).' : ''
  };
  $: isValid = !errors.name && !errors.email && !errors.message;

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    touched = { name: true, email: true, message: true };
    if (!isValid) return;
    const body = `Hi Gamaliel,%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0A— ${encodeURIComponent(name)}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent('Hello from your portfolio')}&body=${body}`;
    sent = true;
  }
</script>

<section id="contact" class="section">
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 lg:col-span-6">
      <Reveal>
        <p class="eyebrow mb-6">04 — Contact</p>
        <h2 class="h-display text-[clamp(2.6rem,7vw,5.2rem)]">
          Let's build<br />something<br />
          <span class="italic text-[var(--accent)]">unforgettable.</span>
        </h2>

        <ul class="mt-10 space-y-3 text-lg">
          <li>
            <a
              href="mailto:{profile.email}"
              data-cursor="link"
              class="group flex items-center gap-3 text-[var(--bone-2)] hover:text-[var(--bone)]"
            >
              <span class="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Email</span>
              <span class="underline-offset-4 group-hover:underline">{profile.email}</span>
            </a>
          </li>
          <li>
            <a
              href="tel:+2348068377631"
              data-cursor="link"
              class="group flex items-center gap-3 text-[var(--bone-2)] hover:text-[var(--bone)]"
            >
              <span class="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Phone</span>
              <span class="underline-offset-4 group-hover:underline">{profile.phone}</span>
            </a>
          </li>
          <li>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener"
              data-cursor="link"
              class="group flex items-center gap-3 text-[var(--bone-2)] hover:text-[var(--bone)]"
            >
              <span class="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">GitHub</span>
              <span class="underline-offset-4 group-hover:underline">@Gamey001</span>
            </a>
          </li>
          <li>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener"
              data-cursor="link"
              class="group flex items-center gap-3 text-[var(--bone-2)] hover:text-[var(--bone)]"
            >
              <span class="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">LinkedIn</span>
              <span class="underline-offset-4 group-hover:underline">in/gamaliel-dashua</span>
            </a>
          </li>
        </ul>
      </Reveal>
    </div>

    <div class="col-span-12 lg:col-span-5 lg:col-start-8">
      <Reveal delay={0.1}>
        <form
          on:submit={handleSubmit}
          class="rounded-3xl border p-6 sm:p-8"
          style="border-color: var(--line); background: var(--surface-2);"
          novalidate
        >
          <div class="space-y-5">
            <label class="block">
              <span class="eyebrow mb-2 block">Your name</span>
              <input
                type="text"
                bind:value={name}
                on:blur={() => (touched.name = true)}
                autocomplete="name"
                maxlength="80"
                required
                aria-invalid={touched.name && !!errors.name}
                class="w-full rounded-xl border px-4 py-3 outline-none transition-colors focus:border-[var(--accent)]"
                style="background: var(--field-bg); border-color: var(--field-border); color: var(--bone);"
              />
              {#if touched.name && errors.name}
                <p class="mt-2 text-xs text-[var(--accent)]" role="alert">{errors.name}</p>
              {/if}
            </label>

            <label class="block">
              <span class="eyebrow mb-2 block">Email</span>
              <input
                type="email"
                bind:value={email}
                on:blur={() => (touched.email = true)}
                autocomplete="email"
                maxlength="120"
                required
                aria-invalid={touched.email && !!errors.email}
                class="w-full rounded-xl border px-4 py-3 outline-none transition-colors focus:border-[var(--accent)]"
                style="background: var(--field-bg); border-color: var(--field-border); color: var(--bone);"
              />
              {#if touched.email && errors.email}
                <p class="mt-2 text-xs text-[var(--accent)]" role="alert">{errors.email}</p>
              {/if}
            </label>

            <label class="block">
              <span class="eyebrow mb-2 block">Message</span>
              <textarea
                bind:value={message}
                on:blur={() => (touched.message = true)}
                rows="5"
                maxlength="2000"
                required
                aria-invalid={touched.message && !!errors.message}
                class="w-full resize-none rounded-xl border px-4 py-3 outline-none transition-colors focus:border-[var(--accent)]"
                style="background: var(--field-bg); border-color: var(--field-border); color: var(--bone);"
              ></textarea>
              {#if touched.message && errors.message}
                <p class="mt-2 text-xs text-[var(--accent)]" role="alert">{errors.message}</p>
              {/if}
            </label>

            <button type="submit" class="btn w-full justify-center" data-cursor="magnet">
              {sent ? 'Opened in your mail app ✓' : 'Send message'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>

            <p class="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Opens your mail client · No data leaves the browser
            </p>
          </div>
        </form>
      </Reveal>
    </div>
  </div>
</section>
