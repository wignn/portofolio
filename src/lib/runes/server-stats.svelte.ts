import { browser } from '$app/environment';
import { PUBLIC_SERVER_MONITOR_WS } from '$env/static/public';
import type { ServerStats } from '$lib/types';

const FALLBACK_DATA: ServerStats = {
	hostname: '—',
	uptime: '—',
	uptimeSeconds: 0,
	cpu: { model: '—', cores: 0, usagePercent: 0 },
	memory: { total: '—', used: '—', usagePercent: 0 },
	disk: { total: '—', used: '—', usagePercent: 0 },
	network: { rx: '—', tx: '—' },
	os: '—',
	processes: 0,
	loadAverage: '0%',
	status: 'offline',
	lastUpdated: null
};

export function useServerStats() {
	let data = $state<ServerStats>(FALLBACK_DATA);
	let connected = $state(false);
	let socket: WebSocket | null = null;
	let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
	let backoff = 0;

	const getWsUrl = () => {
		if (PUBLIC_SERVER_MONITOR_WS) {
			const base = PUBLIC_SERVER_MONITOR_WS.replace(/\/+$/, '');
			return base.includes('/ws/stats') ? base : `${base}/ws/stats`;
		}
		if (browser) {
			const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
			return `${proto}//${window.location.hostname}:8000/ws/stats`;
		}
		return 'ws://localhost:8000/ws/stats';
	};

	const connect = () => {
		if (!browser || socket?.readyState === WebSocket.OPEN) return;

		try {
			socket = new WebSocket(getWsUrl());

			socket.onopen = () => {
				connected = true;
				backoff = 0;
			};

			socket.onmessage = (event) => {
				try {
					const parsed = JSON.parse(event.data);
					data = { ...parsed, status: 'online' };
				} catch (err) {
					console.error('Server stats parse error:', err);
				}
			};

			socket.onclose = () => {
				connected = false;
				data = { ...data, status: 'offline' };
				socket = null;

				const delay = Math.min(30000, 1000 * 2 ** backoff);
				backoff = Math.min(backoff + 1, 10);
				reconnectTimer = setTimeout(connect, delay);
			};

			socket.onerror = () => {
				// handled by onclose
			};
		} catch (err) {
			console.error('Server stats WS error:', err);
			const delay = Math.min(30000, 1000 * 2 ** backoff);
			backoff = Math.min(backoff + 1, 10);
			reconnectTimer = setTimeout(connect, delay);
		}
	};

	if (browser) {
		$effect(() => {
			connect();
			return () => {
				if (reconnectTimer) clearTimeout(reconnectTimer);
				if (socket) {
					socket.onclose = null; // Prevent reconnect on explicit close
					socket.close();
				}
			};
		});
	}

	return {
		get data() { return data; },
		get connected() { return connected; }
	};
}