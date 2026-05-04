<script lang="ts">
	import { Menu, X } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let isOpen = $state(false);
	let githubAvatar = $state('');

	onMount(async () => {
		try {
			const res = await fetch('https://api.github.com/users/wignn');
			const data = await res.json();
			githubAvatar = data.avatar_url;
		} catch (err) {
			console.error('Failed to fetch GitHub avatar:', err);
		}
	});
</script>

<header
	class="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur-xl transition-colors duration-300 hover:border-white/20"
>
	<div class="container mx-auto px-4 py-4">
		<div class="mx-auto flex max-w-7xl items-center justify-between">
			<div class="group flex cursor-pointer items-center gap-3">
				{#if githubAvatar}
					<img
						src={githubAvatar}
						alt="GitHub Avatar"
						class="h-8 w-8 rounded-full transition-transform duration-300 group-hover:scale-110"
					/>
				{:else}
					<div
						class="h-8 w-8 animate-pulse rounded-full bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-400 transition-transform duration-300 group-hover:scale-110"
					></div>
				{/if}
				<span class="text-lg font-bold text-white transition-colors group-hover:text-white/80"
					>wignn</span
				>
			</div>

			<nav class="hidden items-center gap-8 md:flex">
				<a
					href="/"
					class="group relative text-white/70 transition-all duration-300 hover:text-white"
				>
					Home
					<span
						class="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-pink-400 to-yellow-300 transition-all duration-300 group-hover:w-full"
					></span>
				</a>
				<a
					href="#about"
					class="group relative text-white/70 transition-all duration-300 hover:text-white"
				>
					About
					<span
						class="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-pink-400 to-yellow-300 transition-all duration-300 group-hover:w-full"
					></span>
				</a>
				<a
					href="#projects"
					class="group relative text-white/70 transition-all duration-300 hover:text-white"
				>
					Projects
					<span
						class="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-pink-400 to-yellow-300 transition-all duration-300 group-hover:w-full"
					></span>
				</a>
			</nav>

			<button
				onclick={() => (isOpen = !isOpen)}
				class="text-white/70 transition-colors hover:text-white md:hidden"
			>
				{#if isOpen}
					<X class="h-6 w-6" />
				{:else}
					<Menu class="h-6 w-6" />
				{/if}
			</button>
		</div>

		{#if isOpen}
			<nav class="mt-4 space-y-2 border-t border-white/10 pt-4 pb-4 md:hidden">
				<a
					href="/"
					class="block py-2 text-white/70 transition-colors hover:text-white"
					onclick={() => (isOpen = false)}
				>
					Home
				</a>
				<a
					href="#about"
					class="block py-2 text-white/70 transition-colors hover:text-white"
					onclick={() => (isOpen = false)}
				>
					About
				</a>
				<a
					href="#projects"
					class="block py-2 text-white/70 transition-colors hover:text-white"
					onclick={() => (isOpen = false)}
				>
					Projects
				</a>
			</nav>
		{/if}
	</div>
</header>
