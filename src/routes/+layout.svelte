<script lang="ts">
	import '../app.css';
	import type { LayoutProps } from './$types';

	const favicon = '/icon.svg';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
