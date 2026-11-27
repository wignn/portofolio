export function mountEnhancement(load, mount, onError = () => {}) {
	let active = true;
	let dispose;
	Promise.resolve()
		.then(load)
		.then((module) => {
			if (active) dispose = mount(module);
		})
		.catch((error) => {
			if (active) onError(error);
		});
	return () => {
		if (!active) return;
		active = false;
		dispose?.();
	};
}
