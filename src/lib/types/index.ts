export interface DiscordUser {
	id: string;
	username: string;
	avatar: string;
}

export interface DiscordActivity {
	type: number;
	name: string;
	details?: string;
	state?: string;
	application_id?: string;
	assets?: {
		large_image?: string;
		large_text?: string;
		small_image?: string;
		small_text?: string;
	};
}

export interface SpotifyData {
	album_art_url: string;
	song: string;
	artist: string;
	album: string;
}

export interface LanyardData {
	discord_status: 'online' | 'idle' | 'dnd' | 'offline';
	discord_user: DiscordUser;
	activities: DiscordActivity[];
	listening_to_spotify: boolean;
	spotify?: SpotifyData;
}

export interface GitHubCommit {
	sha: string;
	message: string;
	repo: string;
	timestamp: Date;
	url: string;
	relativeTime: string;
}

export interface LanguageStats {
	name: string;
	percentage: number;
	color: string;
}

export interface GitHubStats {
	stars: number;
	commits: number;
	prs: number;
	issues: number;
	languages: { name: string; count: number }[];
}

export interface WakaTimeData {
	totalTime: string;
	dailyAverage: string;
	languages: { name: string; time: string; percentage: number; color: string }[];
	topProject: string;
}

export interface ServerStats {
	hostname: string;
	uptime: string;
	uptimeSeconds: number;
	cpu: { model: string; cores: number; usagePercent: number };
	memory: { total: string; used: string; usagePercent: number };
	disk: { total: string; used: string; usagePercent: number };
	network: { rx: string; tx: string };
	os: string;
	processes: number;
	loadAverage: string;
	status: string;
	lastUpdated: string | null;
}
