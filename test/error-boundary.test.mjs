import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { readFile } from "node:fs/promises";
import test from "node:test";

const require = createRequire(new URL("../config/package.json", import.meta.url));
const ts = require("typescript");

const source = await readFile(
  new URL("../src/components/ErrorBoundary.tsx", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const executable = outputText
  .replaceAll(
    '"@terra-symposium/standards-error-boundaries/react"',
    JSON.stringify(
      pathToFileURL(
        require.resolve("@terra-symposium/standards-error-boundaries/react"),
      ).href,
    ),
  )
  .replaceAll(
    '"react/jsx-runtime"',
    JSON.stringify(pathToFileURL(require.resolve("react/jsx-runtime")).href),
  )
  .replaceAll('"react"', JSON.stringify(pathToFileURL(require.resolve("react")).href));
const { ErrorBoundary } = await import(
  `data:text/javascript;base64,${Buffer.from(executable).toString("base64")}`
);

test("stores a descendant render error for fallback rendering", () => {
  const error = new Error("render failed");

  assert.deepEqual(ErrorBoundary.getDerivedStateFromError(error), { error });
});

test("renders children before failure and a custom fallback after failure", () => {
  const children = { type: "section" };
  const error = new Error("render failed");
  const fallback = (caughtError) => ({ type: "fallback", error: caughtError });
  const boundary = new ErrorBoundary({ children, fallback });

  assert.equal(boundary.render(), children);

  boundary.state = { error };
  assert.deepEqual(boundary.render(), { type: "fallback", error });
});

test("uses an accessible default fallback when none is configured", () => {
  const boundary = new ErrorBoundary({ children: "content" });
  boundary.state = { error: new Error("render failed") };
  const fallback = boundary.render();

  assert.equal(fallback.type, "div");
  assert.equal(fallback.props.role, "alert");
  assert.equal(
    fallback.props.children,
    "An unexpected error occurred while rendering this section.",
  );
});

test("reports the boundary name and component stack when an error is caught", () => {
  const reports = [];
  const error = new Error("render failed");
  const boundary = new ErrorBoundary({
    name: "SaibaiCorpus",
    onError: (caughtError, report) => reports.push({ error: caughtError, ...report }),
  });

  boundary.componentDidCatch(error, { componentStack: "\n    at Panel" });

  assert.deepEqual(reports, [
    { error, name: "SaibaiCorpus", componentStack: "\n    at Panel" },
  ]);
});

test("uses the generic name and null stack when error metadata is absent", () => {
  const reports = [];
  const boundary = new ErrorBoundary({
    onError: (error, report) => reports.push({ error, ...report }),
  });
  const error = new Error("render failed");

  boundary.componentDidCatch(error, {});

  assert.deepEqual(reports, [
    { error, name: "Component", componentStack: null },
  ]);
});

test("clears a captured error when resetKey changes", () => {
  const boundary = new ErrorBoundary({ resetKey: "first" });
  const error = new Error("render failed");
  let nextState;
  boundary.state = { error };
  boundary.props = { resetKey: "second" };
  boundary.setState = (state) => {
    nextState = state;
  };

  boundary.componentDidUpdate({ resetKey: "first" });

  assert.deepEqual(nextState, { error: null });
});
