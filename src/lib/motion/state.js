export function latestIntersection(entries) {
	return entries.at(-1)?.isIntersecting ?? false;
}

export function syncAnimations(animations, state) {
	for (const animation of animations) {
		if (state.reduced || state.paused) {
			animation.complete();
			animation.cancel();
			animations.delete(animation);
		} else if (state.running) animation.resume();
		else animation.pause();
	}
}

export function resolveMotionPreference(stored) {
	return ['full', 'reduced', 'system'].includes(stored) ? stored : 'full';
}

export function createMotionState() {
	const state = {
		paused: false,
		reduced: false,
		visible: true,
		inView: true,
		preference: 'system'
	};
	const isReduced = () =>
		state.preference === 'reduced' || (state.preference !== 'full' && state.reduced);
	return {
		set(next) {
			Object.assign(state, next);
		},
		get running() {
			return !state.paused && !isReduced() && state.visible && state.inView;
		},
		get smoothScrolling() {
			return !state.paused && !isReduced();
		},
		get paused() {
			return state.paused;
		},
		get reduced() {
			return isReduced();
		}
	};
}
