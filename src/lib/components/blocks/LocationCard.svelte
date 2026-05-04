<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { Thermometer, Calendar, Clock, MapPin } from 'lucide-svelte';

	let {
		location,
		region,
		temperature,
		timestamp
	} = $props<{
		location: string;
		region: string;
		temperature: number | string | null;
		timestamp: string;
	}>();

	const greeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return 'GOOD MORNING';
		if (hour < 18) return 'GOOD AFTERNOON';
		return 'GOOD EVENING';
	};

	const dateString = new Date().toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric'
	});
</script>

<Card
	class="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b1a]/80 p-6 backdrop-blur-2xl transition-all duration-500 hover:border-blue-500/40 hover:shadow-[0_0_50px_rgba(59,130,246,0.15)] sm:p-8 flex flex-col"
>
	<!-- Top Neon Accent line -->
	<div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500"></div>

	<div class="mb-6 flex items-start justify-between">
		<div>
			<div class="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-blue-400 transition-colors">
				<MapPin class="h-3 w-3" />
				{greeting()}
			</div>
			<h3 class="text-3xl font-extrabold text-white tracking-tight group-hover:text-slate-100 transition-colors">
				{location}
			</h3>
			<p class="mt-1 text-sm text-slate-400 font-medium">{region}</p>
		</div>

		<div
			class="flex items-center gap-2 rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 backdrop-blur-md transition-all duration-300 group-hover:border-blue-400/40 group-hover:scale-105 shadow-lg shadow-blue-500/5"
		>
			<Thermometer class="h-5 w-5 text-blue-400" />
			<span class="text-xl font-bold text-white font-mono"
				>{temperature !== null ? `${temperature}°C` : '…'}</span
			>
		</div>
	</div>

	<div class="mt-auto border-t border-white/10 pt-6">
		<div class="grid grid-cols-2 gap-4">
			<div class="flex items-center gap-3 group/item">
				<div class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/50 text-slate-400 border border-white/10 group-hover/item:text-blue-400 group-hover/item:border-blue-500/30 transition-all">
					<Calendar class="h-4 w-4" />
				</div>
				<div>
					<p class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Date</p>
					<p class="text-xs font-semibold text-slate-300 mt-0.5">{dateString}</p>
				</div>
			</div>

			<div class="flex items-center gap-3 group/item">
				<div class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/50 text-slate-400 border border-white/10 group-hover/item:text-emerald-400 group-hover/item:border-emerald-500/30 transition-all">
					<Clock class="h-4 w-4" />
				</div>
				<div>
					<p class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Time</p>
					<p class="font-mono text-xs font-semibold text-emerald-400 mt-0.5 tracking-wide">{timestamp}</p>
				</div>
			</div>
		</div>
	</div>
</Card>
