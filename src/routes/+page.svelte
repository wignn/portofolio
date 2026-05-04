<script lang="ts">
	import { onMount } from 'svelte';
	import { Code2, ChevronRight, Server, BarChart3, AppWindow, Cpu } from 'lucide-svelte';
	import { profileData } from '$lib/data/profile';
	import { projects } from '$lib/data/projects';
	import { useLanyard } from '$lib/runes/lanyard.svelte';
	import { useWeather } from '$lib/runes/weather.svelte';
	import { useGitHubCommits } from '$lib/runes/github.svelte';
	import { reveal } from '$lib/utils/reveal';
	import { cn } from '$lib/utils/cn';
	import { getProjectImage } from '$lib/utils/project-image';

	import Header from '$lib/components/blocks/Header.svelte';
	import Footer from '$lib/components/blocks/Footer.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import DiscordActivityCard from '$lib/components/blocks/DiscordActivityCard.svelte';
	import WeeklyActivity from '$lib/components/blocks/WeeklyActivity.svelte';
	import TechStackCard from '$lib/components/blocks/TechStackCard.svelte';
	import SpotifyCard from '$lib/components/blocks/SpotifyCard.svelte';
	import GitHubContributionGraph from '$lib/components/blocks/GitHubContributionGraph.svelte';
	import ServerInfoCard from '$lib/components/blocks/ServerInfoCard.svelte';
	import GitHubStatsCard from '$lib/components/blocks/GitHubStatsCard.svelte';
	import ProjectMonitorCard from '$lib/components/blocks/ProjectMonitorCard.svelte';

	let currentTime = $state(new Date());
	const lanyard = useLanyard(profileData.discordId);
	const weather = useWeather(profileData.latitude, profileData.longitude);
	const github = useGitHubCommits(profileData.github, 4);

	let projectsRef = $state<HTMLElement | null>(null);
	let aboutRef = $state<HTMLElement | null>(null);

	function scrollToProjects() {
		projectsRef?.scrollIntoView({ behavior: 'smooth' });
	}

	function scrollToAbout() {
		aboutRef?.scrollIntoView({ behavior: 'smooth' });
	}

	onMount(() => {
		const timer = setInterval(() => (currentTime = new Date()), 1000);
		return () => clearInterval(timer);
	});

	const timeString = $derived(
		currentTime.toLocaleTimeString('id-ID', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		})
	);

	function getBadgeColor(color: string): string {
		const colors: Record<string, string> = {
			green: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
			purple: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
			blue: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
			red: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
			orange: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
		};
		return colors[color] || colors.green;
	}
</script>

<Header />

