<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { Activity, ShieldCheck, RefreshCw, Globe, AlertCircle, Cpu } from 'lucide-svelte';
	import { projects } from '$lib/data/projects';
	import { onMount } from 'svelte';

	let projectPings = $state<Record<string, number>>({});
	let projectStatus = $state<Record<string, 'online' | 'offline' | 'checking'>>({});

	async function checkPings() {
		for (const p of projects) {
			if (!p.url) continue;
			
			// Initialize checking status
			if (!projectStatus[p.title]) {
				projectStatus[p.title] = 'checking';
			}

			const start = performance.now();
			try {
				await fetch(p.url, { mode: 'no-cors', cache: 'no-cache' });
				const end = performance.now();
				projectPings[p.title] = Math.round(end - start);
				projectStatus[p.title] = 'online';
			} catch (err) {
				console.warn(`Failed to ping ${p.title}:`, err);
				projectStatus[p.title] = 'offline';
				projectPings[p.title] = 0;
			}
		}
	}

	onMount(() => {
		checkPings();
		const interval = setInterval(checkPings, 15000);
		return () => clearInterval(interval);
	});
</script>

<Card
	class="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b1a]/80 p-6 transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-2xl sm:p-8"
>
	<div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500"></div>

	<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center gap-4">
			<div class="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10 group-hover:scale-105 group-hover:border-cyan-400/40 transition-all duration-300">
				<Activity class="h-6 w-6" />
			</div>
			<div>
				<h2 class="text-xl font-bold tracking-tight text-white sm:text-2xl group-hover:text-cyan-300 transition-colors duration-300">
					Uptime Monitor
				</h2>
				<p class="text-xs text-slate-400 mt-0.5">
					<span class="text-cyan-400/80 font-medium font-mono tracking-wide">Live status</span>
					<span class="mx-2 text-slate-700">|</span>
					Active projects
				</p>
			</div>
		</div>
		<div class="flex items-center self-end sm:self-center">
			<div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 backdrop-blur-md">
				<span class="relative flex h-2.5 w-2.5">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
				</span>
				<span class="text-xs font-bold tracking-wider uppercase font-mono text-emerald-400">
					Operational
				</span>
			</div>
		</div>
	</div>

	<!-- Monitoring List -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		{#each projects as p}
			<div class="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#12122b]/50 to-[#0b0b1a]/50 p-4 transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/5 group/item">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3 min-w-0">
						<div class="relative flex-shrink-0">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/50 text-slate-400 border border-white/10 group-hover/item:scale-110 group-hover/item:text-cyan-400 group-hover/item:border-cyan-500/30 transition-all duration-300">
								<Globe class="h-4.5 w-4.5" />
							</div>
							{#if projectStatus[p.title] === 'online'}
								<span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#0b0b1a] shadow-md shadow-emerald-500/50 animate-pulse"></span>
							{:else if projectStatus[p.title] === 'offline'}
								<span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-rose-500 border-2 border-[#0b0b1a] shadow-md shadow-rose-500/50"></span>
							{:else}
								<span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-amber-500 border-2 border-[#0b0b1a] shadow-md shadow-amber-500/50"></span>
							{/if}
						</div>
						<div class="min-w-0">
							<h4 class="truncate font-bold text-sm text-slate-200 group-hover/item:text-cyan-300 transition-colors">{p.title}</h4>
							<p class="text-[10px] text-slate-500 font-mono tracking-wide truncate">{p.url.replace('https://', '')}</p>
						</div>
					</div>

					<div class="flex items-center gap-4 flex-shrink-0">
						<div class="text-right">
							<div class="flex items-center justify-end gap-1 text-[10px] font-mono tracking-widest {projectStatus[p.title] === 'online' ? 'text-slate-500' : 'text-rose-400/60'}">
								<RefreshCw class="h-3 w-3 animate-spin duration-[3s] text-slate-600" />
								<span>{projectPings[p.title] ? `${projectPings[p.title]}ms` : (projectStatus[p.title] === 'checking' ? '...' : 'DOWN')}</span>
							</div>
							<div class="flex items-center justify-end gap-1 mt-0.5 font-mono text-xs {projectStatus[p.title] === 'online' ? 'text-emerald-400' : 'text-rose-400'}">
								{#if projectStatus[p.title] === 'online'}
									<ShieldCheck class="h-3.5 w-3.5" />
									<span class="font-bold">100%</span>
								{:else if projectStatus[p.title] === 'offline'}
									<AlertCircle class="h-3.5 w-3.5" />
									<span class="font-bold">0%</span>
								{:else}
									<span class="font-bold text-slate-500">...</span>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</Card>
