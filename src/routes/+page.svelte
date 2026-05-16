<script lang="ts">
  import Hero from '$components/Hero.svelte';
  import About from '$components/About.svelte';
  import Marquee from '$components/Marquee.svelte';
  import Skills from '$components/Skills.svelte';
  import Projects from '$components/Projects.svelte';
  import Contact from '$components/Contact.svelte';

  const marqueeItems = [
    'React',
    'TypeScript',
    'SvelteKit',
    'Spring Boot',
    'Web Crypto',
    'AWS',
    'MongoDB',
    'Figma'
  ];
</script>

<svelte:head>
  <title>Gamaliel Dashua — Frontend Engineer</title>
  <meta name="description" content="Gamaliel Dashua — Frontend engineer building immersive, performant interfaces. React, TypeScript, Svelte, Java/Spring Boot." />
  <meta property="og:title" content="Gamaliel Dashua — Frontend Engineer" />
  <meta property="og:description" content="Immersive, performant frontend work. End-to-end encrypted clients, offline-first dashboards, design-led product surfaces." />
  <meta property="og:type" content="website" />
</svelte:head>

<Hero />
<Marquee items={marqueeItems} />
<About />
<Skills />
<Projects />
<Contact />
