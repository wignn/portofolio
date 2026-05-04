import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const FALLBACK = {
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

export const GET: RequestHandler = async () => {
	const backendUrl = env.BACKEND_URL ?? env.REACT_APP_BACKEND_URL;

	if (!backendUrl) {
		return json(FALLBACK, { status: 200 });
	}

	try {
		const url = backendUrl.replace(/\/+$/, '');
		const response = await fetch(`${url}/stats`);

		if (!response.ok) {
			return json(FALLBACK, { status: 200 });
		}

		const data = await response.json();
		return json({ ...data, status: 'online' });
	} catch {
		return json(FALLBACK, { status: 200 });
	}
};
