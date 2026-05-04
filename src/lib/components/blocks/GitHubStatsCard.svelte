<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { GitBranch as Github, Star, GitCommit, GitPullRequest, AlertCircle } from 'lucide-svelte';
	import { useGitHubStats } from '$lib/runes/github-stats.svelte';

	const statsState = useGitHubStats('wignn');

	let stats = $derived(statsState.stats);
	let loading = $derived(statsState.loading);
</script>

{#if loading || !stats}
	<Card class="rounded-3xl border border-white/10 bg-[#0b0b1a]/80 p-6 backdrop-blur-2xl sm:p-8 flex flex-col">
		<div class="mb-6 flex items-center gap-3">
			<div class="h-10 w-10 animate-pulse rounded-xl bg-white/5 border border-white/10"></div>
			<div class="space-y-2">
				<div class="h-4 w-32 animate-pulse rounded bg-white/5"></div>
				<div class="h-3 w-20 animate-pulse rounded bg-white/5"></div>
			</div>
		</div>
		<div class="grid grid-cols-2 gap-4 mb-8">
			{#each [1, 2, 3, 4] as i}
				<div class="h-24 w-full animate-pulse rounded-2xl bg-white/5 border border-white/10"></div>
			{/each}
		</div>
		<div class="space-y-4 flex-1">
			<div class="h-4 w-40 animate-pulse rounded bg-white/5 mb-2"></div>
			{#each [1, 2, 3, 4, 5] as i}
				<div class="h-2 w-full animate-pulse rounded-full bg-white/5"></div>
			{/each}
		</div>
	</Card>
{:else}
	<Card
		class="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b1a]/80 p-6 transition-all duration-500 hover:border-slate-400/40 hover:shadow-[0_0_50px_rgba(255,255,255,0.05)] backdrop-blur-2xl sm:p-8 flex flex-col"
	>
		<!-- Top Neon Accent line -->
		<div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500"></div>

		<!-- Header -->
		<div class="mb-8 flex items-center gap-4">
			<div class="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white border border-white/10 shadow-lg group-hover:scale-105 group-hover:border-white/20 transition-all duration-300">
				<Github class="h-6 w-6" />
			</div>
			<div>
				<h3 class="text-xl font-bold tracking-tight text-white sm:text-2xl transition-colors duration-300">
					GitHub
				</h3>
				<p class="text-xs text-slate-400 mt-0.5 font-mono tracking-wide">
					Account Statistics
				</p>
			</div>
		</div>

		<!-- GitHub Statistics Grid -->
		<div class="grid grid-cols-2 gap-4 mb-8">
			<div class="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 transition-all hover:bg-yellow-500/10 hover:border-yellow-500/40 group/stat">
				<div class="mb-2 flex items-center gap-2">
					<Star class="h-4 w-4 text-yellow-400 group-hover/stat:scale-110 transition-transform" />
					<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stars</p>
				</div>
				<p class="text-2xl font-extrabold text-white sm:text-3xl group-hover/stat:text-yellow-300 transition-colors">{stats.stars}</p>
			</div>

			<div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition-all hover:bg-emerald-500/10 hover:border-emerald-500/40 group/stat">
				<div class="mb-2 flex items-center gap-2">
					<GitCommit class="h-4 w-4 text-emerald-400 group-hover/stat:scale-110 transition-transform" />
					<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Commits</p>
				</div>
				<p class="text-2xl font-extrabold text-white sm:text-3xl group-hover/stat:text-emerald-300 transition-colors">{stats.commits}</p>
			</div>

			<div class="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 transition-all hover:bg-blue-500/10 hover:border-blue-500/40 group/stat">
				<div class="mb-2 flex items-center gap-2">
					<GitPullRequest class="h-4 w-4 text-blue-400 group-hover/stat:scale-110 transition-transform" />
					<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PRs</p>
				</div>
				<p class="text-2xl font-extrabold text-white sm:text-3xl group-hover/stat:text-blue-300 transition-colors">{stats.prs}</p>
			</div>

			<div class="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 transition-all hover:bg-rose-500/10 hover:border-rose-500/40 group/stat">
				<div class="mb-2 flex items-center gap-2">
					<AlertCircle class="h-4 w-4 text-rose-400 group-hover/stat:scale-110 transition-transform" />
					<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issues</p>
				</div>
				<p class="text-2xl font-extrabold text-white sm:text-3xl group-hover/stat:text-rose-300 transition-colors">{stats.issues}</p>
			</div>
		</div>

		<!-- Language Distribution Section -->
		<div class="flex-1 flex flex-col border-t border-white/5 pt-6">
			<h4 class="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Top Languages</h4>

			<div class="flex flex-col gap-4">
				{#each stats.languages.slice(0, 5) as lang, index}
					{@const total = stats.languages.reduce((sum, l) => sum + l.count, 0)}
					{@const percentage = Math.round((lang.count / total) * 100)}
					{@const colors = ['bg-yellow-400', 'bg-orange-400', 'bg-rose-400', 'bg-purple-400', 'bg-blue-400']}
					<div class="group/lang">
						<div class="mb-1.5 flex items-center justify-between">
							<span class="text-xs font-bold text-slate-300 group-hover/lang:text-white transition-colors">{lang.name}</span>
							<span class="text-[10px] font-mono text-slate-500">{percentage}%</span>
						</div>

						<div class="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
							<div
								class="h-full {colors[index % colors.length]} transition-all duration-1000 ease-out"
								style="width: {percentage}%; box-shadow: 0 0 10px var(--tw-shadow-color)"
							></div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</Card>
{/if}
