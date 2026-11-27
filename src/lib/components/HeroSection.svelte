<script>
	import { piaNodes } from '../data/pia-architecture.js';
</script>

<section class="hero" aria-labelledby="hero-title">
	<div class="hero-stage">
		<div class="hero-title">
			<h1 id="hero-title">
				<span>Code.</span><span class="outline">Connect.</span><span>Operate.</span>
			</h1>
			<p class="role">
				<strong>Backend &amp; Full-Stack Developer.</strong><br />DevOps and IT Technical
				Architecture. Building the services and thinking through the whole system.
			</p>
		</div>
		<figure class="scene" id="architecture-scene" aria-describedby="architecture-description">
			<div class="graph-fallback" id="scene-fallback">
				<strong>PIA Engine / NATS JetStream</strong><span
					>Ingestion, event backbone, domain services, storage, and realtime delivery</span
				>
				<div class="fallback-services">
					{#each piaNodes as node (node.id)}
						<span>{node.title}</span>
					{/each}
				</div>
			</div>
			<p class="canvas-note">
				Ingestion, NATS JetStream, services, storage, gateways.<br /><span id="scene-hint"
					>Drag to orbit the live topology.</span
				>
			</p>
			<figcaption class="scene-caption">
				<strong>PIA Engine</strong><br />Event-driven infrastructure, in space.<br /><span
					id="scene-state"
					role="status">17 nodes · 23 streams · Drag to inspect</span
				>
			</figcaption>
		</figure>
		<p class="sr-only" id="architecture-description">
			PIA Engine ingests external providers through ingestion-gateway and macro-feed into NATS
			JetStream, fanning out to sink-connector, market-data, news-service, intelligence-service, and
			the Python analyzer runtime, persisting to PostgreSQL, ClickHouse, and Redis, and serving
			public-web, pia, and Discord bot clients through api-gateway and realtime-gateway.
		</p>
	</div>
	<div class="hero-bottom">
		<div class="hero-actions">
			<a class="button" href="#work">Enter the workspace</a><a
				class="textlink"
				href="https://orca-enterprise.wign.dev/"
				target="_blank"
				rel="external noopener noreferrer">Explore ORCA Enterprise</a
			>
		</div>
		<p id="motion-state" class="motion-state">
			PIA Engine · NATS JetStream · ClickHouse · PostgreSQL · Redis
		</p>
	</div>
</section>
