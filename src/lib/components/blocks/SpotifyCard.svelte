<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { Music, Disc3 } from 'lucide-svelte';
	import type { LanyardData } from '$lib/types';

	let { lanyard } = $props<{ lanyard: LanyardData | null }>();

	let spotifyActivity = $derived(lanyard?.activities?.find((a: any) => a.name === 'Spotify' || a.id === 'spotify:1' || a.type === 2));

	let isListening = $derived(lanyard?.listening_to_spotify || !!spotifyActivity);

	function getSpotifyAlbumArt(activity: any) {
		if (!activity?.assets || !activity.assets.large_image) return null;
		const largeImage = activity.assets.large_image;
		if (largeImage.startsWith('spotify:')) {
			return `https://i.scdn.co/image/${largeImage.substring(8)}`;
		}
		if (largeImage.startsWith('https://')) return largeImage;
		if (largeImage.startsWith('mp:external/')) {
			return `https://media.discordapp.net/external/${largeImage.replace('mp:external/', '')}`;
		}
		return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${largeImage}.png`;
	}

	let spotify = $derived(lanyard?.spotify || (spotifyActivity ? {
		album_art_url: getSpotifyAlbumArt(spotifyActivity),
		song: spotifyActivity.details,
		artist: spotifyActivity.state,
		album: spotifyActivity.assets?.large_text
	} : null));

	let albumArt = $derived(spotify?.album_art_url);
	let song = $derived(spotify?.song);
	let artist = $derived(spotify?.artist);
	let album = $derived(spotify?.album);
</script>

{#if !isListening || !spotify}
	<Card
		class="rounded-3xl border border-white/10 bg-[#0b0b1a]/80 p-6 backdrop-blur-2xl transition-all duration-300 sm:p-8 flex flex-col items-center justify-center text-center"
	>
		<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-inner">
			<Music class="h-6 w-6 text-slate-500" />
		</div>
		<h3 class="text-sm font-bold text-slate-300">Spotify</h3>
		<p class="mt-1 text-xs font-mono text-slate-500">Not listening to anything</p>
	</Card>
{:else}
	<Card
		class="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b1a]/80 p-6 backdrop-blur-2xl transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_0_50px_rgba(16,185,129,0.15)] sm:p-8"
	>
		<!-- Background blur of album art -->
		{#if albumArt}
			<div class="absolute inset-0 opacity-10 transition-opacity duration-700 group-hover:opacity-20 pointer-events-none">
				<img src={albumArt} alt="" class="h-full w-full scale-150 object-cover blur-3xl saturate-200" />
			</div>
		{/if}

		<div class="relative z-10 flex flex-col h-full">
			<div class="mb-6 flex items-center justify-between">
				<div class="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 backdrop-blur-md">
					<svg class="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
						/>
					</svg>
					<span class="text-[10px] font-bold tracking-wider uppercase font-mono text-emerald-400">Now Playing</span>
				</div>
				<div class="flex gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
					<span class="h-3.5 w-1 animate-[musicBar1_0.6s_ease-in-out_infinite] rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
					<span class="h-3.5 w-1 animate-[musicBar2_0.7s_ease-in-out_infinite] rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
					<span class="h-3.5 w-1 animate-[musicBar3_0.5s_ease-in-out_infinite] rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
				</div>
			</div>

			<div class="flex flex-col gap-4 flex-1 justify-center">
				{#if albumArt}
					<img
						src={albumArt}
						alt={album}
						class="h-20 w-20 self-center rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-110 object-cover"
					/>
				{:else}
					<div
						class="flex h-20 w-20 self-center items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10"
					>
						<Disc3 class="h-10 w-10 animate-spin text-emerald-400" style="animation-duration: 3s" />
					</div>
				{/if}
				<div class="text-center mt-2">
					<p class="truncate text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{song}</p>
					<p class="truncate text-xs font-medium text-slate-400 mt-1">{artist}</p>
					<p class="truncate text-[10px] font-mono text-slate-500 mt-1">{album}</p>
				</div>
			</div>
		</div>
	</Card>
{/if}

<style>
	@keyframes musicBar1 {
		0%, 100% { height: 14px; }
		50% { height: 6px; }
	}
	@keyframes musicBar2 {
		0%, 100% { height: 6px; }
		50% { height: 14px; }
	}
	@keyframes musicBar3 {
		0%, 100% { height: 10px; }
		50% { height: 4px; }
	}
</style>
