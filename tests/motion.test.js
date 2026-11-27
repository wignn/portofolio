import test from 'node:test';
import assert from 'node:assert/strict';
import { animate } from 'animejs';

test('pausing returns one-shot animation to its readable resting layout', async () => {
	const { syncAnimations, createMotionState } = await import('../src/lib/motion/state.js');
	const target = { y: 0 };
	const animation = animate(target, { y: [45, 0], duration: 1000, autoplay: false });
	animation.seek(200);
	assert.notEqual(target.y, 0);
	const animations = new Set([animation]);
	const state = createMotionState();
	state.set({ paused: true });
	syncAnimations(animations, state);
	assert.equal(target.y, 0);
	assert.equal(animations.size, 0);
});

test('smooth scrolling is disabled for pause and restored without overriding reduced motion', async () => {
	const { createMotionState } = await import('../src/lib/motion/state.js');
	const state = createMotionState();
	assert.equal(state.smoothScrolling, true);
	state.set({ paused: true });
	assert.equal(state.smoothScrolling, false);
	state.set({ paused: false, reduced: true });
	assert.equal(state.smoothScrolling, false);
});

test('explicit full motion enables animation and Lenis despite a system reduced-motion preference', async () => {
	const { createMotionState, resolveMotionPreference } = await import('../src/lib/motion/state.js');
	assert.equal(resolveMotionPreference(null), 'full');
	assert.equal(resolveMotionPreference('invalid'), 'full');
	assert.equal(resolveMotionPreference('reduced'), 'reduced');
	assert.equal(resolveMotionPreference('system'), 'system');
	const state = createMotionState();
	state.set({ reduced: true });
	assert.equal(state.running, false);
	state.set({ preference: resolveMotionPreference(null) });
	assert.equal(state.reduced, false);
	assert.equal(state.running, true);
	assert.equal(state.smoothScrolling, true);
	state.set({ preference: 'reduced' });
	assert.equal(state.running, false);
	assert.equal(state.smoothScrolling, false);
	state.set({ preference: 'system' });
	assert.equal(state.running, false);
});

test('latest observer entry determines whether the scene renders', async () => {
	const { latestIntersection } = await import('../src/lib/motion/state.js');
	assert.equal(latestIntersection([{ isIntersecting: true }, { isIntersecting: false }]), false);
	assert.equal(latestIntersection([{ isIntersecting: false }, { isIntersecting: true }]), true);
});

// A resumed tab must not restart motion that the viewer explicitly paused.
test('motion gate keeps user pause independent from visibility and reduced motion', async () => {
	const { createMotionState } = await import('../src/lib/motion/state.js');
	const motion = createMotionState();
	assert.equal(motion.running, true);
	motion.set({ paused: true });
	motion.set({ visible: false });
	motion.set({ visible: true });
	assert.equal(motion.running, false);
	motion.set({ paused: false, reduced: true });
	assert.equal(motion.running, false);
	motion.set({ reduced: false });
	assert.equal(motion.running, true);
	motion.set({ inView: false });
	assert.equal(motion.running, false);
});

test('late lazy enhancement is disposed rather than attached after unmount', async () => {
	const { mountEnhancement } = await import('../src/lib/motion/lifecycle.js');
	let resolve;
	let mounted = 0;
	const load = new Promise((r) => {
		resolve = r;
	});
	const cleanup = mountEnhancement(
		() => load,
		(module) => module.mount()
	);
	cleanup();
	resolve({
		mount() {
			mounted++;
			return () => {};
		}
	});
	await new Promise((r) => setImmediate(r));
	assert.equal(mounted, 0);
});

test('mounted enhancement is disposed once and loading failure reaches fallback', async () => {
	const { mountEnhancement } = await import('../src/lib/motion/lifecycle.js');
	let disposed = 0;
	const cleanup = mountEnhancement(
		async () => ({}),
		() => () => {
			disposed++;
		}
	);
	await new Promise((r) => setImmediate(r));
	cleanup();
	cleanup();
	assert.equal(disposed, 1);
	let fallback = 0;
	mountEnhancement(
		async () => {
			throw new Error('load failed');
		},
		() => {},
		() => {
			fallback++;
		}
	);
	await new Promise((r) => setImmediate(r));
	assert.equal(fallback, 1);
});
