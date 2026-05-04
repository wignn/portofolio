import { browser } from '$app/environment';
import type { LanyardData } from '$lib/types';

export function useLanyard(discordId: string) {
	let data = $state<LanyardData | null>(null);

	if (browser) {
		let ws: WebSocket | null = null;
		let reconnectTimer: any = null;
		let backoffAttempts = 0;
		let pollTimer: any = null;
		const MAX_BACKOFF_ATTEMPTS = 5;
		let heartbeatTimer: any = null;

		const startPolling = () => {
			if (pollTimer) return;
			pollTimer = setInterval(async () => {
				try {
					const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
					if (!res.ok) return;
					const json = await res.json();
					if (json && json.data) data = json.data;
				} catch (err) {
					console.error('Lanyard polling error', err);
				}
			}, 15000);
		};

		const stopPolling = () => {
			if (pollTimer) {
				clearInterval(pollTimer);
				pollTimer = null;
			}
		};

		const getBackoffDelay = () => {
			const delay = Math.min(30000, 1000 * 2 ** backoffAttempts);
			backoffAttempts = Math.min(backoffAttempts + 1, 10);
			return delay;
		};

		const connect = () => {
			try {
				ws = new WebSocket('wss://api.lanyard.rest/socket');
			} catch (err) {
				console.error('WS create error', err);
				const delay = getBackoffDelay();
				reconnectTimer = setTimeout(() => connect(), delay);
				return;
			}

			ws.onopen = () => {
				backoffAttempts = 0;
				stopPolling();
			};

			ws.onmessage = (event) => {
				try {
					const json = JSON.parse(event.data);
					if (json.op === 1 && json.d && json.d.heartbeat_interval) {
						const intervalMs = json.d.heartbeat_interval;
						if (heartbeatTimer) clearInterval(heartbeatTimer);
						heartbeatTimer = setInterval(() => {
							try {
								ws?.send(JSON.stringify({ op: 3, d: null }));
							} catch (err) {
								console.error('WS heartbeat send error', err);
							}
						}, intervalMs);
						try {
							ws?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: discordId } }));
						} catch (err) {
							console.error('WS send Initialize error', err);
						}
						return;
					}
					const payload = json.op === 0 && json.t ? json : json;
					if (payload.t === 'INIT_STATE' || payload.t === 'PRESENCE_UPDATE') {
						data = payload.d;
					}
				} catch (err) {
					console.error('WS message parse error', err);
				}
			};

			ws.onclose = () => {
				if (heartbeatTimer) {
					clearInterval(heartbeatTimer);
					heartbeatTimer = null;
				}
				if (backoffAttempts >= MAX_BACKOFF_ATTEMPTS) {
					startPolling();
					return;
				}
				const delay = getBackoffDelay();
				reconnectTimer = setTimeout(() => connect(), delay);
			};
		};

		connect();
	}

	return {
		get data() {
			return data;
		}
	};
}
