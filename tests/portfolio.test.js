import test from 'node:test';
import assert from 'node:assert/strict';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';
import { readFile, writeFile, unlink } from 'node:fs/promises';

async function renderComponent(name) {
	const source = new URL(`../src/lib/components/${name}.svelte`, import.meta.url);
	const compiled = compile(await readFile(source, 'utf8'), {
		generate: 'server',
		filename: source.pathname
	});
	const temporary = new URL(`../src/lib/components/.test-${name}.js`, import.meta.url);
	await writeFile(temporary, compiled.js.code);
	try {
		return render((await import(`${temporary.href}?t=${Date.now()}`)).default).body;
	} finally {
		await unlink(temporary);
	}
}

test('hero renders automatic PIA Engine architecture without manual motion chooser buttons', async () => {
	const html = await renderComponent('HeroSection');
	assert.match(html, /Code\./);
	assert.match(html, /Connect\./);
	for (const removedControl of [
		'motion-preference',
		'motion-replay',
		'motion-pause',
		'scene-rotate',
		'scene-reset',
		'Pause motion',
		'Rotate model',
		'Reset view'
	])
		assert.ok(!html.includes(removedControl), `${removedControl} should not be rendered`);
	for (const service of [
		'PIA Engine',
		'External providers',
		'ingestion-gateway',
		'macro-feed',
		'NATS JetStream',
		'sink-connector',
		'market-data',
		'news-service',
		'intelligence-service',
		'analyzer',
		'PostgreSQL',
		'ClickHouse',
		'Redis',
		'api-gateway',
		'realtime-gateway',
		'public-web',
		'pia',
		'bot'
	])
		assert.ok(html.includes(service), `${service} missing from hero`);
	assert.match(html, /Backend &amp; Full-Stack Developer/);
	assert.match(html, /DevOps/);
	assert.ok(!html.includes('id="discord-avatar"'));
});

test('PIA Engine architecture graph defines all 17 nodes and 23 directed edges from the flowchart', async () => {
	const { piaNodes, piaEdges } = await import('../src/lib/data/pia-architecture.js');
	assert.equal(piaNodes.length, 17);
	assert.equal(piaEdges.length, 23);
	const ids = new Set(piaNodes.map((node) => node.id));
	for (const id of [
		'sources',
		'ingest',
		'macro',
		'nats',
		'sink',
		'market',
		'news',
		'intel',
		'analyzer',
		'pg',
		'ch',
		'redis',
		'api',
		'realtime',
		'web',
		'pia',
		'bot'
	])
		assert.ok(ids.has(id), `missing node ${id}`);
	for (const [from, to] of piaEdges) {
		assert.ok(ids.has(from), `invalid edge source ${from}`);
		assert.ok(ids.has(to), `invalid edge target ${to}`);
	}
});

test('work renders every project link and retains accessible search and filters', async () => {
	const html = await renderComponent('WorkSection');
	for (const name of ['PIA Engine', 'NovelHive', 'Lyra', 'Nio', 'Crypt', 'PIA SDK'])
		assert.ok(html.includes(name));
	for (const id of ['repos', 'repo-source', 'repo-search']) assert.ok(html.includes(`id="${id}"`));
	assert.match(html, /<label[^>]*for="repo-search"/);
	assert.match(html, /data-filter="fork"/);
	assert.ok(!html.includes('linkedin.com'));
});
