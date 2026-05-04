<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import {
		Cpu,
		MemoryStick,
		HardDrive,
		Monitor,
		Wifi,
		Activity,
		Clock,
		Server,
		ShieldCheck
	} from 'lucide-svelte';
	import { useServerStats } from '$lib/runes/server-stats.svelte';

	const stats = useServerStats();

	let data = $derived(stats.data);
	let connected = $derived(stats.connected);
	let isOnline = $derived(data.status === 'online' && connected);

	function getUsageColor(percent: number) {
		if (percent >= 80) return 'from-rose-500 to-red-600 border-rose-500/50 text-rose-400';
		if (percent >= 60) return 'from-amber-400 to-orange-500 border-amber-500/50 text-amber-400';
		return 'from-emerald-400 to-teal-500 border-emerald-500/50 text-emerald-400';
	}

	function getBarColor(percent: number) {
		if (percent >= 80) return 'bg-gradient-to-r from-rose-500 to-red-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]';
		if (percent >= 60) return 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_10px_rgba(251,191,36,0.6)]';
		return 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(52,211,153,0.6)]';
	}
</script>

<Card
	class="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b1a]/80 p-6 transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-2xl sm:p-8"
>
	<!-- Top Soft Light Accent Line -->
	<div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500"></div>

	<!-- Glow Effect in Background that meshes perfectly with the page blobs -->
	<div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none"></div>
	<div class="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

	<!-- Header -->
	<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center gap-4">
			<div class="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10 group-hover:scale-105 group-hover:border-cyan-400/40 transition-all duration-300">
				<Server class="h-6 w-6" />
			</div>
			<div>
				<h2 class="text-xl font-bold tracking-tight text-white sm:text-2xl group-hover:text-cyan-300 transition-colors duration-300">
					Server Monitor
				</h2>
				<p class="text-xs text-slate-400 mt-0.5">
					<span class="text-cyan-400/80 font-medium font-mono tracking-wide">{data.hostname}</span>
					<span class="mx-2 text-slate-700">|</span>
					{data.os}
				</p>
			</div>
		</div>

		<div class="flex items-center self-end sm:self-center">
			<div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 backdrop-blur-md">
				<span class="relative flex h-2.5 w-2.5">
					{#if isOnline}
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
					{:else}
						<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-lg shadow-rose-500/50"></span>
					{/if}
				</span>
				<span class="text-xs font-bold tracking-wider uppercase font-mono {isOnline ? 'text-emerald-400' : 'text-rose-400'}">
					{isOnline ? 'Online' : 'Offline'}
				</span>
			</div>
		</div>
	</div>

	{#if !isOnline && !connected}
		<div class="py-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
			<div class="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-600 border border-white/10">
				<Server class="h-6 w-6" />
			</div>
			<p class="text-sm font-semibold text-slate-400">Server is currently unreachable</p>
			<p class="mt-1 text-xs text-slate-500 animate-pulse font-mono uppercase tracking-wider">Attempting reconnect...</p>
		</div>
	{/if}

	{#if isOnline || data.lastUpdated}
		<!-- Main stats grid -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
			<!-- CPU -->
			<div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#12122b]/50 p-5 transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/5 group/item">
				<div class="mb-4 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/50 text-slate-400 border border-white/10 group-hover/item:text-cyan-400 group-hover/item:border-cyan-500/30 group-hover/item:scale-110 transition-all">
							<Cpu class="h-5 w-5" />
						</div>
						<span class="text-xs font-bold tracking-widest uppercase text-slate-400 group-hover/item:text-slate-300 transition-colors">CPU</span>
					</div>
					<span class="font-mono text-[10px] font-bold text-slate-500">{data.cpu.cores} Cores</span>
				</div>
				
				<div class="flex items-baseline justify-between mb-3">
					<span class="font-mono text-4xl font-extrabold text-white transition-colors">
						{data.cpu.usagePercent.toFixed(1)}%
					</span>
					<span class="text-[10px] uppercase font-bold tracking-widest text-slate-500">Load</span>
				</div>

				<!-- Visual dynamic progress bar -->
				<div class="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
					<div 
						class="absolute top-0 left-0 h-full transition-all duration-1000 ease-out {getBarColor(data.cpu.usagePercent)}"
						style="width: {Math.max(1, data.cpu.usagePercent)}%"
					></div>
				</div>
				<p class="mt-3 truncate text-[10px] font-mono text-slate-500 group-hover/item:text-slate-400 transition-colors">{data.cpu.model || 'System Core'}</p>
			</div>

			<!-- Memory -->
			<div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#12122b]/50 p-5 transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/5 group/item">
				<div class="mb-4 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/50 text-slate-400 border border-white/10 group-hover/item:text-emerald-400 group-hover/item:border-emerald-500/30 group-hover/item:scale-110 transition-all">
							<MemoryStick class="h-5 w-5" />
						</div>
						<span class="text-xs font-bold tracking-widest uppercase text-slate-400 group-hover/item:text-slate-300 transition-colors">Memory</span>
					</div>
					<span class="font-mono text-[10px] font-bold text-slate-500">RAM</span>
				</div>
				
				<div class="flex items-baseline justify-between mb-3">
					<span class="font-mono text-4xl font-extrabold text-white transition-colors">
						{data.memory.usagePercent.toFixed(1)}%
					</span>
					<span class="text-[10px] uppercase font-bold tracking-widest text-slate-500">Used</span>
				</div>

				<!-- Visual dynamic progress bar -->
				<div class="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
					<div 
						class="absolute top-0 left-0 h-full transition-all duration-1000 ease-out {getBarColor(data.memory.usagePercent)}"
						style="width: {Math.max(1, data.memory.usagePercent)}%"
					></div>
				</div>
				<p class="mt-3 truncate text-[10px] font-mono text-slate-500 group-hover/item:text-slate-400 transition-colors">{data.memory.used} / {data.memory.total}</p>
			</div>

			<!-- Disk -->
			<div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#12122b]/50 p-5 transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/5 group/item">
				<div class="mb-4 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/50 text-slate-400 border border-white/10 group-hover/item:text-amber-400 group-hover/item:border-amber-500/30 group-hover/item:scale-110 transition-all">
							<HardDrive class="h-5 w-5" />
						</div>
						<span class="text-xs font-bold tracking-widest uppercase text-slate-400 group-hover/item:text-slate-300 transition-colors">Disk</span>
					</div>
					<span class="font-mono text-[10px] font-bold text-slate-500">Storage</span>
				</div>
				
				<div class="flex items-baseline justify-between mb-3">
					<span class="font-mono text-4xl font-extrabold text-white transition-colors">
						{data.disk.usagePercent.toFixed(1)}%
					</span>
					<span class="text-[10px] uppercase font-bold tracking-widest text-slate-500">Cap</span>
				</div>

				<!-- Visual dynamic progress bar -->
				<div class="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
					<div 
						class="absolute top-0 left-0 h-full transition-all duration-1000 ease-out {getBarColor(data.disk.usagePercent)}"
						style="width: {Math.max(1, data.disk.usagePercent)}%"
					></div>
				</div>
				<p class="mt-3 truncate text-[10px] font-mono text-slate-500 group-hover/item:text-slate-400 transition-colors">{data.disk.used} / {data.disk.total}</p>
			</div>
		</div>

		<!-- Bottom high-tech metrics bar -->
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
			<div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#12122b]/30 p-3 hover:border-white/20 hover:bg-white/5 transition-all group/subitem">
				<div class="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-400 border border-white/10 group-hover/subitem:text-cyan-400 group-hover/subitem:border-cyan-500/30 group-hover/subitem:scale-105 transition-all">
					<Clock class="h-4 w-4" />
				</div>
				<div class="min-w-0">
					<p class="text-[9px] uppercase tracking-widest font-bold text-slate-500">Uptime</p>
					<p class="truncate font-mono text-xs font-bold text-slate-200 mt-0.5">{data.uptime}</p>
				</div>
			</div>

			<div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#12122b]/30 p-3 hover:border-white/20 hover:bg-white/5 transition-all group/subitem">
				<div class="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-400 border border-white/10 group-hover/subitem:text-cyan-400 group-hover/subitem:border-cyan-500/30 group-hover/subitem:scale-105 transition-all">
					<Activity class="h-4 w-4" />
				</div>
				<div class="min-w-0">
					<p class="text-[9px] uppercase tracking-widest font-bold text-slate-500">Load Avg</p>
					<p class="truncate font-mono text-xs font-bold text-slate-200 mt-0.5">{data.loadAverage}</p>
				</div>
			</div>

			<div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#12122b]/30 p-3 hover:border-white/20 hover:bg-white/5 transition-all group/subitem">
				<div class="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-400 border border-white/10 group-hover/subitem:text-cyan-400 group-hover/subitem:border-cyan-500/30 group-hover/subitem:scale-105 transition-all">
					<Wifi class="h-4 w-4" />
				</div>
				<div class="min-w-0">
					<p class="text-[9px] uppercase tracking-widest font-bold text-slate-500">Net RX/TX</p>
					<p class="truncate font-mono text-[10px] font-bold text-slate-200 mt-0.5">
						{data.network.rx} / {data.network.tx}
					</p>
				</div>
			</div>

			<div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#12122b]/30 p-3 hover:border-white/20 hover:bg-white/5 transition-all group/subitem">
				<div class="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-400 border border-white/10 group-hover/subitem:text-cyan-400 group-hover/subitem:border-cyan-500/30 group-hover/subitem:scale-105 transition-all">
					<Monitor class="h-4 w-4" />
				</div>
				<div class="min-w-0">
					<p class="text-[9px] uppercase tracking-widest font-bold text-slate-500">Processes</p>
					<p class="font-mono text-xs font-bold text-slate-200 mt-0.5">{data.processes}</p>
				</div>
			</div>
		</div>

		<!-- Footer Meta -->
		{#if data.lastUpdated}
			<div class="mt-6 flex items-center justify-end gap-2 text-[10px] text-slate-500 font-mono tracking-wider">
				<ShieldCheck class="h-3.5 w-3.5 text-emerald-500/70" />
				<span>Refreshed live &middot; Last updated {new Date(data.lastUpdated).toLocaleTimeString()}</span>
			</div>
		{/if}
	{/if}
</Card>
