import { profileData } from '$lib/data/profile';

export interface Project {
	title: string;
	description: string;
	url: string;
	github: string;
	localImage?: string;
	tags: string[];
	badge: {
		text: string;
		color: 'green' | 'purple' | 'blue' | 'red' | 'orange';
	};
	action: {
		text: string;
		icon: 'external' | 'download';
	};
}

export const projects: Project[] = [
	{
		title: 'Nhive',
		description:
			'A web novel reading platform with modern UI, chapter reading, bookmarks, and user authentication.',
		url: 'https://novel-hive.vercel.app/',
		github: 'https://github.com/wignn/nhive',
		localImage: '/nhive.png',
		tags: ['Svelte', 'TypeScript', 'Tailwind CSS', 'Microservice', 'rust', 'go', 'redis', 'postgres', 'elasticsearch', 'nats', 'gRPC'],
		badge: { text: 'Web App', color: 'green' },
		action: { text: 'View Demo', icon: 'external' }
	},
	{
		title: 'Nhive Mobile',
		description:
			'A mobile novel reading app for Android with offline support, push notifications, and a comfortable reading experience.',
		url: 'https://github.com/wignn/nhive-mobile/releases',
		github: 'https://github.com/wignn/nhive-mobile',
		localImage: '/nhive-mobile.jpg',
		tags: ['Flutter', 'Dart', 'Android', 'Firebase', 'CI/CD'],
		badge: { text: 'Android APK', color: 'purple' },
		action: { text: 'Download APK', icon: 'download' }
	},
	{
		title: 'David Booster Service',
		description: 'A game boosting service website with a modern look and an easy ordering system.',
		url: 'https://www.david-booster-service.my.id/',
		github: 'https://github.com/wignn',
		localImage: '/bosting.png',
		tags: ['Web', 'Service', 'Gaming'],
		badge: { text: 'Website', color: 'blue' },
		action: { text: 'Visit Website', icon: 'external' }
	},
	{
		title: 'Storage',
		description:
			'A cloud file storage app with easy upload, download, and file management features.',
		url: 'https://storage-zeta-amber.vercel.app/',
		localImage: '/storage.png',
		github: 'https://github.com/wignn/Storage',
		tags: ['Next.js', 'TypeScript', 'Cloud Storage'],
		badge: { text: 'Web App', color: 'orange' },
		action: { text: 'View Demo', icon: 'external' }
	},
	{
		title: 'fio ',
		description:
			'A multifunctional Discord bot featuring real-time forex news, live price tracking, and customizable alerts.',
		url: 'https://fio.wign.dev',
		localImage: '/fio.png',
		github: 'https://github.com/wignn/atlsd',
		tags: ['rust', 'go', 'Typescript', 'websocket', 'redis', 'docker', 'CI/CD'],
		badge: { text: 'Website', color: 'blue' },
		action: { text: 'Visit Website', icon: 'external' }
	},
	
	{
		title: 'lyra',
		description:
			'A multifunctional Discord bot featuring play music.',
		url: 'https://lyra.wign.dev',
		localImage: '/lyra.png',
		github: 'https://github.com/wignn/lyra',
		tags: ['rust', 'lavalink', 'serenity', 'docker', 'CI/CD'],
		badge: { text: 'Website', color: 'blue' },
		action: { text: 'Visit Website', icon: 'external' }
	}
];
