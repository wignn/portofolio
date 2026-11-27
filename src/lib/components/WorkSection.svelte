<script>
	import { projects } from '../data/projects.js';
</script>

<section id="work" aria-labelledby="work-title">
	<div class="section-heading">
		<h2 id="work-title">Systems I've built.</h2>
		<p>Actual projects. Actual interfaces. The systems behind them.</p>
	</div>
	<div class="featured-grid">
		{#each projects.filter((project) => project.featured) as project (project.id)}
			<article class="featured" aria-label={project.name}>
				<figure class="project-screenshot">
					<a href={project.screenshot.source} target="_blank" rel="external noopener noreferrer"
						><img
							src={project.screenshot.src}
							alt={project.screenshot.alt}
							width="1440"
							height="900"
							decoding="async"
						/></a
					>
					<figcaption>
						<span>{project.screenshot.label}</span><span
							>{new URL(project.screenshot.source).hostname.replace(/^www\./, '')}</span
						>
					</figcaption>
				</figure>
				<div class="project-body">
					<div class="project-meta">
						<span>Primary project · {project.category}</span><span
							>{project.technologies.join(' / ')}</span
						>
					</div>
					<h3>{project.name}</h3>
					<p>{project.description}</p>
					<div class="project-links">
						{#each project.links as link (link.href)}<a
								href={link.href}
								target="_blank"
								rel="external noopener noreferrer"
								>{link.label}<span class="sr-only"> for {project.name}</span></a
							>{/each}
					</div>
				</div>
			</article>
		{/each}
	</div>
	<div class="more-work">
		{#each projects.filter((project) => !project.featured) as project (project.id)}
			<article class="project-row">
				<figure class="project-screenshot">
					<a href={project.screenshot.source} target="_blank" rel="external noopener noreferrer"
						><img
							src={project.screenshot.src}
							alt={project.screenshot.alt}
							width="1440"
							height="900"
							decoding="async"
						/></a
					>
					<figcaption>
						<span>{project.screenshot.label}</span><span
							>{new URL(project.screenshot.source).hostname.replace(/^www\./, '')}</span
						>
					</figcaption>
				</figure>
				<div class="project-row-copy">
					<div class="project-meta"><span>{project.category}</span></div>
					<div class="project-name"><h3>{project.name}</h3></div>
					<p>{project.description}</p>
					{#if project.technologies.length}<div class="project-stack">
							{project.technologies.join(' / ')}
						</div>{/if}
					<div class="row-links">
						{#each project.links as link (link.href)}<a
								href={link.href}
								target="_blank"
								rel="external noopener noreferrer"
								>{link.label}<span class="sr-only"> for {project.name}</span></a
							>{/each}
					</div>
				</div>
			</article>
		{/each}
	</div>
	<div class="repository-index">
		<div class="repository-heading">
			<div>
				<h3>From the repositories.</h3>
				<a
					href="https://github.com/wignn?tab=repositories"
					target="_blank"
					rel="external noopener noreferrer">View all on GitHub</a
				>
			</div>
			<div class="repo-search">
				<label for="repo-search">Search repositories</label><input
					id="repo-search"
					type="search"
					placeholder="Name, language, or description"
				/>
			</div>
		</div>
		<div class="filters" role="group" aria-label="Filter repositories">
			<button type="button" class="active" data-filter="all" aria-pressed="true">All</button><button
				type="button"
				data-filter="original"
				aria-pressed="false">Original</button
			><button type="button" data-filter="fork" aria-pressed="false">Fork</button>
		</div>
		<div id="repos" class="repo-list" aria-live="polite">
			<p class="muted">Loading repositories from GitHub...</p>
		</div>
		<p id="repo-source" class="source-note"></p>
	</div>
</section>