<main class="relative min-h-screen overflow-hidden bg-[#030305] text-slate-300">
	<!-- Noise Texture & Grid -->
	<div class="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
	<div class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_100%_50%_at_50%_50%,black_0%,transparent_80%)]"></div>

	<!-- Premium Deep Space Aurora Blobs -->
	<div class="animate-blob absolute right-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-cyan-600/10 opacity-50 blur-[120px]"></div>
	<div class="animate-blob animation-delay-2000 absolute bottom-[20%] left-[5%] h-[600px] w-[600px] rounded-full bg-indigo-600/10 opacity-50 blur-[120px]"></div>
	<div class="animate-blob animation-delay-4000 absolute left-[40%] top-[40%] h-[400px] w-[400px] rounded-full bg-emerald-600/10 opacity-40 blur-[100px]"></div>

	<div class="container relative z-10 mx-auto px-4 py-12 pt-28">
		<div class="mx-auto max-w-7xl">
			
			<!-- HERO SECTION -->
			<Card class="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01] p-8 shadow-2xl transition-all duration-700 hover:border-cyan-500/20 backdrop-blur-3xl md:p-16 mb-16">
				<!-- Hero Glow -->
				<div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none transition-all duration-700 group-hover:bg-cyan-500/10"></div>
				
				<div class="z-20 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
					<div class="space-y-6">
						<div class="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
							<span class="relative flex h-2 w-2">
							  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
							  <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
							</span>
							Available for new opportunities
						</div>

						<h1 class="text-5xl font-extrabold tracking-tight text-white md:text-7xl leading-tight">
							I'm <br/>
							<span class="bg-gradient-to-br from-slate-100 via-cyan-200 to-indigo-400 bg-clip-text text-transparent">{profileData.name}</span>.
						</h1>

						<p class="text-lg font-medium text-slate-300 md:text-xl border-l-2 border-cyan-500/50 pl-4">
							{profileData.role}
						</p>
						<p class="max-w-md leading-relaxed text-slate-400 text-sm">{profileData.bio}</p>

						<div class="flex flex-wrap gap-4 pt-4">
							<Button
								onclick={scrollToProjects}
								class="cursor-pointer rounded-xl bg-cyan-500 text-slate-950 font-bold px-6 py-3 hover:bg-cyan-400 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center"
							>
								<Code2 class="mr-2 h-4 w-4" />
								Explore Projects
							</Button>

							<Button
								onclick={scrollToAbout}
								class="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105"
							>
								System Status
							</Button>
						</div>
					</div>

					<div class="flex justify-center md:justify-end">
						<div class="relative group/avatar">
							<div class="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 blur-lg transition-all duration-500 group-hover/avatar:from-cyan-500/40 group-hover/avatar:to-indigo-500/40"></div>
							<div class="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b1a] shadow-2xl transition-all duration-500">
								<img
									src={profileData.githubAvatar}
									alt={profileData.name}
									class="h-auto w-full max-w-sm object-cover opacity-90 transition-opacity hover:opacity-100  "
								/>
								<div class="absolute bottom-4 left-4 rounded-xl bg-[#030305]/80 px-4 py-2 text-sm font-mono text-cyan-400 backdrop-blur-md border border-cyan-500/20">
									@{profileData.github}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>

			<!-- DASHBOARD BENTO BOX -->
			<div class="mb-24">
				<div class="mb-8 flex items-center gap-3" use:reveal={{ delay: '0ms' }}>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
						<Server class="h-4 w-4 text-slate-300" />
					</div>
					<h3 class="text-sm uppercase tracking-[0.2em] text-slate-400 font-bold">System Dashboard</h3>
					<div class="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
					<!-- Top Row: Server Monitor (Full Width) -->
					<div class="lg:col-span-4" use:reveal={{ delay: '100ms' }}>
						<ServerInfoCard />
					</div>

					<!-- Column 1 & 2: Wide Cards -->
					<div class="lg:col-span-2 flex flex-col gap-4 sm:gap-6" use:reveal={{ delay: '200ms' }}>
						<ProjectMonitorCard />
						<TechStackCard />
					</div>

					<div class="lg:col-span-1 flex flex-col gap-4 sm:gap-6" use:reveal={{ delay: '300ms' }}>
						<WeeklyActivity />
						<DiscordActivityCard lanyard={lanyard.data} />
					</div>

					<div class="lg:col-span-1 flex flex-col gap-4 sm:gap-6" use:reveal={{ delay: '400ms' }}>
						<GitHubStatsCard />
						<SpotifyCard lanyard={lanyard.data} />
					</div>

					<div class="lg:col-span-4" use:reveal={{ delay: '500ms' }}>
						<GitHubContributionGraph username={profileData.github} />
					</div>
				</div>
			</div>

			<!-- SECTION 4: PROJECTS -->
			<div id="projects" bind:this={projectsRef} class="mb-16">
				<div class="mb-6 flex items-center gap-3" use:reveal={{ delay: '0ms' }}>
					<AppWindow class="h-5 w-5 text-rose-400" />
					<h3 class="text-sm uppercase tracking-[0.2em] text-slate-500 font-bold">Featured Projects</h3>
					<div class="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" use:reveal={{ delay: '100ms' }}>
					{#each projects as project}
						<a href={project.url} target="_blank" rel="noopener noreferrer" class="block group">
							<Card
								class="flex flex-col h-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/30 hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.15)]"
							>
								<div class="relative h-48 overflow-hidden bg-white/5">
									<img
										src={getProjectImage(project)}
										alt={project.title}
										class="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
										loading="lazy"
										onerror={(e) => {
											(e.currentTarget as HTMLImageElement).src = `https://placehold.co/600x400/0b0b1a/ffffff?text=${encodeURIComponent(project.title)}`;
										}}
									/>
									<div class="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-transparent opacity-80"></div>
									<div class={cn('absolute bottom-4 left-4 rounded-full px-3 py-1 text-[10px] font-bold tracking-wide uppercase', getBadgeColor(project.badge.color))}>
										{project.badge.text}
									</div>
								</div>
								
								<div class="flex flex-col flex-1 p-6">
									<h3 class="mb-2 text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors duration-300">
										{project.title}
									</h3>
									<p class="mb-6 flex-1 text-sm text-slate-400 leading-relaxed">
										{project.description}
									</p>
									
									<div class="mb-6 flex flex-wrap gap-2">
										{#each project.tags as tag}
											<span class="rounded-md border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] font-mono text-slate-400 group-hover:border-white/10 transition-colors">
												{tag}
											</span>
										{/each}
									</div>
									
									<div class="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
										<button
											onclick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												window.open(project.github, '_blank');
											}}
											class="flex items-center gap-2 text-slate-500 transition-colors hover:text-white"
										>
											<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
											</svg>
											<span class="text-xs font-medium">Source</span>
										</button>
										<span class="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
											{project.action.text}
											<ChevronRight class="h-4 w-4" />
										</span>
									</div>
								</div>
							</Card>
						</a>
					{/each}
				</div>
			</div>

			<Footer />
		</div>
	</div>
</main>

<style>
	@keyframes blob {
		0% { transform: translate(0px, 0px) scale(1); }
		33% { transform: translate(40px, -60px) scale(1.15); }
		66% { transform: translate(-30px, 30px) scale(0.9); }
		100% { transform: translate(0px, 0px) scale(1); }
	}
	.animate-blob {
		animation: blob 15s ease-in-out infinite alternate;
	}
	.animation-delay-2000 {
		animation-delay: 3s;
	}
	.animation-delay-4000 {
		animation-delay: 6s;
	}
</style>
