import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const require = createRequire(new URL('../config/package.json', import.meta.url));
const ts = require('typescript');

const { outputText } = ts.transpileModule(await readFile(new URL('../src/components/ErrorBoundary.tsx', import.meta.url), 'utf8'), {
	compilerOptions: {
		jsx: ts.JsxEmit.ReactJSX,
		module: ts.ModuleKind.ESNext,
		target: ts.ScriptTarget.ES2022,
	},
});
const { ErrorBoundary: ErrBoundary } = await import(
	`data:text/javascript;base64,${Buffer.from(
		outputText
			.replaceAll(/(['"])@terra-symposium\/standards-error-boundaries\/react\1/g, JSON.stringify(pathToFileURL(require.resolve('@terra-symposium/standards-error-boundaries/react')).href))
			.replaceAll(/(['"])react\/jsx-runtime\1/g, JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
			.replaceAll(/(['"])react\1/g, JSON.stringify(pathToFileURL(require.resolve('react')).href)),
	).toString('base64')}`
);

// Confirms the boundary stores descendant render failures for its fallback.
test('stores a descendant render error for fallback rendering', () => {
	const err = new Error('render failed');

	assert.deepEqual(ErrBoundary.getDerivedStateFromError(err), { error: err });
});
// Confirms normal children render before failure and custom fallbacks after.
test('renders children before failure and a custom fallback after failure', () => {
	const children = { type: 'section' };
	const err = new Error('render failed');
	const boundary = new ErrBoundary({ children, fallback: caughtErr => ({ type: 'fallback', error: caughtErr }) });

	assert.equal(boundary.render(), children);

	boundary.state = { error: err };
	assert.deepEqual(boundary.render(), { type: 'fallback', error: err });
});
// Confirms the boundary exposes a default alert fallback without a custom one.
test('uses an accessible default fallback when none is configured', () => {
	const boundary = new ErrBoundary({ children: 'content' });
	boundary.state = { error: new Error('render failed') };
	const fallback = boundary.render();

	assert.equal(fallback.type, 'div');
	assert.equal(fallback.props.role, 'alert');
	assert.equal(fallback.props.children, 'An unexpected error occurred while rendering this section.');
});
// Confirms captured errors retain the configured boundary name and stack.
test('reports the boundary name and component stack when an error is caught', () => {
	const reports = [];
	const err = new Error('render failed');
	new ErrBoundary({
		name: 'SaibaiCorpus',
		onError: (caughtErr, report) => reports.push({ error: caughtErr, ...report }),
	}).componentDidCatch(err, { componentStack: '\n    at Panel' });

	assert.deepEqual(reports, [{ error: err, name: 'SaibaiCorpus', componentStack: '\n    at Panel' }]);
});
// Confirms missing error metadata maps to the generic name and null stack.
test('uses the generic name and null stack when error metadata is absent', () => {
	const reports = [];
	const err = new Error('render failed');
	new ErrBoundary({ onError: (caughtErr, report) => reports.push({ error: caughtErr, ...report }) }).componentDidCatch(err, {});

	assert.deepEqual(reports, [{ error: err, name: 'Component', componentStack: null }]);
});
// Confirms changing resetKey clears the previously captured error.
test('clears a captured error when resetKey changes', () => {
	const boundary = new ErrBoundary({ resetKey: 'first' });
	let nState;
	boundary.state = { error: new Error('render failed') };
	boundary.props = { resetKey: 'second' };
	boundary.setState = state => {
		nState = state;
	};

	boundary.componentDidUpdate({ resetKey: 'first' });

	assert.deepEqual(nState, { error: null });
});
