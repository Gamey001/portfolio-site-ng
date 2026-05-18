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
    'Java',
    'Spring Boot',
    'Node.js',
    'Django',
    'AWS',
    'Docker',
    'MongoDB',
    'REST APIs'
  ];
</script>

<svelte:head>
  <title>Gamaliel Dashua — Full-Stack Developer</title>
  <meta name="description" content="Gamaliel Dashua — Full-stack developer shipping production software across React/TypeScript, Java/Spring Boot, Node, and Python." />
  <meta property="og:title" content="Gamaliel Dashua — Full-Stack Developer" />
  <meta property="og:description" content="Full-stack developer with 4+ years across React/TypeScript and Java/Spring Boot. End-to-end encrypted clients, offline-first dashboards, EMR systems." />
  <meta property="og:type" content="website" />
</svelte:head>

<Hero />
<Marquee items={marqueeItems} />
<About />
<Skills />
<Projects />
<Contact />
