import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { readFile } from "node:fs/promises";
import test from "node:test";

const require = createRequire(
  new URL("../config/package.json", import.meta.url),
);
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
  .replaceAll(
    '"react"',
    JSON.stringify(pathToFileURL(require.resolve("react")).href),
  );
const { ErrorBoundary: ErrBoundary } = await import(
  `data:text/javascript;base64,${Buffer.from(executable).toString("base64")}`
);

/** Confirms the boundary stores descendant render failures for its fallback.
 * @returns Nothing; assertions describe the derived error state.
 */
function storesDescendantRenderErr() {
  const err = new Error("render failed");

  assert.deepEqual(ErrBoundary.getDerivedStateFromError(err), { error: err });
}

/** Confirms normal children render before failure and custom fallbacks after.
 * @returns Nothing; assertions compare the children and fallback render values.
 */
function rendersChildrenAndCustomFallback() {
  const children = { type: "section" };
  const err = new Error("render failed");
  /**
   * Builds the test fallback value for a captured error.
   *
   * @param caughtErr - Error received from the boundary.
   * @returns A plain object that identifies the fallback and error.
   */
  function fallback(caughtErr) {
    return { type: "fallback", error: caughtErr };
  }
  const boundary = new ErrBoundary({ children, fallback });

  assert.equal(boundary.render(), children);

  boundary.state = { error: err };
  assert.deepEqual(boundary.render(), { type: "fallback", error: err });
}

/** Confirms the boundary exposes a default alert fallback without a custom one.
 * @returns Nothing; assertions cover the default alert content and role.
 */
function usesAccessibleDefaultFallback() {
  const boundary = new ErrBoundary({ children: "content" });
  boundary.state = { error: new Error("render failed") };
  const fallback = boundary.render();

  assert.equal(fallback.type, "div");
  assert.equal(fallback.props.role, "alert");
  assert.equal(
    fallback.props.children,
    "An unexpected error occurred while rendering this section.",
  );
}

/** Confirms captured errors retain the configured boundary name and stack.
 * @returns Nothing; assertions inspect the reported boundary metadata.
 */
function reportsNamedBoundaryAndStack() {
  const reports = [];
  const err = new Error("render failed");
  /** Stores the error together with metadata supplied by the boundary.
   * @param caughtErr - Exception forwarded by the boundary callback.
   * @param report - Boundary identity and component stack.
   */
  function recordErr(caughtErr, report) {
    reports.push({ error: caughtErr, ...report });
  }

  new ErrBoundary({
    name: "SaibaiCorpus",
    onError: recordErr,
  }).componentDidCatch(err, { componentStack: "\n    at Panel" });

  assert.deepEqual(reports, [
    { error: err, name: "SaibaiCorpus", componentStack: "\n    at Panel" },
  ]);
}

/** Confirms missing error metadata maps to the generic name and null stack.
 * @returns Nothing; assertions check the generic name and absent stack.
 */
function usesGenericNameForMissingMetadata() {
  const reports = [];
  /** Stores the error together with metadata supplied by the boundary.
   * @param err - Exception forwarded by the boundary callback.
   * @param report - Boundary identity and component stack.
   */
  function recordErr(err, report) {
    reports.push({ error: err, ...report });
  }
  const boundary = new ErrBoundary({ onError: recordErr });
  const err = new Error("render failed");

  boundary.componentDidCatch(err, {});

  assert.deepEqual(reports, [
    { error: err, name: "Component", componentStack: null },
  ]);
}

/** Confirms changing resetKey clears the previously captured error.
 * @returns Nothing; the assertion verifies that state resets to null.
 */
function clearsErrAfterResetKeyChange() {
  const boundary = new ErrBoundary({ resetKey: "first" });
  const err = new Error("render failed");
  let nState;
  boundary.state = { error: err };
  boundary.props = { resetKey: "second" };
  /** Captures the state update requested when resetKey changes.
   * @param state - State object passed to the boundary's setState method.
   */
  function captureState(state) {
    nState = state;
  }
  boundary.setState = captureState;

  boundary.componentDidUpdate({ resetKey: "first" });

  assert.deepEqual(nState, { error: null });
}

test(
  "stores a descendant render error for fallback rendering",
  storesDescendantRenderErr,
);
test(
  "renders children before failure and a custom fallback after failure",
  rendersChildrenAndCustomFallback,
);
test(
  "uses an accessible default fallback when none is configured",
  usesAccessibleDefaultFallback,
);
test(
  "reports the boundary name and component stack when an error is caught",
  reportsNamedBoundaryAndStack,
);
test(
  "uses the generic name and null stack when error metadata is absent",
  usesGenericNameForMissingMetadata,
);
test(
  "clears a captured error when resetKey changes",
  clearsErrAfterResetKeyChange,
);
