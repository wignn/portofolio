<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { Clock, FolderOpen, Loader2 } from 'lucide-svelte';
	import { useWakaTime } from '$lib/runes/wakatime.svelte';

	const stats = useWakaTime();

	let data = $derived(stats.data);
	let loading = $derived(stats.loading);
</script>

<Card class="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b1a]/80 p-6 backdrop-blur-2xl transition-all duration-500 hover:border-orange-500/40 hover:shadow-[0_0_50px_rgba(249,115,22,0.15)] sm:p-8 flex flex-col">
	
	<!-- Top Neon Accent line -->
	<div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500"></div>

	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 group-hover:scale-105 group-hover:border-orange-400/40 transition-all duration-300">
				<Clock class="h-5 w-5" />
			</div>
			<h3 class="text-base font-bold tracking-tight text-white sm:text-lg group-hover:text-orange-300 transition-colors">Weekly Activity</h3>
		</div>
		{#if loading}
			<Loader2 class="h-4 w-4 animate-spin text-orange-400/60" />
		{/if}
	</div>

	<div class="mb-6">
		<p class="mb-1 text-3xl font-extrabold tracking-tight text-white group-hover:text-slate-100 transition-colors sm:text-4xl">
			{data.totalTime}
		</p>
		<p class="text-xs font-mono text-slate-500">
			~{data.dailyAverage} daily avg
		</p>
	</div>

	<!-- Languages -->
	<div class="space-y-4">
		{#if data.languages.length > 0}
			{#each data.languages as lang}
				<div class="space-y-1.5 group/lang">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<span class="h-1.5 w-1.5 rounded-full group-hover/lang:scale-125 transition-transform" style="background-color: {lang.color}; box-shadow: 0 0 8px {lang.color}"></span>
							<span class="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover/lang:text-white transition-colors">{lang.name}</span>
						</div>
						<span class="font-mono text-[10px] font-bold text-slate-500 group-hover/lang:text-orange-400/80 transition-colors">{lang.time}</span>
					</div>
					<div class="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
						<div
							class="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
							style="width: {lang.percentage}%; background: linear-gradient(90deg, {lang.color}, {lang.color}EE); box-shadow: 0 0 10px {lang.color}60"
						></div>
					</div>
				</div>
			{/each}
		{:else if !loading}
			<div class="flex h-20 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
				<p class="text-xs font-mono tracking-wider text-slate-500">No activity this week</p>
			</div>
		{/if}
	</div>

	<!-- Top Project -->
	<div class="mt-8 border-t border-white/10 pt-4 flex items-center justify-between">
		<div class="flex items-center gap-2 text-slate-500 group-hover:text-slate-400 transition-colors">
			<FolderOpen class="h-4 w-4" />
			<span class="text-xs font-bold uppercase tracking-wider">Top Project</span>
		</div>
		<span class="text-xs font-mono font-medium text-orange-400">{data.topProject}</span>
	</div>
</Card>
