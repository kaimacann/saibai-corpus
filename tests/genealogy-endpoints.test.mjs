import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const ts = createRequire(new URL('../config/package.json', import.meta.url))('typescript');
const component = await readFile(new URL('../src/components/saibai-genealogy.tsx', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(await readFile(new URL('../src/lib/genealogy-endpoints.ts', import.meta.url), 'utf8'), {
	compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { getSpousePairChildren, markGenealogyNodeEndpoints } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('spouse pair child lookup includes distinct children from both records', () => {
	assert.deepEqual(
		getSpousePairChildren(
			[
				{ id: 'parent-a', children: ['shared-child'] },
				{ id: 'parent-b', children: ['shared-child', 'other-child'] },
				{ id: 'unrelated', children: ['unrelated-child'] },
			],
			'parent-a',
			'parent-b',
		),
		['shared-child', 'other-child'],
	);
});

test('genealogy endpoint flags reflect completed incoming and outgoing edges', () => {
	const nodes = [
		{ id: 'parent', type: 'custom', data: { origin: false, terminus: false } },
		{ id: 'child', type: 'custom', data: { origin: false, terminus: false } },
		{ id: 'marriage', type: 'marriageConnector', data: {} },
	];
	markGenealogyNodeEndpoints(nodes, [{ source: 'parent', target: 'child' }]);
	assert.deepEqual(
		nodes.map(({ data }) => data),
		[{ origin: false, terminus: true }, { origin: true, terminus: false }, {}],
	);
});

test('the graph builder marks endpoints after adding relationships', () => {
	const edgesReady = component.indexOf('genealogyData.forEach(addDirectRelationships)');
	assert.ok(edgesReady >= 0 && component.indexOf('markGenealogyNodeEndpoints(nNodes, nEdges)') > edgesReady);
});
