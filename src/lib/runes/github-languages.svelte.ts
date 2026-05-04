import { browser } from '$app/environment';
import type { LanguageStats } from '$lib/types';

const getLanguageColor = (language: string): string => {
	const colors: Record<string, string> = {
		JavaScript: '#f1e05a',
		TypeScript: '#3178c6',
		Python: '#3572A5',
		Rust: '#dea584',
		Go: '#00ADD8',
		Java: '#b07219',
		'C++': '#f34b7d',
		C: '#555555',
		'C#': '#178600',
		PHP: '#4F5D95',
		Ruby: '#701516',
		Swift: '#F05138',
		Kotlin: '#A97BFF',
		Dart: '#00B4AB',
		HTML: '#e34c26',
		CSS: '#563d7c',
		SCSS: '#c6538c',
		Vue: '#41b883',
		Svelte: '#ff3e00',
		Shell: '#89e051',
		Dockerfile: '#384d54',
		Makefile: '#427819',
		Lua: '#000080',
		Elixir: '#6e4a7e'
	};
	return colors[language] || '#6e7681';
};

export function useGitHubLanguages(username = 'wignn') {
	let languages = $state<LanguageStats[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	async function fetchLanguages() {
		try {
			loading = true;
			const reposResponse = await fetch(
				`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
			);

			if (!reposResponse.ok) {
				throw new Error('Failed to fetch GitHub repos');
			}

			const repos = await reposResponse.json();
			const languageCounts: Record<string, number> = {};

			for (const repo of repos) {
				if (repo.language) {
					languageCounts[repo.language] = (languageCounts[repo.language] || 0) + repo.size;
				}
			}

			const totalSize = Object.values(languageCounts).reduce((a, b) => a + b, 0);

			languages = Object.entries(languageCounts)
				.map(([name, size]) => ({
					name,
					percentage: Math.round((size / totalSize) * 100),
					color: getLanguageColor(name)
				}))
				.sort((a, b) => b.percentage - a.percentage)
				.slice(0, 8);

			error = null;
		} catch (err: any) {
			console.error('GitHub languages fetch error:', err);
			error = err.message;
		} finally {
			loading = false;
		}
	}

	if (browser) {
		fetchLanguages();
	}

	return {
		get languages() {
			return languages;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		}
	};
}
