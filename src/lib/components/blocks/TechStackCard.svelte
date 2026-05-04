<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { Cpu } from 'lucide-svelte';
	import { useGitHubLanguages } from '$lib/runes/github-languages.svelte';

	const stats = useGitHubLanguages('wignn');

	let languages = $derived(stats.languages);
	let loading = $derived(stats.loading);
	let error = $derived(stats.error);
</script>

{#if loading}
	<Card class="rounded-3xl border border-white/10 bg-[#0b0b1a]/80 p-6 backdrop-blur-2xl sm:p-8">
		<div class="mb-6 flex items-center gap-3">
			<Cpu class="h-6 w-6 text-emerald-400" />
			<h3 class="text-xl font-bold tracking-tight text-white">Tech Stack</h3>
		</div>
		<div class="space-y-4">
			{#each [1, 2, 3, 4] as i}
				<div class="h-8 animate-pulse rounded-lg bg-white/5"></div>
			{/each}
		</div>
	</Card>
{:else}
	<Card class="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b1a]/80 p-6 transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_0_50px_rgba(16,185,129,0.15)] backdrop-blur-2xl sm:p-8 flex flex-col">
		
		<!-- Top Neon Accent line -->
		<div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500"></div>

		<!-- Header -->
		<div class="mb-8 flex items-center gap-4">
			<div class="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10 group-hover:scale-105 group-hover:border-emerald-400/40 transition-all duration-300">
				<Cpu class="h-6 w-6" />
			</div>
			<div>
				<h2 class="text-xl font-bold tracking-tight text-white sm:text-2xl group-hover:text-emerald-300 transition-colors duration-300">
					Tech Stack
				</h2>
				<p class="text-xs text-slate-400 mt-0.5">
					<span class="text-emerald-400/80 font-medium font-mono tracking-wide">Languages</span>
					<span class="mx-2 text-slate-700">|</span>
					GitHub Stats
				</p>
			</div>
		</div>

		{#if error || languages.length === 0}
			<p class="text-sm font-medium text-rose-400/80 mt-4">Unable to load languages. Please try again later.</p>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1">
				<!-- Language Tags -->
				<div class="flex flex-wrap gap-2 content-start">
					{#each languages.slice(0, 6) as lang}
						<div class="group/tag flex items-center gap-2 rounded-xl border border-white/10 bg-[#12122b]/50 px-3 py-1.5 transition-all hover:border-emerald-500/30 hover:bg-white/5">
							<span
								class="h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5 group-hover/tag:scale-125 transition-transform duration-300"
								style="background-color: {lang.color}; box-shadow: 0 0 12px {lang.color}"
							></span>
							<span class="text-xs font-medium text-slate-300 transition-colors group-hover/tag:text-white sm:text-sm">
								{lang.name}
							</span>
							<span class="font-mono text-[10px] text-slate-500 sm:text-xs">
								{lang.percentage}%
							</span>
						</div>
					{/each}
				</div>

				<!-- Visual Progress Bars -->
				<div class="space-y-4 sm:space-y-5">
					{#each languages.slice(0, 4) as lang}
						<div class="space-y-2 group/bar">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<span class="text-xs font-bold tracking-wider uppercase text-slate-300 group-hover/bar:text-white transition-colors">{lang.name}</span>
								</div>
								<span class="font-mono text-[10px] font-bold text-slate-500 sm:text-xs group-hover/bar:text-emerald-400/80 transition-colors">{lang.percentage}%</span>
							</div>
							<div class="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
								<div
									class="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
									style="width: {lang.percentage}%; background: linear-gradient(90deg, {lang.color}, {lang.color}EE); box-shadow: 0 0 10px {lang.color}60"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<div class="mt-8 border-t border-white/10 pt-4 flex items-center justify-end">
			<a
				href="https://github.com/wignn"
				target="_blank"
				rel="noopener noreferrer"
				class="group/link flex items-center gap-2 text-xs font-mono tracking-wider text-slate-500 transition-colors hover:text-emerald-400"
			>
				<svg class="h-3.5 w-3.5 group-hover/link:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
				</svg>
				<span>View all on GitHub</span>
			</a>
		</div>
	</Card>
{/if}
