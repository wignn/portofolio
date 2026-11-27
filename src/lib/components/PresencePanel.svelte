<aside class="presence activity-panel" aria-label="Discord presence">
	<div class="panel-label">
		<h3>Behind the screen</h3>
		<span id="presence-source">Lanyard</span>
	</div>
	<div class="person">
		<img
			id="discord-avatar"
			src="https://cdn.discordapp.com/avatars/762847406563524618/9a1af6def57eecff1a59cf6c6550384d.png?size=128"
			width="56"
			height="56"
			alt="Wign's Discord avatar"
			loading="lazy"
		/>
		<div>
			<strong id="discord-name">Wign</strong>
			<div class="muted" id="discord-handle">Discord</div>
		</div>
	</div>
	<div class="status">
		<i id="status-dot" aria-hidden="true"></i><span id="status-text">Connecting...</span><span
			class="status-device"
			id="device"
		></span>
	</div>
	<div class="doing" id="doing">
		<span class="muted">Activity</span>
		<div class="activity-card">
			<div class="activity-icons" aria-hidden="true" hidden>
				<img
					id="activity-artwork"
					class="activity-artwork"
					width="64"
					height="64"
					alt=""
					hidden
				/><img
					id="activity-small-artwork"
					class="activity-small-artwork"
					width="24"
					height="24"
					alt=""
					hidden
				/>
			</div>
			<div class="activity-copy">
				<strong id="activity-name"></strong>
				<p id="discord-activity">Waiting for the latest activity.</p>
				<p id="activity-state"></p>
				<span id="activity-elapsed" class="activity-elapsed"></span>
			</div>
		</div>
	</div>
	<div id="spotify" hidden></div>
	<div class="presence-footer">
		<span id="presence-time">Status updates automatically</span><a
			href="https://discord.com/users/762847406563524618"
			target="_blank"
			rel="noopener noreferrer">Discord profile</a
		>
	</div>
</aside>
