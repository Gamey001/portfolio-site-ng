<script lang="ts">
  import Reveal from './Reveal.svelte';
  import { profile } from '$lib/data/skills';
</script>

<section id="about" class="section">
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 lg:col-span-5">
      <Reveal>
        <p class="eyebrow mb-6">01 — Profile</p>
        <h2 class="h-display text-[clamp(2.4rem,6vw,4.6rem)]">
          <span class="text-[var(--accent)]">Front</span> to<br />
          <span class="italic">back</span>, end<br />
          to end.
        </h2>
      </Reveal>
    </div>

    <div class="col-span-12 lg:col-span-6 lg:col-start-7">
      <Reveal delay={0.1}>
        <p class="text-lg leading-relaxed text-[var(--bone-2)] sm:text-xl">
          I'm a full-stack developer with 4+ years of production experience, including
          2 years as a <strong class="text-bone">Java/Spring Boot</strong> engineer
          designing and consuming reliable APIs. On the front end I treat the browser
          like an instrument — easing curves, focus rings, 60fps. I've shipped
          <strong class="text-bone">end-to-end encrypted</strong> messaging clients,
          <strong class="text-bone">offline-first</strong> dashboards, and
          enterprise EMR surfaces in React/TypeScript backed by Spring Boot services.
        </p>

        <dl class="mt-10 grid grid-cols-2 gap-y-6 text-sm sm:grid-cols-3">
          <div>
            <dt class="eyebrow mb-2">Education</dt>
            <dd>BSc · University of Jos</dd>
          </div>
          <div>
            <dt class="eyebrow mb-2">Based</dt>
            <dd>{profile.location}</dd>
          </div>
          <div>
            <dt class="eyebrow mb-2">Open to</dt>
            <dd>WEB Developer Roles</dd>
          </div>
          <div>
            <dt class="eyebrow mb-2">Stack favourite</dt>
            <dd>React · TS · Spring Boot</dd>
          </div>
          <div>
            <dt class="eyebrow mb-2">Certified</dt>
            <dd>Hatchways Full-Stack Accelerator</dd>
          </div>
          <div>
            <dt class="eyebrow mb-2">Reach</dt>
            <dd>
              <a href="mailto:{profile.email}" data-cursor="link" class="underline-offset-4 hover:underline">
                {profile.email}
              </a>
            </dd>
          </div>
        </dl>
      </Reveal>
    </div>
  </div>
</section>
