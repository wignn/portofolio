import { browser } from '$app/environment';
import type { GitHubStats } from '$lib/types';

export function useGitHubStats(username = 'wignn') {
	let stats = $state<GitHubStats | null>(null);
	let loading = $state(true);

	async function fetchStats() {
		try {
			const response = await fetch(`/api/github?username=${username}&type=stats`);
			
			if (!response.ok) {
				throw new Error(`Failed to fetch from proxy: ${response.status}`);
			}

			const { repos, events } = await response.json();

			const totalStars = Array.isArray(repos) ? repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0) : 0;
			const commits = Array.isArray(events) ? events.filter((e: any) => e.type === 'PushEvent').length * 10 : 0;

			const languages: Record<string, number> = {};
			if (Array.isArray(repos)) {
				repos.forEach((repo: any) => {
					if (repo.language) {
						languages[repo.language] = (languages[repo.language] || 0) + 1;
					}
				});
			}

			const languageArray = Object.entries(languages)
				.map(([name, count]) => ({ name, count }))
				.sort((a, b) => b.count - a.count)
				.slice(0, 5);

			stats = {
				stars: totalStars,
				commits: commits || 1170,
				prs: 40,
				issues: 2,
				languages:
					languageArray.length > 0
						? languageArray
						: [
								{ name: 'JavaScript', count: 68 },
								{ name: 'HTML', count: 7 },
								{ name: 'CSS', count: 6 }
							]
			};
		} catch {
			stats = {
				stars: 211,
				commits: 1170,
				prs: 40,
				issues: 2,
				languages: [
					{ name: 'JavaScript', count: 68 },
					{ name: 'HTML', count: 7 },
					{ name: 'CSS', count: 6 }
				]
			};
		} finally {
			loading = false;
		}
	}

	if (browser) {
		fetchStats();
	}

	return {
		get stats() {
			return stats;
		},
		get loading() {
			return loading;
		}
	};
}
