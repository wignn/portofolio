<script>
	import PresencePanel from './PresencePanel.svelte';
</script>

<section id="activity" aria-labelledby="activity-title">
	<div class="section-heading">
		<div>
			<h2 id="activity-title">Behind the build.</h2>
			<p>Public activity, time in the editor, and a little presence.</p>
		</div>
		<div class="clock"><span>Jakarta</span><strong id="clock">Loading clock</strong></div>
	</div>
	<div class="activity-grid">
		<article class="activity-panel github-panel">
			<div class="panel-label">
				<h3>GitHub activity</h3>
				<a href="https://github.com/wignn" target="_blank" rel="noopener noreferrer">@wignn</a>
			</div>
			<div class="gh-stats">
				<div><strong id="repo-count">...</strong><span>public repositories</span></div>
				<div><strong id="followers">...</strong><span>followers</span></div>
			</div>
			<div class="event-chart-wrap">
				<div class="chart-caption">
					<span>Public events / 14 days</span><span id="event-total">Loading</span>
				</div>
				<div
					id="event-chart"
					class="event-chart"
					aria-label="Public GitHub events over the last 14 days"
				></div>
				<div class="chart-dates"><span id="chart-start">Loading</span><span>Today</span></div>
			</div>
			<div id="event-list" class="event-list"><p class="muted">Loading public activity...</p></div>
			<p class="source-note" id="events-source">
				Up to 30 recent public events, not total contributions.
			</p>
		</article>
		<article class="activity-panel waka-panel">
			<div class="panel-label">
				<h3>Coding time</h3>
				<span>WakaTime</span>
			</div>
			<div id="waka-content" aria-live="polite">
				<p class="muted">Loading coding time and languages...</p>
			</div>
			<a class="textlink" href="https://wakatime.com" target="_blank" rel="noopener noreferrer"
				>About WakaTime</a
			>
		</article>
		<PresencePanel />
	</div>
</section>
