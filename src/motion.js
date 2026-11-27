import { animate, stagger } from 'animejs';
import { createMotionState, syncAnimations } from './lib/motion/state.js';
import { mountEnhancement } from './lib/motion/lifecycle.js';

export function initMotion() {
	const state = createMotionState();
	state.set({
		reduced: false,
		visible: true,
		preference: 'full'
	});
	const disposers = [];
	const animations = new Set();
	let lenis = null;
	let revealObserver;
	let navFrame = 0;
	let destroyed = false;
	let scene;
	let vendorTimer;
	const label = document.getElementById('motion-state');
	const nav = [...document.querySelectorAll('nav a[href^="#"]')]
		.map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) }))
		.filter((item) => item.section);
	function listen(target, type, handler, options) {
		if (!target) return;
		target.addEventListener(type, handler, options);
		disposers.push(() => target.removeEventListener(type, handler, options));
	}
	function sync() {
		document.documentElement.dataset.motion = 'full';
		if (label) {
			label.textContent = lenis
				? 'PIA Engine · NATS JetStream · ClickHouse · PostgreSQL · Redis'
				: 'PIA Engine · Live topology';
		}
		syncAnimations(animations, state);
		scene?.refresh();
	}
	function run(targets, options) {
		if (!state.running || !targets || (Array.isArray(targets) && !targets.length)) return;
		try {
			const animation = animate(targets, {
				...options,
				onComplete: (completed) => animations.delete(completed)
			});
			animations.add(animation);
		} catch {
			/* Content is visible by default if an enhancement cannot start. */
		}
	}
	function updateNav() {
		navFrame = 0;
		let active;
		for (const item of nav)
			if (item.section.getBoundingClientRect().top <= Math.min(innerHeight * 0.32, 260))
				active = item;
		for (const item of nav) {
			item.link.classList.toggle('is-current', item === active);
			if (item === active) item.link.setAttribute('aria-current', 'location');
			else item.link.removeAttribute('aria-current');
		}
	}
	function scheduleNav() {
		if (!navFrame) navFrame = requestAnimationFrame(updateNav);
	}
	function setupScrolling() {
		clearTimeout(vendorTimer);
		lenis?.destroy();
		lenis = null;
		if (!state.smoothScrolling || destroyed) {
			sync();
			return;
		}
		if (typeof window.Lenis !== 'function') {
			sync();
			return;
		}
		try {
			lenis = new window.Lenis({
				autoRaf: true,
				smoothWheel: true,
				syncTouch: false,
				anchors: false,
				lerp: 0.085,
				wheelMultiplier: 0.9
			});
		} catch {
			lenis = null;
		}
		sync();
	}
	let vendorAttempts = 0;
	function waitForVendor() {
		if (destroyed) return;
		if (typeof window.Lenis === 'function') setupScrolling();
		else if (++vendorAttempts < 20) vendorTimer = setTimeout(waitForVendor, 100);
	}
	listen(document, 'click', (event) => {
		if (
			!lenis ||
			state.reduced ||
			event.defaultPrevented ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		)
			return;
		const link = event.target.closest('a[href^="#"]');
		if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
		let id;
		try {
			id = decodeURIComponent(link.hash.slice(1));
		} catch {
			return;
		}
		const target = id ? document.getElementById(id) : document.documentElement;
		if (!target) return;
		event.preventDefault();
		lenis.scrollTo(target, {
			offset: id ? -24 : 0,
			onComplete: () => {
				if (destroyed) return;
				if (id) {
					if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
					target.focus({ preventScroll: true });
				}
				if (location.hash !== link.hash) history.pushState(null, '', link.hash);
				updateNav();
			}
		});
	});
	listen(window, 'scroll', scheduleNav, { passive: true });
	listen(window, 'resize', scheduleNav, { passive: true });
	function wakeVisibility() {
		if (!state.running && !state.paused && !state.reduced) {
			state.set({ visible: true });
			sync();
		}
	}
	for (const eventName of ['pointermove', 'pointerdown', 'wheel', 'keydown', 'touchstart', 'focus'])
		listen(window, eventName, wakeVisibility, { passive: true });
	listen(document, 'visibilitychange', () => {
		state.set({ visible: !document.hidden });
		if (!document.hidden) lenis?.resize();
		sync();
	});
	listen(window, 'pagehide', () => {
		state.set({ visible: false });
		sync();
	});
	listen(window, 'pageshow', () => {
		state.set({ visible: true });
		lenis?.resize();
		sync();
		updateNav();
	});
	function playEntrance() {
		run([...document.querySelectorAll('.hero-title h1 span')], {
			y: [74, 0],
			rotate: [5, 0],
			scale: [0.95, 1],
			duration: 1350,
			delay: stagger(140),
			ease: 'outExpo'
		});
		run([...document.querySelectorAll('.role, .hero-actions, #motion-state')], {
			y: [30, 0],
			duration: 1100,
			delay: stagger(110, { start: 320 }),
			ease: 'outExpo'
		});
		run(document.getElementById('architecture-scene'), {
			y: [34, 0],
			scale: [0.93, 1],
			duration: 1450,
			delay: 140,
			ease: 'outExpo'
		});
	}
	function setupReveals() {
		revealObserver?.disconnect();
		if (state.reduced || !('IntersectionObserver' in window)) return;
		revealObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries)
					if (entry.isIntersecting) {
						run(entry.target, {
							y: [60, 0],
							scale: [0.96, 1],
							duration: 1050,
							ease: 'outExpo'
						});
						const shot = entry.target.querySelector('.project-screenshot img');
						if (shot) {
							run(shot, {
								scale: [1.08, 1],
								duration: 1250,
								ease: 'outExpo'
							});
						}
						revealObserver.unobserve(entry.target);
					}
			},
			{ threshold: 0.1 }
		);
		document
			.querySelectorAll(
				'.section-heading, .featured, .project-row, .repository-index, .focus, .focus-list article, .activity-panel, .contact'
			)
			.forEach((element) => revealObserver.observe(element));
	}
	document.querySelectorAll('.featured, .project-row').forEach((card) => {
		const shot = card.querySelector('.project-screenshot img');
		if (!shot) return;
		listen(card, 'pointerenter', () => {
			run(shot, { scale: 1.035, duration: 500, ease: 'outQuint' });
		});
		listen(card, 'pointerleave', () => {
			run(shot, { scale: 1, duration: 500, ease: 'outQuint' });
		});
	});
	const disposeScene = mountEnhancement(
		() => import('./lib/motion/architecture-scene.js'),
		(module) => {
			scene = module.createArchitectureScene(document.getElementById('architecture-scene'), state);
			return () => scene.dispose();
		},
		() => {
			const sceneState = document.getElementById('scene-state');
			if (sceneState)
				sceneState.textContent = '3D unavailable. Service overview remains available.';
		}
	);
	disposers.push(disposeScene);
	waitForVendor();
	sync();
	setupReveals();
	playEntrance();
	updateNav();
	return () => {
		if (destroyed) return;
		destroyed = true;
		clearTimeout(vendorTimer);
		if (navFrame) cancelAnimationFrame(navFrame);
		revealObserver?.disconnect();
		lenis?.destroy();
		for (const animation of animations) animation.revert();
		animations.clear();
		disposers.reverse().forEach((dispose) => dispose());
	};
}
