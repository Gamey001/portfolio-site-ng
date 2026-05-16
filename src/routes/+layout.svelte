<script lang="ts">
  import '../app.css';
  import Cursor from '$components/Cursor.svelte';
  import Noise from '$components/Noise.svelte';
  import Nav from '$components/Nav.svelte';
  import Footer from '$components/Footer.svelte';
</script>

<Cursor />
<Noise />
<Nav />

<main>
  <slot />
</main>

<Footer />
