const entries = [
	{
		id: 'orca-enterprise',
		name: 'ORCA Enterprise',
		featured: true,
		category: 'Windows market terminal',
		description:
			'A Windows desktop market terminal with cross-asset quotes, charts, order book depth, news, economic releases, and dedicated research views.',
		technologies: ['Windows desktop', 'HTTPS', 'WebSocket'],
		links: [{ label: 'Website', href: 'https://orca-enterprise.wign.dev/' }]
	},
	{
		id: 'orca-alpha',
		name: 'ORCA Alpha',
		featured: false,
		category: 'Desktop market research',
		description:
			'Desktop market research with charts, watchlists, news, economic calendar, and Kronos Forecast.',
		technologies: ['PIA SDK', 'Desktop application', 'Kronos Forecast'],
		links: [
			{ label: 'Website', href: 'https://orca.wign.dev/' },
			{ label: 'Desktop releases', href: 'https://github.com/wignn/pia-desktop/releases/latest' }
		]
	},
	{
		id: 'pia-engine',
		name: 'PIA Engine',
		featured: false,
		category: 'Event-driven backend',
		description:
			'Event-driven market data, news, and analytics platform with REST and real-time WebSocket delivery.',
		technologies: ['Rust', 'NATS JetStream', 'ClickHouse', 'WebSocket'],
		links: [
			{ label: 'Open terminal', href: 'https://terminal.wign.dev/' },
			{ label: 'Website', href: 'https://pia.wign.dev/' },
			{ label: 'Source code', href: 'https://github.com/wignn/pia-engine' }
		]
	},
	{
		id: 'novelhive',
		name: 'NovelHive',
		featured: false,
		category: 'Microservice platform',
		description:
			'A reading platform with Go and Rust services, reading progress, content delivery, and Elasticsearch search.',
		technologies: ['Go', 'Rust', 'gRPC', 'Elasticsearch'],
		links: [
			{ label: 'Live website', href: 'https://nhive.wign.dev/' },
			{ label: 'Source code', href: 'https://github.com/wignn/nhive' },
			{ label: 'Architecture', href: 'https://github.com/wignn/nhive#architecture' }
		]
	},
	{
		id: 'lyra',
		name: 'Lyra',
		featured: false,
		category: 'Discord music',
		description: 'Self-hostable Discord music in Rust. Fair queues, audio tuning, and autoplay.',
		technologies: ['Rust', 'Twilight', 'Lavalink'],
		links: [
			{ label: 'Website', href: 'https://lyra.wign.dev/' },
			{ label: 'Source code', href: 'https://github.com/wignn/lyra' }
		]
	},
	{
		id: 'nio',
		name: 'Nio',
		featured: false,
		category: 'Server management',
		description:
			'Discord server management workspace with Next.js dashboard, NestJS orchestration, and Rust services.',
		technologies: ['Next.js', 'NestJS', 'Rust', 'gRPC'],
		links: [
			{ label: 'Website', href: 'https://hazard.wign.dev/' },
			{ label: 'Source code', href: 'https://github.com/lampu-hazard/nio' }
		]
	},
	{
		id: 'david-booster-service',
		name: 'David Booster Service',
		featured: false,
		category: 'Game service storefront',
		description:
			'Game service storefront with catalogues, packages, transparent pricing, and WhatsApp ordering.',
		technologies: [],
		links: [{ label: 'Live website', href: 'https://www.david-booster-service.my.id/' }]
	},
	{
		id: 'crypt',
		name: 'Crypt',
		featured: false,
		category: 'Command-line tool',
		description: 'A Rust CLI for file encryption with ChaCha20-Poly1305 and Argon2 key derivation.',
		technologies: ['Rust', 'ChaCha20-Poly1305', 'Argon2'],
		links: [{ label: 'Source code', href: 'https://github.com/wignn/crypt' }]
	},
	{
		id: 'pia-sdk',
		name: 'PIA SDK',
		featured: false,
		category: 'Developer tooling',
		description:
			'TypeScript and Python clients for market-data APIs, real-time streams, auth, and typed errors.',
		technologies: ['TypeScript', 'Python', 'REST', 'WebSocket'],
		links: [
			{ label: 'npm', href: 'https://www.npmjs.com/package/@piaa/sdk' },
			{ label: 'PyPI', href: 'https://pypi.org/project/piaa-sdk/' },
			{ label: 'Source code', href: 'https://github.com/wignn/pia-sdk' }
		]
	}
];

const screenshotSources = {
	'orca-enterprise': 'https://orca-enterprise.wign.dev/',
	'orca-alpha': 'https://orca.wign.dev/',
	'pia-engine': 'https://terminal.wign.dev/',
	novelhive: 'https://nhive.wign.dev/',
	lyra: 'https://lyra.wign.dev/',
	nio: 'https://hazard.wign.dev/',
	'david-booster-service': 'https://www.david-booster-service.my.id/',
	crypt: 'https://github.com/wignn/crypt',
	'pia-sdk': 'https://github.com/wignn/pia-sdk'
};

export const projects = entries.map((project) => ({
	...project,
	screenshot: {
		src: `/screenshots/${project.id}.jpg`,
		alt: `${project.name} ${['crypt', 'pia-sdk'].includes(project.id) ? 'GitHub repository' : 'website'} screenshot`,
		source: screenshotSources[project.id],
		label: ['crypt', 'pia-sdk'].includes(project.id)
			? 'Repository screenshot'
			: 'Live website screenshot'
	}
}));
