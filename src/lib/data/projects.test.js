import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

test('ORCA Enterprise is the primary featured project', async () => {
	const { projects } = await import('./projects.js');
	const featured = projects.filter((project) => project.featured);
	assert.equal(featured[0]?.id, 'orca-enterprise');
	assert.equal(featured[0]?.name, 'ORCA Enterprise');
});

test('every project has a local real screenshot with its source identified', async () => {
	const { projects } = await import('./projects.js');
	for (const project of projects) {
		assert.ok(project.screenshot?.src, `${project.name} missing screenshot`);
		assert.ok(
			existsSync(
				new URL(
					`../../..${project.screenshot.src.replace('/screenshots/', '/static/screenshots/')}`,
					import.meta.url
				)
			)
		);
		assert.ok(project.screenshot.alt.includes(project.name));
		assert.ok(project.screenshot.source.startsWith('https://'));
	}
});

test('supplied live projects are linked once without duplicating Nio or NovelHive', async () => {
	const { projects } = await import('./projects.js');
	for (const [name, href] of [
		['ORCA Enterprise', 'https://orca-enterprise.wign.dev/'],
		['ORCA Alpha', 'https://orca.wign.dev/'],
		['Nio', 'https://hazard.wign.dev/'],
		['NovelHive', 'https://nhive.wign.dev/'],
		['David Booster Service', 'https://www.david-booster-service.my.id/']
	]) {
		const matches = projects.filter((p) => p.links.some((l) => l.href === href));
		assert.equal(matches.length, 1, `${href} must have exactly one project`);
		assert.equal(matches[0].name, name);
	}
	assert.equal(projects.filter((p) => p.id === 'nio').length, 1);
	assert.equal(projects.filter((p) => p.id === 'novelhive').length, 1);
});

// The visible project list must not lose destinations during the data extraction.
test('selected work retains all six projects and their existing destinations', async () => {
	const { projects } = await import('./projects.js');
	const expected = [
		['PIA Engine', 'https://github.com/wignn/pia-engine'],
		['NovelHive', 'https://github.com/wignn/nhive'],
		['Lyra', 'https://github.com/wignn/lyra'],
		['Nio', 'https://github.com/lampu-hazard/nio'],
		['Crypt', 'https://github.com/wignn/crypt'],
		['PIA SDK', 'https://github.com/wignn/pia-sdk']
	];
	assert.ok(projects.length >= 6);
	for (const [name, href] of expected) {
		const project = projects.find((p) => p.name === name);
		assert.ok(project, `${name} missing`);
		assert.ok(
			project.links.some((link) => link.href === href),
			`${name} source missing`
		);
		for (const link of project.links) {
			assert.equal(new URL(link.href).protocol, 'https:');
			assert.ok(!new URL(link.href).hostname.endsWith('linkedin.com'));
		}
	}
	const links = projects.flatMap((p) => p.links.map((l) => l.href));
	for (const href of [
		'https://terminal.wign.dev/',
		'https://pia.wign.dev/',
		'https://lyra.wign.dev/',
		'https://hazard.wign.dev/',
		'https://www.npmjs.com/package/@piaa/sdk',
		'https://pypi.org/project/piaa-sdk/'
	])
		assert.ok(links.includes(href));
});
