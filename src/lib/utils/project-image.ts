import type { Project } from '$lib/data/projects';

export const getProjectImage = (project: Project) => {
	// If there's a local image, use it
	if (project.localImage) {
		return project.localImage;
	}

	const colors: Record<string, string> = {
		green: '0D9488/ffffff',
		purple: '7C3AED/ffffff',
		blue: '2563EB/ffffff',
		red: 'DC2626/ffffff',
		orange: 'EA580C/ffffff'
	};

	const colorCode = colors[project.badge?.color] || colors.purple;
	return `https://placehold.co/800x500/${colorCode}?text=${encodeURIComponent(project.title)}&font=roboto`;
};
