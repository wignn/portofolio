import { json } from '@sveltejs/kit';
import { WAKATIME_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	if (!WAKATIME_API_KEY) {
		return json({ error: 'WakaTime API key not configured' }, { status: 500 });
	}

	try {
		const encoded = Buffer.from(WAKATIME_API_KEY).toString('base64');

		const response = await fetch('https://wakatime.com/api/v1/users/current/stats/last_7_days', {
			headers: {
				Authorization: `Basic ${encoded}`
			}
		});

		if (!response.ok) {
			const text = await response.text();
			console.error('WakaTime API error:', response.status, text);
			return json(
				{
					error: 'WakaTime API returned an error',
					status: response.status
				},
				{ status: response.status }
			);
		}

		const data = await response.json();
		const stats = data.data;

		const result = {
			totalTime: stats.human_readable_total || '0 hrs 0 mins',
			dailyAverage: stats.human_readable_daily_average || '0 hrs 0 mins',
			languages: (stats.languages || []).slice(0, 5).map((lang: any) => ({
				name: lang.name,
				time: lang.text,
				percentage: Math.round(lang.percent),
				color: getLanguageColor(lang.name)
			})),
			topProject: stats.projects && stats.projects.length > 0 ? stats.projects[0].name : 'N/A'
		};

		return json(result, {
			headers: {
				'Cache-Control': 'public, s-maxage=1800, max-age=1800'
			}
		});
	} catch (error: any) {
		console.error('WakaTime proxy error:', error);
		return json(
			{
				error: 'Failed to fetch WakaTime stats',
				message: error.message
			},
			{ status: 500 }
		);
	}
};

function getLanguageColor(name: string) {
	const colors: Record<string, string> = {
		JavaScript: '#f1e05a',
		TypeScript: '#3178c6',
		Python: '#3572A5',
		Rust: '#dea584',
		Go: '#00ADD8',
		Dart: '#00B4AB',
		HTML: '#e34c26',
		CSS: '#563d7c',
		SCSS: '#c6538c',
		Java: '#b07219',
		Kotlin: '#A97BFF',
		Swift: '#F05138',
		Ruby: '#701516',
		PHP: '#4F5D95',
		'C#': '#178600',
		'C++': '#f34b7d',
		C: '#555555',
		Shell: '#89e051',
		Bash: '#89e051',
		Lua: '#000080',
		Vue: '#41b883',
		Svelte: '#ff3e00',
		JSON: '#292929',
		YAML: '#cb171e',
		Markdown: '#083fa1',
		SQL: '#e38c00',
		Docker: '#384d54',
		GraphQL: '#e10098'
	};
	return colors[name] || '#6e7681';
}