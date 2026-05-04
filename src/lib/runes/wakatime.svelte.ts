import { browser } from '$app/environment';
import type { WakaTimeData } from '$lib/types';

const FALLBACK_DATA: WakaTimeData = {
	totalTime: '-- hrs -- mins',
	dailyAverage: '-- hrs -- mins',
	languages: [],
	topProject: 'N/A'
};

export function useWakaTime() {
	let data = $state<WakaTimeData>(FALLBACK_DATA);
	let loading = $state(true);
	let error = $state<string | null>(null);

	async function fetchStats() {
		try {
			loading = true;
			error = null;

			const res = await fetch('/api/wakatime');

			if (!res.ok) {
				throw new Error(`HTTP ${res.status}`);
			}

			const json = await res.json();
			data = json;
		} catch (err: any) {
			console.error('Failed to fetch WakaTime stats:', err);
			error = err.message;
			data = FALLBACK_DATA;
		} finally {
			loading = false;
		}
	}

	if (browser) {
		fetchStats();
	} else {
		loading = false; 
	}

	return {
		get data() { return data; },
		get loading() { return loading; },
		get error() { return error; }
	};
}