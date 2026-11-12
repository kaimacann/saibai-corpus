import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { readFile } from "node:fs/promises";

const ts = createRequire(new URL("../config/package.json", import.meta.url))(
  "typescript",
);
const source = await readFile(
  new URL("../src/lib/corpus-tabs.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const { resolveCorpusTab } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

/** Confirms shared URLs select supported tabs and malformed tabs use a safe default. */
function resolvesSharedCorpusTabs() {
  assert.equal(
    resolveCorpusTab("?tab=Geographic", "Chronological"),
    "Geographic",
  );
  assert.equal(
    resolveCorpusTab("?tab=Genealogical", "Chronological"),
    "Genealogical",
  );
  assert.equal(
    resolveCorpusTab("?tab=Unknown", "Chronological"),
    "Chronological",
  );
  assert.equal(resolveCorpusTab("", "Unknown"), "Chronological");
}

test(
  "selected corpus tabs hydrate from validated URL parameters",
  resolvesSharedCorpusTabs,
);
