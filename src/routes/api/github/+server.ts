import { json } from '@sveltejs/kit';
import { GITHUB_TOKEN } from '$env/static/private';
import type { RequestHandler } from './$types';

// In-memory cache
const cache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export const GET: RequestHandler = async ({ url }) => {
	const username = url.searchParams.get('username') || 'wignn';
	const type = url.searchParams.get('type') || 'commits';
	const cacheKey = `${username}-${type}`;

	const cached = cache.get(cacheKey);
	if (cached && cached.expires > Date.now()) {
		return json(cached.data);
	}

	try {
		const headers: HeadersInit = {
			Accept: 'application/vnd.github.v3+json',
			'User-Agent': 'SvelteKit-Porto'
		};

		if (GITHUB_TOKEN && GITHUB_TOKEN !== 'your_personal_access_token_here') {
			headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
		}

		let resultData;

		if (type === 'stats') {
			const [reposRes, eventsRes] = await Promise.all([
				fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers }),
				fetch(`https://api.github.com/users/${username}/events?per_page=100`, { headers })
			]);

			const repos = await reposRes.json();
			const events = await eventsRes.json();
			resultData = { repos, events };
		} else {
			// Default to commits-related repos
			const reposRes = await fetch(
				`https://api.github.com/users/${username}/repos?sort=pushed&per_page=10`,
				{ headers }
			);
			const repos = await reposRes.json();
			
			const allCommits = [];
			const recentRepos = Array.isArray(repos) ? repos.slice(0, 5) : [];

			for (const repo of recentRepos) {
				const commitsRes = await fetch(
					`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=3`,
					{ headers }
				);
				if (commitsRes.ok) {
					const repoCommits = await commitsRes.json();
					allCommits.push({ repo: repo.name, commits: repoCommits });
				}
			}
			resultData = allCommits;
		}

		cache.set(cacheKey, {
			data: resultData,
			expires: Date.now() + CACHE_TTL
		});

		return json(resultData);
	} catch (error) {
		console.error('GitHub API Proxy Error:', error);
		return json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
	}
};
