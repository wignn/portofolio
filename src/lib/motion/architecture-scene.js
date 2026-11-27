import * as THREE from 'three';
import { latestIntersection } from './state.js';
import { piaEdges, piaNodes } from '../data/pia-architecture.js';

const flowPalette = {
	ingest: { tube: 0x99b978, pulse: 0xeaffb8, speed: 0.34 },
	stream: { tube: 0xc5dba6, pulse: 0xf7ffd9, speed: 0.44 },
	store: { tube: 0x74a684, pulse: 0xb7ffe0, speed: 0.31 },
	compute: { tube: 0xb5d68a, pulse: 0xf1ffc4, speed: 0.38 },
	query: { tube: 0xa2c082, pulse: 0xe7ffba, speed: 0.36 },
	delivery: { tube: 0xd0e6a8, pulse: 0xffffff, speed: 0.48 },
	cache: { tube: 0x89baa0, pulse: 0xc9ffee, speed: 0.52 }
};

export function createArchitectureScene(host, motion) {
	const fallback = document.getElementById('scene-fallback');
	const status = document.getElementById('scene-state');
	const resources = new Set();
	const listeners = [];
	let renderer;
	let frame = 0;
	let disposed = false;
	let lost = false;
	let inView = true;
	let dragging = false;
	let lastX = 0;
	let lastY = 0;
	let userYaw = -0.2;
	let userPitch = 0.28;
	let elapsed = 0;
	let previousTime;
	let resizeObserver;
	let visibilityObserver;
	let themeObserver;
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 120);
	const group = new THREE.Group();
	const pulses = [];
	const animatedMeshes = [];
	let natsRing;
	let outerRing;
	scene.add(group);
	group.rotation.set(userPitch, userYaw, 0);
	group.position.x = 0.2;

	function own(resource) {
		resources.add(resource);
		return resource;
	}
	function listen(target, name, handler) {
		if (!target) return;
		target.addEventListener(name, handler);
		listeners.push(() => target.removeEventListener(name, handler));
	}
	function shouldMove() {
		return motion.running && inView && !lost;
	}
	function render() {
		if (renderer && !lost && !disposed) renderer.render(scene, camera);
	}
	function stop() {
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
		previousTime = undefined;
	}
	function tick(time) {
		frame = 0;
		if (!shouldMove() || disposed) return;
		const delta = previousTime === undefined ? 0 : Math.min((time - previousTime) / 1000, 0.05);
		previousTime = time;
		elapsed += delta;
		if (!dragging) {
			const targetYaw = userYaw + Math.sin(elapsed * 0.35) * 0.14;
			const targetPitch = userPitch + Math.cos(elapsed * 0.27) * 0.04;
			group.rotation.y += (targetYaw - group.rotation.y) * 0.07;
			group.rotation.x += (targetPitch - group.rotation.x) * 0.07;
			group.position.y = Math.sin(elapsed * 0.7) * 0.08;
		}
		if (natsRing) natsRing.rotation.z = elapsed * 0.85;
		if (outerRing) outerRing.rotation.z = -elapsed * 0.18;
		for (let i = 0; i < animatedMeshes.length; i++) {
			const item = animatedMeshes[i];
			const wave = 0.5 + 0.5 * Math.sin(elapsed * 2.2 + i * 0.55);
			item.material.emissiveIntensity = item.baseEmissive + wave * 0.18;
		}
		for (const pulse of pulses) {
			const t = (elapsed * pulse.userData.speed + pulse.userData.offset) % 1;
			pulse.position.copy(pulse.userData.curve.getPointAt(t));
			const scale = 0.85 + Math.sin(t * Math.PI) * 0.45;
			pulse.scale.setScalar(scale);
		}
		render();
		frame = requestAnimationFrame(tick);
	}
	function refresh() {
		for (const pulse of pulses) pulse.visible = !motion.reduced;
		if (shouldMove()) {
			if (!frame) frame = requestAnimationFrame(tick);
		} else {
			stop();
			group.position.y = 0;
			render();
		}
	}
	function label(title, subtitle, x, y, z, accent) {
		const canvas = document.createElement('canvas');
		canvas.width = 512;
		canvas.height = 148;
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = accent ? '#1f2d1e' : '#141b16';
		ctx.fillRect(14, 16, 484, 114);
		ctx.strokeStyle = accent ? '#c5dba6' : '#566852';
		ctx.lineWidth = 3;
		ctx.strokeRect(14, 16, 484, 114);
		ctx.fillStyle = accent ? '#e7f8c8' : '#f0f3e8';
		ctx.textAlign = 'center';
		ctx.font = '700 31px Consolas, monospace';
		ctx.fillText(title, 256, 64);
		ctx.fillStyle = '#aebcab';
		ctx.font = '500 21px Segoe UI, Arial, sans-serif';
		ctx.fillText(subtitle, 256, 102);
		const texture = own(new THREE.CanvasTexture(canvas));
		texture.colorSpace = THREE.SRGBColorSpace;
		const material = own(
			new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false })
		);
		const sprite = new THREE.Sprite(material);
		sprite.position.set(x, y, z);
		sprite.scale.set(accent ? 2.15 : 1.72, accent ? 0.62 : 0.5, 1);
		group.add(sprite);
	}
	function buildNode(entry) {
		const [x, y, z] = entry.pos;
		const [w, h, d] = entry.size;
		const isCore = entry.kind === 'core';
		const isStore = entry.kind === 'store';
		const geo = isCore
			? own(new THREE.CylinderGeometry(w * 0.46, w * 0.52, h, 8))
			: own(new THREE.BoxGeometry(w, h, d));
		const baseEmissive = isCore ? 0.28 : isStore ? 0.14 : 0.1;
		const mat = own(
			new THREE.MeshStandardMaterial({
				color: entry.color,
				emissive: entry.color,
				emissiveIntensity: baseEmissive,
				roughness: isCore ? 0.26 : 0.38,
				metalness: isCore ? 0.34 : 0.22
			})
		);
		const mesh = new THREE.Mesh(geo, mat);
		mesh.position.set(x, y, z);
		group.add(mesh);
		animatedMeshes.push({ material: mat, baseEmissive });

		const edges = own(new THREE.EdgesGeometry(geo));
		const edgeMat = own(
			new THREE.LineBasicMaterial({
				color: isCore ? 0xf2ffd6 : 0xd6e6c3,
				transparent: true,
				opacity: isCore ? 0.72 : 0.42
			})
		);
		mesh.add(new THREE.LineSegments(edges, edgeMat));

		if (isCore) {
			const haloGeo = own(new THREE.RingGeometry(w * 0.58, w * 0.66, 32));
			const haloMat = own(
				new THREE.MeshBasicMaterial({
					color: 0xdff5b5,
					side: THREE.DoubleSide,
					transparent: true,
					opacity: 0.65
				})
			);
			natsRing = new THREE.Mesh(haloGeo, haloMat);
			natsRing.rotation.x = -Math.PI / 2;
			natsRing.position.set(x, y + 0.04, z);
			group.add(natsRing);
		}

		label(entry.title, entry.shortSubtitle, x, y + h / 2 + (isCore ? 0.44 : 0.34), z, isCore);
	}
	function buildConnection(fromNode, toNode, kind, index) {
		const [x1, y1, z1] = fromNode.pos;
		const [x2, y2, z2] = toNode.pos;
		const midX = (x1 + x2) * 0.5;
		const midY = (y1 + y2) * 0.5 + (kind === 'cache' ? -0.1 : 0.12);
		const midZ = (z1 + z2) * 0.5;
		const style = flowPalette[kind] ?? flowPalette.stream;
		const curve = new THREE.CatmullRomCurve3(
			[
				new THREE.Vector3(x1, y1, z1),
				new THREE.Vector3(midX, midY, midZ),
				new THREE.Vector3(x2, y2, z2)
			],
			false,
			'catmullrom',
			0.18
		);
		const radius = kind === 'stream' ? 0.026 : 0.019;
		const geo = own(new THREE.TubeGeometry(curve, 28, radius, 6, false));
		const mat = own(
			new THREE.MeshBasicMaterial({
				color: style.tube,
				transparent: true,
				opacity: kind === 'cache' ? 0.52 : 0.72
			})
		);
		group.add(new THREE.Mesh(geo, mat));

		for (let packet = 0; packet < 2; packet++) {
			const pulse = new THREE.Mesh(
				own(new THREE.SphereGeometry(kind === 'stream' ? 0.078 : 0.062, 10, 10)),
				own(new THREE.MeshBasicMaterial({ color: style.pulse }))
			);
			pulse.userData.curve = curve;
			pulse.userData.speed = style.speed + (index % 4) * 0.03;
			pulse.userData.offset = (((index * 0.13 + packet * 0.5) % 1) + 1) % 1;
			pulse.position.copy(curve.getPointAt(pulse.userData.offset));
			group.add(pulse);
			pulses.push(pulse);
		}
	}
	function resize() {
		if (!renderer || disposed || lost) return;
		const rect = host.getBoundingClientRect();
		if (!rect.width || !rect.height) return;
		renderer.setSize(rect.width, rect.height, false);
		camera.aspect = rect.width / rect.height;
		camera.position.set(0, 9.6, rect.width < 520 ? 21.5 : 17.8);
		camera.lookAt(0, -0.05, 0.1);
		camera.updateProjectionMatrix();
		render();
	}
	function theme() {
		const color = document.body.classList.contains('light') ? 0xefefe7 : 0x151916;
		scene.background = new THREE.Color(color);
		scene.fog = new THREE.Fog(color, 26, 52);
		render();
	}
	function releaseGpu() {
		for (const resource of resources) resource.dispose();
		resources.clear();
		renderer?.dispose();
		renderer?.domElement.remove();
		renderer = undefined;
	}

	try {
		renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
		renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.15;
		renderer.domElement.setAttribute('role', 'img');
		renderer.domElement.setAttribute(
			'aria-label',
			'Interactive 3D PIA Engine event-driven architecture topology with NATS JetStream, Go and Rust services, ClickHouse, PostgreSQL, Redis, and realtime gateways.'
		);
		host.prepend(renderer.domElement);

		scene.add(new THREE.HemisphereLight(0xf1f8dc, 0x223225, 0.95));
		const sun = new THREE.DirectionalLight(0xffffff, 2.1);
		sun.position.set(5, 10, 6);
		scene.add(sun);
		const fill = new THREE.DirectionalLight(0xbbe089, 1.15);
		fill.position.set(-7, 3, -4);
		scene.add(fill);

		const nodeById = new Map(piaNodes.map((entry) => [entry.id, entry]));
		for (const entry of piaNodes) buildNode(entry);
		piaEdges.forEach(([fromId, toId, kind], index) => {
			const fromNode = nodeById.get(fromId);
			const toNode = nodeById.get(toId);
			if (fromNode && toNode) buildConnection(fromNode, toNode, kind, index);
		});

		const baseGeo = own(new THREE.BoxGeometry(13.2, 0.12, 9.8));
		const baseMat = own(
			new THREE.MeshStandardMaterial({ color: 0x1e2a21, roughness: 0.65, metalness: 0.24 })
		);
		const base = new THREE.Mesh(baseGeo, baseMat);
		base.position.set(0.2, -2.05, 0.1);
		group.add(base);
		base.add(
			new THREE.LineSegments(
				own(new THREE.EdgesGeometry(baseGeo)),
				own(new THREE.LineBasicMaterial({ color: 0x859971, transparent: true, opacity: 0.58 }))
			)
		);

		outerRing = new THREE.Mesh(
			own(new THREE.RingGeometry(7.55, 7.6, 120)),
			own(
				new THREE.MeshBasicMaterial({
					color: 0x627855,
					side: THREE.DoubleSide,
					transparent: true,
					opacity: 0.5
				})
			)
		);
		outerRing.rotation.x = -Math.PI / 2;
		outerRing.position.set(0.2, -2.18, 0.1);
		group.add(outerRing);

		theme();
		resize();
		if (fallback) fallback.hidden = true;
		if (status) status.textContent = '17 nodes · 23 live streams · Drag to orbit';
		resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(host);
		visibilityObserver = new IntersectionObserver((entries) => {
			inView = latestIntersection(entries);
			refresh();
		});
		visibilityObserver.observe(host);
		themeObserver = new MutationObserver(theme);
		themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

		listen(host, 'pointerdown', (event) => {
			if (event.pointerType === 'touch' || event.target !== renderer.domElement) return;
			dragging = true;
			lastX = event.clientX;
			lastY = event.clientY;
			userYaw = group.rotation.y;
			userPitch = group.rotation.x;
			host.setPointerCapture(event.pointerId);
		});
		listen(host, 'pointermove', (event) => {
			if (!dragging) return;
			userYaw += (event.clientX - lastX) * 0.008;
			userPitch = Math.max(-0.25, Math.min(0.68, userPitch + (event.clientY - lastY) * 0.005));
			lastX = event.clientX;
			lastY = event.clientY;
			group.rotation.set(userPitch, userYaw, 0);
			render();
		});
		listen(host, 'pointerup', () => {
			dragging = false;
		});
		listen(host, 'pointercancel', () => {
			dragging = false;
		});
		listen(renderer.domElement, 'webglcontextlost', (event) => {
			event.preventDefault();
			lost = true;
			stop();
			renderer.domElement.hidden = true;
			if (fallback) fallback.hidden = false;
			if (status) status.textContent = '3D paused. Service overview available.';
		});
		listen(renderer.domElement, 'webglcontextrestored', () => {
			lost = false;
			renderer.domElement.hidden = false;
			if (fallback) fallback.hidden = true;
			if (status) status.textContent = '17 nodes · 23 live streams · Drag to orbit';
			resize();
			refresh();
		});
		refresh();
	} catch {
		stop();
		resizeObserver?.disconnect();
		visibilityObserver?.disconnect();
		themeObserver?.disconnect();
		listeners.forEach((remove) => remove());
		listeners.length = 0;
		releaseGpu();
		if (fallback) fallback.hidden = false;
		if (status) status.textContent = '3D unavailable. Showing the service overview.';
	}

	return {
		refresh,
		dispose() {
			if (disposed) return;
			disposed = true;
			stop();
			resizeObserver?.disconnect();
			visibilityObserver?.disconnect();
			themeObserver?.disconnect();
			listeners.forEach((remove) => remove());
			releaseGpu();
		}
	};
}
