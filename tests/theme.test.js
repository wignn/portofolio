import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

test('pre-paint theme respects saved choice and survives blocked storage', () => {
	const html = readFileSync(new URL('../src/app.html', import.meta.url), 'utf8');
	const script = html.match(/<script id="theme-bootstrap">([\s\S]*?)<\/script>/)?.[1];
	assert.ok(script, 'pre-paint theme bootstrap missing');
	for (const [saved, expected] of [
		['light', 'light'],
		['dark', 'dark'],
		[null, 'dark'],
		['invalid', 'dark']
	]) {
		const root = { dataset: {}, style: {} };
		vm.runInNewContext(script, {
			document: { documentElement: root },
			localStorage: { getItem: () => saved }
		});
		assert.equal(root.dataset.theme, expected);
	}
	const root = { dataset: {}, style: {} };
	vm.runInNewContext(script, {
		document: { documentElement: root },
		localStorage: {
			getItem() {
				throw Error('blocked');
			}
		}
	});
	assert.equal(root.dataset.theme, 'dark');
});
