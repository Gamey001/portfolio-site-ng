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
          The mix is<br /><span class="text-[var(--accent)]">code</span> meets<br />
          <span class="italic">craft</span>.
        </h2>
      </Reveal>
    </div>

    <div class="col-span-12 lg:col-span-6 lg:col-start-7">
      <Reveal delay={0.1}>
        <p class="text-lg leading-relaxed text-[var(--bone-2)] sm:text-xl">
          I'm a frontend engineer who treats the browser like an instrument.
          I obsess over the small things — the easing of a button, the integrity
          of a focus ring, the difference between a 60fps animation and a 58fps
          one. I've shipped <strong class="text-bone">end-to-end encrypted</strong>
          messaging clients, <strong class="text-bone">offline-first</strong> dashboards,
          and design-led product surfaces.
        </p>

        <dl class="mt-10 grid grid-cols-2 gap-y-6 text-sm sm:grid-cols-3">
          <div>
            <dt class="eyebrow mb-2">Education</dt>
            <dd>BSc. Computer Science</dd>
          </div>
          <div>
            <dt class="eyebrow mb-2">Based</dt>
            <dd>{profile.location}</dd>
          </div>
          <div>
            <dt class="eyebrow mb-2">Open to</dt>
            <dd>Senior frontend roles</dd>
          </div>
          <div>
            <dt class="eyebrow mb-2">Stack favourite</dt>
            <dd>React · TS · Spring</dd>
          </div>
          <div>
            <dt class="eyebrow mb-2">Off the keys</dt>
            <dd>Guitar · Soccer</dd>
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
