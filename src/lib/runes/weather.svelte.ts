import { browser } from '$app/environment';

export function useWeather(lat: number, lon: number) {
	let temperature = $state<number | null>(null);

	async function fetchWeather() {
		try {
			const res = await fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
			);
			const data = await res.json();
			temperature = data.current_weather?.temperature || null;
		} catch (err) {
			console.error('Weather fetch error', err);
			temperature = null;
		}
	}

	if (browser) {
		fetchWeather();
	}

	return {
		get temperature() {
			return temperature;
		}
	};
}
