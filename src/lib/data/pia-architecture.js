export const piaNodes = [
	// Tier 1 (z = -4.3, y = 1.65) — External Data Providers
	{
		id: 'sources',
		title: 'External providers',
		subtitle: 'Market feeds · RSS/news · FRED · COT · SEC · central banks',
		shortSubtitle: 'Feeds · RSS · FRED · COT · SEC',
		tier: 'source',
		kind: 'bus',
		pos: [0, 1.65, -4.3],
		size: [4.2, 0.36, 0.82],
		color: 0x7b9365
	},
	// Tier 2 (z = -2.85, y = 1.15) — Ingestion Gateways
	{
		id: 'ingest',
		title: 'ingestion-gateway',
		subtitle: 'Market feed normalization',
		shortSubtitle: 'Feed normalization',
		tier: 'ingest',
		kind: 'service',
		pos: [-2.5, 1.15, -2.85],
		size: [1.85, 0.42, 0.92],
		color: 0x93b174
	},
	{
		id: 'macro',
		title: 'macro-feed',
		subtitle: 'Go macro collectors',
		shortSubtitle: 'Go macro collectors',
		tier: 'ingest',
		kind: 'service',
		pos: [2.5, 1.15, -2.85],
		size: [1.85, 0.42, 0.92],
		color: 0x93b174
	},
	// Tier 3 (z = -1.35, y = 0.65) — Event Backbone
	{
		id: 'nats',
		title: 'NATS JetStream',
		subtitle: 'Durable event backbone',
		shortSubtitle: 'Durable event backbone',
		tier: 'backbone',
		kind: 'core',
		pos: [0, 0.65, -1.35],
		size: [2.3, 0.56, 1.25],
		color: 0xc5dba6
	},
	// Tier 4 (z = 0.25, y = 0.1) — Domain Services & Python Runtime
	{
		id: 'sink',
		title: 'sink-connector',
		subtitle: 'Macro event materialization',
		shortSubtitle: 'Macro materialization',
		tier: 'service',
		kind: 'service',
		pos: [-4.9, 0.1, 0.25],
		size: [1.65, 0.44, 0.92],
		color: 0x5c774d
	},
	{
		id: 'market',
		title: 'market-data',
		subtitle: 'Prices · candles · rates · fear/greed',
		shortSubtitle: 'Prices · candles · rates',
		tier: 'service',
		kind: 'service',
		pos: [-2.45, 0.1, 0.25],
		size: [1.65, 0.44, 0.92],
		color: 0x73915d
	},
	{
		id: 'news',
		title: 'news-service',
		subtitle: 'News · calendar · macro dashboard',
		shortSubtitle: 'News · calendar · macro',
		tier: 'service',
		kind: 'service',
		pos: [0, 0.1, 0.25],
		size: [1.65, 0.44, 0.92],
		color: 0x73915d
	},
	{
		id: 'intel',
		title: 'intelligence-service',
		subtitle: 'Analysis · sentiment · Why Move',
		shortSubtitle: 'Analysis · Why Move',
		tier: 'service',
		kind: 'service',
		pos: [2.45, 0.1, 0.25],
		size: [1.65, 0.44, 0.92],
		color: 0x84a369
	},
	{
		id: 'analyzer',
		title: 'analyzer',
		subtitle: 'Python model runtime',
		shortSubtitle: 'Python model runtime',
		tier: 'compute',
		kind: 'service',
		pos: [4.9, 0.1, 0.25],
		size: [1.65, 0.44, 0.92],
		color: 0x9bb97c
	},
	// Tier 5 (z = 1.9, y = -0.45) — Storage Cluster (left) & Access Gateways (right)
	{
		id: 'ch',
		title: 'ClickHouse',
		subtitle: 'Ticks · OHLCV · analytical reads',
		shortSubtitle: 'Ticks · OHLCV reads',
		tier: 'storage',
		kind: 'store',
		pos: [-4.8, -0.45, 1.9],
		size: [1.65, 0.44, 0.95],
		color: 0x3b5541
	},
	{
		id: 'pg',
		title: 'PostgreSQL',
		subtitle: 'SaaS · news · materialized state',
		shortSubtitle: 'SaaS · materialized state',
		tier: 'storage',
		kind: 'store',
		pos: [-2.4, -0.45, 1.9],
		size: [1.75, 0.44, 0.95],
		color: 0x436049
	},
	{
		id: 'redis',
		title: 'Redis',
		subtitle: 'Cache · quotas · tickets · hot state',
		shortSubtitle: 'Cache · quotas · hot state',
		tier: 'storage',
		kind: 'store',
		pos: [0, -0.45, 1.9],
		size: [1.65, 0.42, 0.92],
		color: 0x4d6d53
	},
	{
		id: 'api',
		title: 'api-gateway',
		subtitle: 'Authenticated REST proxy',
		shortSubtitle: 'Authenticated REST proxy',
		tier: 'gateway',
		kind: 'gateway',
		pos: [2.45, -0.45, 1.9],
		size: [1.7, 0.44, 0.92],
		color: 0xa7c584
	},
	{
		id: 'realtime',
		title: 'realtime-gateway',
		subtitle: 'Authenticated WebSocket fanout',
		shortSubtitle: 'WebSocket fanout',
		tier: 'gateway',
		kind: 'gateway',
		pos: [4.85, -0.45, 1.9],
		size: [1.7, 0.44, 0.92],
		color: 0xb7d396
	},
	// Tier 6 (z = 3.5, y = -1.0) — Client Delivery Surfaces
	{
		id: 'pia',
		title: 'pia',
		subtitle: 'Next.js portal/admin surface',
		shortSubtitle: 'Next.js portal/admin',
		tier: 'client',
		kind: 'client',
		pos: [-2.8, -1.0, 3.5],
		size: [1.7, 0.4, 0.88],
		color: 0x627c54
	},
	{
		id: 'web',
		title: 'public-web',
		subtitle: 'SvelteKit market dashboard',
		shortSubtitle: 'SvelteKit dashboard',
		tier: 'client',
		kind: 'client',
		pos: [0.6, -1.0, 3.5],
		size: [1.8, 0.4, 0.88],
		color: 0x739162
	},
	{
		id: 'bot',
		title: 'bot',
		subtitle: 'Discord delivery',
		shortSubtitle: 'Discord delivery',
		tier: 'client',
		kind: 'client',
		pos: [3.9, -1.0, 3.5],
		size: [1.65, 0.4, 0.88],
		color: 0x627c54
	}
];

export const piaEdges = [
	['sources', 'ingest', 'ingest'],
	['sources', 'macro', 'ingest'],
	['ingest', 'nats', 'stream'],
	['macro', 'nats', 'stream'],
	['nats', 'market', 'stream'],
	['nats', 'news', 'stream'],
	['nats', 'intel', 'stream'],
	['nats', 'sink', 'stream'],
	['sink', 'pg', 'store'],
	['market', 'pg', 'store'],
	['market', 'ch', 'store'],
	['news', 'pg', 'store'],
	['intel', 'pg', 'store'],
	['intel', 'analyzer', 'compute'],
	['api', 'market', 'query'],
	['api', 'news', 'query'],
	['api', 'intel', 'query'],
	['realtime', 'web', 'delivery'],
	['api', 'web', 'delivery'],
	['api', 'pia', 'delivery'],
	['api', 'bot', 'delivery'],
	['realtime', 'bot', 'delivery'],
	['pg', 'redis', 'cache']
];
