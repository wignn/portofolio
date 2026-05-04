<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';

	interface DiscordUser {
		id: string;
		username: string;
		global_name?: string;
		avatar: string;
	}

	interface Activity {
		type: number;
		name: string;
		details?: string;
		state?: string;
		id?: string;
		application_id?: string;
		assets?: {
			large_image?: string;
			large_text?: string;
			small_image?: string;
			small_text?: string;
		};
	}

	interface LanyardData {
		discord_status: string;
		discord_user: DiscordUser;
		activities: Activity[];
	}

	let { lanyard } = $props<{ lanyard: LanyardData | null }>();

	let status = $derived(lanyard?.discord_status || 'offline');
	let user = $derived(lanyard?.discord_user);
	let activities = $derived(lanyard?.activities || []);

	// Use global_name (display name) if available, fallback to username
	let displayName = $derived(user?.global_name || user?.username || 'Loading...');
	let handle = $derived(user?.username || '...');

	const statusColors: Record<string, string> = {
		online: 'bg-emerald-500 shadow-emerald-500/50',
		idle: 'bg-amber-500 shadow-amber-500/50',
		dnd: 'bg-rose-500 shadow-rose-500/50',
		offline: 'bg-slate-500 shadow-slate-500/50'
	};

	const statusLabels: Record<string, string> = {
		online: 'Online',
		idle: 'Idle',
		dnd: 'Do Not Disturb',
		offline: 'Offline'
	};

	function isSpotify(activity: Activity): boolean {
		return (
			activity.id?.startsWith('spotify') === true ||
			activity.name === 'Spotify'
		);
	}

	function getVisibleActivities(acts: Activity[]): Activity[] {
		return acts.filter((a) => a.type !== 4 && !isSpotify(a));
	}

	function getActivityImage(activity: Activity): string | null {
		if (!activity.assets?.large_image) return null;
		const largeImage = activity.assets.large_image;
		if (largeImage.startsWith('https://')) return largeImage;
		if (largeImage.startsWith('mp:external/')) {
			return `https://media.discordapp.net/external/${largeImage.replace('mp:external/', '')}`;
		}
		return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${largeImage}.png`;
	}

	function getActivitySmallImage(activity: Activity): string | null {
		if (!activity.assets?.small_image) return null;
		const smallImage = activity.assets.small_image;
		if (smallImage.startsWith('https://')) return smallImage;
		if (smallImage.startsWith('mp:external/')) {
			return `https://media.discordapp.net/external/${smallImage.replace('mp:external/', '')}`;
		}
		return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${smallImage}.png`;
	}

	function getActivityTypeLabel(type: number): string {
		switch (type) {
			case 0: return 'Playing';
			case 1: return 'Streaming';
			case 2: return 'Listening';
			case 3: return 'Watching';
			case 5: return 'Competing';
			default: return 'Activity';
		}
	}
</script>

<Card
	class="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b1a]/80 p-6 transition-all duration-500 hover:border-indigo-500/40 hover:shadow-[0_0_50px_rgba(99,102,241,0.15)] backdrop-blur-2xl sm:p-8 flex flex-col"
>
	<!-- Top Neon Accent line -->
	<div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500"></div>

	<div class="mb-8 flex items-center justify-between">
		<div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 backdrop-blur-md">
			<span class="relative flex h-2 w-2">
				<span class="animate-ping absolute inline-flex h-full w-full rounded-full {statusColors[status] || statusColors.offline} opacity-75"></span>
				<span class="relative inline-flex rounded-full h-2 w-2 {statusColors[status] || statusColors.offline} shadow-lg"></span>
			</span>
			<span class="text-[10px] font-bold tracking-wider uppercase font-mono text-slate-300">{statusLabels[status] || statusLabels.offline}</span>
		</div>
		<svg class="h-6 w-6 text-indigo-400/80 group-hover:text-indigo-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
			<path
				d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
			/>
		</svg>
	</div>

	<div class="flex items-center gap-4 mb-8">
		<div class="relative group/avatar">
			{#if user}
				<img
					src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.png"
					alt={displayName}
					class="h-16 w-16 rounded-2xl border-2 border-white/10 sm:h-20 sm:w-20 group-hover/avatar:scale-105 transition-transform duration-300 object-cover"
				/>
			{:else}
				<div class="h-16 w-16 animate-pulse rounded-2xl bg-white/5 border border-white/10 sm:h-20 sm:w-20"></div>
			{/if}
			<div
				class="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-[#0b0b1a] {statusColors[status] || statusColors.offline} sm:h-6 sm:w-6"
			></div>
		</div>
		<div>
			<h3 class="text-lg font-extrabold text-white sm:text-xl tracking-tight">{displayName}</h3>
			<p class="text-xs font-mono text-slate-500 sm:text-sm mt-0.5">@{handle}</p>
		</div>
	</div>

	<div class="space-y-4 flex-1">
		{#each getVisibleActivities(activities) as activity}
			<div class="rounded-2xl border border-white/10 bg-[#12122b]/50 p-4 transition-all hover:bg-white/5 hover:border-indigo-500/30 group/activity">
				<div class="flex gap-4">
					{#if getActivityImage(activity)}
						<div class="relative flex-shrink-0">
							<img
								src={getActivityImage(activity)}
								alt={activity.assets?.large_text || activity.name}
								title={activity.assets?.large_text || activity.name}
								class="h-14 w-14 rounded-xl object-cover shadow-lg group-hover/activity:scale-105 transition-transform duration-300"
							/>
							{#if getActivitySmallImage(activity)}
								<img
									src={getActivitySmallImage(activity)}
									alt={activity.assets?.small_text || ''}
									title={activity.assets?.small_text || ''}
									class="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full border-[3px] border-[#12122b] object-cover bg-[#0b0b1a]"
								/>
							{/if}
						</div>
					{/if}
					<div class="min-w-0 flex-1 flex flex-col justify-center">
						<p class="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-0.5">
							{getActivityTypeLabel(activity.type)}
						</p>
						<p class="text-sm font-bold text-slate-200 group-hover/activity:text-white transition-colors truncate">{activity.name}</p>
						{#if activity.details}
							<p class="text-xs text-slate-400 truncate mt-0.5">{activity.details}</p>
						{/if}
						{#if activity.state}
							<p class="text-xs font-mono text-slate-500 truncate mt-1">{activity.state}</p>
						{/if}
					</div>
				</div>
			</div>
		{:else}
			<div class="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8">
				<p class="text-xs font-mono text-slate-500 tracking-wider">No current activity</p>
			</div>
		{/each}
	</div>
</Card>