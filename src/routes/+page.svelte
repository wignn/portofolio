<script>
	import { onMount } from 'svelte';
	import { initMotion } from '../motion.js';
	import '../portfolio.css';
	import AboutSection from '../lib/components/AboutSection.svelte';
	import ActivitySection from '../lib/components/ActivitySection.svelte';
	import ContactSection from '../lib/components/ContactSection.svelte';
	import HeroSection from '../lib/components/HeroSection.svelte';
	import SiteHeader from '../lib/components/SiteHeader.svelte';
	import SiteFooter from '../lib/components/SiteFooter.svelte';
	import WorkSection from '../lib/components/WorkSection.svelte';

	onMount(() => {
		import('../interactions.js');
		return initMotion();
	});
</script>

<svelte:head>
	<title>Wign | Backend, Full-Stack &amp; Technical Architecture</title>
	<meta name="theme-color" content="#151916" />
	<meta
		name="description"
		content="Wign: Backend & Full-Stack Developer focused on DevOps and IT Technical Architecture. Projects, systems, and the code behind them."
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
