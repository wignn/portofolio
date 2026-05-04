<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { Mail, Copy, Check, ArrowUpRight } from 'lucide-svelte';
	import { profileData } from '$lib/data/profile';
	import { slide } from 'svelte/transition';

	let copied = $state(false);

	function copyEmail() {
		navigator.clipboard.writeText(profileData.email);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<Card
	class="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b1a]/80 p-6 backdrop-blur-2xl transition-all duration-500 hover:border-violet-500/40 hover:shadow-[0_0_50px_rgba(139,92,246,0.15)] sm:p-8 flex flex-col"
>
	<!-- Top Neon Accent line -->
	<div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500"></div>

	<!-- Glow Effect in Background -->
	<div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/10 blur-[50px] pointer-events-none group-hover:bg-violet-500/20 transition-all duration-500"></div>

	<div class="mb-4 flex items-center justify-between">
		<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-inner group-hover:scale-105 group-hover:border-violet-400/40 transition-all duration-300">
			<Mail class="h-6 w-6" />
		</div>
		<a
			href={`mailto:${profileData.email}`}
			class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-violet-500/20 hover:text-violet-300 transition-colors"
			title="Send an email"
		>
			<ArrowUpRight class="h-5 w-5" />
		</a>
	</div>

	<div class="mt-2 flex-1">
		<h3 class="text-sm uppercase tracking-widest font-bold text-slate-500 mb-1">Contact Me</h3>
		<p class="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">Let's Connect</p>
	</div>

	<div class="mt-6">
		<button
			class="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#12122b]/50 px-4 py-3 text-sm text-slate-300 transition-all hover:bg-white/5 hover:border-violet-500/30 group/btn"
			onclick={copyEmail}
		>
			<span class="font-mono text-xs text-slate-400 group-hover/btn:text-slate-300 transition-colors truncate mr-2">
				{profileData.email}
			</span>
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 group-hover/btn:bg-violet-500/20 group-hover/btn:text-violet-300 transition-colors">
				{#if copied}
					<div in:slide={{ axis: 'y' }}>
						<Check class="h-4 w-4 text-emerald-400" />
					</div>
				{:else}
					<div in:slide={{ axis: 'y' }}>
						<Copy class="h-4 w-4" />
					</div>
				{/if}
			</div>
		</button>
	</div>
</Card>
