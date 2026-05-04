export function reveal(node: HTMLElement, { delay = '0ms', threshold = 0.1 } = {}) {
	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.style.opacity = '1';
				node.style.transform = 'translateY(0)';
				observer.unobserve(node);
			}
		},
		{ threshold }
	);

	node.style.opacity = '0';
	node.style.transform = 'translateY(24px)';
	node.style.transition = `opacity 0.6s ease-out ${delay}, transform 0.6s ease-out ${delay}`;

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
