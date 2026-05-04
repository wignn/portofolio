<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { GitBranch as Github, Loader2 } from 'lucide-svelte';

	let { username = 'wignn' } = $props<{ username?: string }>();

	const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const DAYS = ['Mon', '', 'Wed', '', 'Fri', '', ''];

	let weeks = $state<any[]>([]);
	let loading = $state(true);
	let totalContributions = $state(0);
	let streak = $state(0);

	function getContributionColor(count: number) {
		if (count === 0) return 'bg-white/5 border border-white/5';
		if (count <= 3) return 'bg-emerald-900/60 shadow-[0_0_2px_rgba(16,185,129,0.2)]';
		if (count <= 6) return 'bg-emerald-700/80 shadow-[0_0_4px_rgba(16,185,129,0.4)]';
		if (count <= 9) return 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]';
		return 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]';
	}

	onMount(async () => {
		try {
			const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
			const data = await res.json();

			if (!data.contributions || data.contributions.length === 0) {
				loading = false;
				return;
			}

			const contributions = data.contributions;
			totalContributions = data.total?.lastYear || contributions.reduce((s: number, d: any) => s + d.count, 0);

			// Calculate streak
			let currentStreak = 0;
			for (let i = contributions.length - 1; i >= 0; i--) {
				if (contributions[i].count > 0) {
					currentStreak++;
				} else {
					break;
				}
			}
			streak = currentStreak;

			// Group into weeks
			const weekData: any[] = [];
			let currentWeek: any[] = [];

			const firstDate = new Date(contributions[0].date);
			const startDayOfWeek = firstDate.getDay();
			for (let i = 0; i < startDayOfWeek; i++) {
				currentWeek.push({ count: -1, date: '' });
			}

			contributions.forEach((day: any) => {
				currentWeek.push({ count: day.count, date: day.date });
				if (currentWeek.length === 7) {
					weekData.push(currentWeek);
					currentWeek = [];
				}
			});

			if (currentWeek.length > 0) {
				while (currentWeek.length < 7) {
					currentWeek.push({ count: -1, date: '' });
				}
				weekData.push(currentWeek);
			}

			weeks = weekData;
		} catch (err) {
			console.error('Failed to fetch contributions:', err);
		} finally {
			loading = false;
		}
	});

	let monthLabels = $derived.by(() => {
		const labels: { index: number; label: string }[] = [];
		if (weeks.length > 0) {
			let lastMonth = -1;
			weeks.forEach((week, i) => {
				const validDay = week.find((d: any) => d.date);
				if (validDay) {
					const month = new Date(validDay.date).getMonth();
					if (month !== lastMonth) {
						labels.push({ index: i, label: MONTHS[month] });
						lastMonth = month;
					}
				}
			});
		}
		return labels;
	});
</script>

<Card
	class="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b1a]/80 p-6 backdrop-blur-2xl transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_0_50px_rgba(16,185,129,0.15)] sm:p-8"
>
	<!-- Top Neon Accent line -->
	<div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500"></div>

	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center gap-4">
			<div class="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10 group-hover:scale-105 group-hover:border-emerald-400/40 transition-all duration-300">
				<Github class="h-6 w-6" />
			</div>
			<div>
				<h3 class="text-xl font-bold tracking-tight text-white sm:text-2xl group-hover:text-emerald-300 transition-colors">Contributions</h3>
				<p class="text-xs font-mono text-slate-500 mt-0.5">
					<span class="text-emerald-400/80 font-bold">{totalContributions.toLocaleString()}</span> in the last year
				</p>
			</div>
		</div>
		{#if loading}
			<Loader2 class="h-5 w-5 animate-spin text-emerald-400/60" />
		{:else if streak > 0}
			<div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:scale-105 transition-transform">
				<span class="text-xs font-bold uppercase tracking-wider text-emerald-400">{streak} day streak</span>
			</div>
		{/if}
	</div>

	{#if !loading && weeks.length > 0}
		<div class="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
			<!-- Month labels -->
			<div class="mb-1.5 ml-6 flex sm:ml-8">
				{#each weeks as _, i}
					{@const label = monthLabels.find((m) => m.index === i)}
					<span
						class="text-[9px] font-bold uppercase tracking-widest text-slate-500"
						style="width: 12px; min-width: 12px; text-align: left;"
					>
						{label ? label.label : ''}
					</span>
				{/each}
			</div>

			<!-- Grid -->
			<div class="flex gap-0">
				<!-- Day labels -->
				<div class="mr-1.5 flex flex-col gap-[3px] sm:mr-3">
					{#each DAYS as day}
						<span
							class="flex h-[10px] items-center text-[9px] font-bold uppercase tracking-widest text-slate-500 sm:h-[12px]"
						>
							{day}
						</span>
					{/each}
				</div>

				<!-- Cells -->
				<div class="flex gap-[2px] sm:gap-[3px]">
					{#each weeks as week}
						<div class="flex flex-col gap-[2px] sm:gap-[3px]">
							{#each week as day}
								<div
									class="h-[10px] w-[10px] rounded-[3px] transition-colors duration-300 sm:h-[12px] sm:w-[12px] {day.count < 0 ? 'bg-transparent' : getContributionColor(day.count)} hover:scale-125 hover:z-10 cursor-crosshair"
									title={day.date ? `${day.date}: ${day.count} contributions` : ''}
								></div>
							{/each}
						</div>
					{/each}
				</div>
			</div>

			<!-- Legend -->
			<div class="mt-5 flex items-center justify-end gap-1.5">
				<span class="mr-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">Less</span>
				{#each [0, 2, 5, 8, 12] as count}
					<div class="h-[10px] w-[10px] rounded-[3px] sm:h-[12px] sm:w-[12px] {getContributionColor(count)}"></div>
				{/each}
				<span class="ml-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">More</span>
			</div>
		</div>
	{:else if loading}
		<div class="flex gap-[3px] overflow-hidden opacity-50">
			{#each Array.from({ length: 52 }) as _}
				<div class="flex flex-col gap-[3px]">
					{#each Array.from({ length: 7 }) as _}
						<div
							class="h-[10px] w-[10px] animate-pulse rounded-[3px] bg-white/5 sm:h-[12px] sm:w-[12px]"
						></div>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</Card>
