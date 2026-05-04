<script lang="ts">
	import { GitBranch as Github, Link2 as Linkedin, Mail } from 'lucide-svelte';
	import { profileData } from '$lib/data/profile';

	const socials = [
		{ Icon: Github, href: `https://github.com/${profileData.github}`, label: 'GitHub' },
		{ Icon: Linkedin, href: 'https://www.linkedin.com/in/tigfir-agna-fatur/', label: 'LinkedIn' },
		{ Icon: Mail, href: `mailto:${profileData.email}`, label: 'Email' }
	];
</script>

<footer
	class="group mt-24 border-t border-white/10 bg-gradient-to-t from-black/40 to-transparent backdrop-blur-md"
>
	<div class="container mx-auto px-4 py-16">
		<div class="mx-auto max-w-6xl">
			<div class="mb-8 flex flex-col items-center justify-between gap-8 md:flex-row">
				<div>
					<h3 class="mb-2 text-xl font-bold text-white">Let's Connect</h3>
					<p class="text-white/60">Feel free to reach out for collaborations</p>
				</div>
				<div class="flex items-center gap-6">
					{#each socials as { Icon, href, label }}
						<a
							{href}
							target={href.startsWith('mailto') ? undefined : '_blank'}
							rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
							class="group/link rounded-lg p-2 text-white/60 transition-all duration-300 hover:bg-white/10 hover:text-white"
							title={label}
						>
							<Icon class="h-6 w-6" />
						</a>
					{/each}
				</div>
			</div>
			<div class="border-t border-white/10 pt-8 text-center text-sm text-white/50">
				<p>&copy; {new Date().getFullYear()} All rights reserved. Built with passion.</p>
			</div>
		</div>
	</div>
</footer>
