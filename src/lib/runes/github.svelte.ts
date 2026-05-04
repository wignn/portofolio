import type { GitHubCommit } from '$lib/types';
import { browser } from '$app/environment';
export function useGitHubCommits(username = 'wignn', limit = 5) {
	let commits = $state<GitHubCommit[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	const formatRelativeTime = (date: Date): string => {
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
		return date.toLocaleDateString();
	};

	async function fetchCommits() {
		try {
			loading = true;

			const response = await fetch(`/api/github?username=${username}&type=commits`);

			if (!response.ok) {
				throw new Error(`Failed to fetch from proxy: ${response.status}`);
			}

			const repoData = await response.json();
			const allCommits: any[] = [];

			if (Array.isArray(repoData)) {
				repoData.forEach((item: any) => {
					const repoName = item.repo;
					const repoCommits = item.commits;

					if (Array.isArray(repoCommits)) {
						repoCommits.forEach((commit: any) => {
							if (commit.author?.login === username || commit.committer?.login === username) {
								allCommits.push({
									sha: commit.sha.substring(0, 7),
									message: (commit.commit?.message || 'No message').split('\n')[0],
									repo: repoName,
									timestamp: new Date(
										commit.commit?.author?.date || commit.commit?.committer?.date
									),
									url: commit.html_url
								});
							}
						});
					}
				});
			}

			commits = allCommits
				.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
				.slice(0, limit)
				.map((c) => ({
					...c,
					relativeTime: formatRelativeTime(c.timestamp)
				}));

			error = null;
		} catch (err: any) {
			console.error('Error fetching commits:', err);
			error = err.message;
			commits = [];
		} finally {
			loading = false;
		}
	}

	if (browser) {
		fetchCommits();
	}

	return {
		get commits() {
			return commits;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		}
	};
}
