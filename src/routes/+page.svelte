<script>
  import { onMount } from "svelte";
  import { initMotion } from "../motion.js";
  import "../portfolio.css";
  import AboutSection from "../lib/components/AboutSection.svelte";
  import ActivitySection from "../lib/components/ActivitySection.svelte";
  import ContactSection from "../lib/components/ContactSection.svelte";
  import HeroSection from "../lib/components/HeroSection.svelte";
  import SiteHeader from "../lib/components/SiteHeader.svelte";
  import SiteFooter from "../lib/components/SiteFooter.svelte";
  import WorkSection from "../lib/components/WorkSection.svelte";

  onMount(() => {
    import("../interactions.js");
    initMotion();
  });
</script>

<svelte:head>
  <title>Wign — Portfolio</title>
  <meta name="theme-color" content="#141615" />
  <meta
    name="description"
    content="Wign — Software Developer & Technical Architect. Explore projects, code, and recent activity."
  />
</svelte:head>

<div class="shell mx-auto">
  <SiteHeader />
  <main id="main">
    <HeroSection />
    <WorkSection />
    <AboutSection />
    <ActivitySection />
    <ContactSection />
  </main>
  <SiteFooter />
</div>
