# Complete repository test plan: saibai-corpus

This checklist inventories repository-owned functions, documents, and configuration as of the current working tree. It is a plan, not a claim that every item is already tested. Update it when an owned source or document changes.

## Scope and method

- Function entries identify the source path and line. Exercise the stated normal, edge, and failure scenarios; link or add assertions as each entry is completed.
- Document entries require rendering, link checking, and content review. Execute documented commands against the current repository.
- Generated output, dependencies, vendored trees, bundled course viewers, and Portfolio pinned `projects/` snapshots are covered through build, package, and integration checks rather than individual upstream functions. Keep those boundaries under review when their inputs change.
- Put produced reports, screenshots, traces, and coverage under `tests/results/`.

## Function and executable source inventory

### `config/.prettierrc.mjs`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `config/astro.config.mjs`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `config/eslint.config.mjs`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `config/postcss.config.mjs`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `config/prettier.config.cjs`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `config/tailwind.config.mjs`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `config/tailwind.preset.ts`

- [ ] `applyOpacityValue` (line 41): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `resolveOpacity` (line 46): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `colorScale` (line 61): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `toLegacyColorEntry` (line 66): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `toNumberedColorEntry` (line 73): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `gridSpans` (line 88): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `toSpanEntry` (line 94): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `gridLines` (line 107): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `toLineEntry` (line 113): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `minWidthTheme` (line 125): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `typographyTheme` (line 134): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `toGrayColorEntry` (line 180): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `registerCustomVariants` (line 189): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `childSelector` (line 194): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `scripts/quality-runner.mjs`

- [ ] `callback@18` (line 18): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `callback@45` (line 45): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `isBuildOrTest` (line 50): Run on clean input; verify deterministic output and a useful failure on invalid input. No direct test file is linked yet.
- [ ] `callback@53` (line 53): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `callback@55` (line 55): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `scripts/terra-quality.mjs`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `src/components/ErrorBoundary.tsx`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `src/components/carbon-icons.tsx`

- [ ] `renderIconPath` (line 31): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `CarbonIcon` (line 41): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/saibai-genealogy.tsx`

- [ ] `getNodeDimensions` (line 243): Test found, missing, unauthorized, and upstream-failure results. No direct test file is linked yet.
- [ ] `getLayoutedElements` (line 261): Test found, missing, unauthorized, and upstream-failure results. No direct test file is linked yet.
- [ ] `emptyEdgeLabel` (line 265): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `addEdgeToGraph` (line 277): Test found, missing, unauthorized, and upstream-failure results. No direct test file is linked yet.
- [ ] `addNodeToGraph` (line 283): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `positionNode` (line 294): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `PersonNode` (line 317): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `hasConflictingNameForSelectedId` (line 323): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `matchesSelectedPerson` (line 330): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleNodeClick` (line 336): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `MarriageConnectorNode` (line 365): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `LayoutFlow` (line 420): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `buildInitialGraph` (line 432): Run on clean input; verify deterministic output and a useful failure on invalid input. No direct test file is linked yet.
- [ ] `addPersonNode` (line 445): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `addChildMarriageEdge` (line 464): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `addParentChildEdge` (line 481): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `addMarriageRelationships` (line 494): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `isSpouse` (line 501): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `addMarriageChildEdge` (line 556): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `addDirectRelationships` (line 565): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `addDirectChildEdge` (line 574): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `initGraphLayout` (line 588): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `fitVisibleGraph` (line 603): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleContainerVisibility` (line 610): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `disconnectContainerObserver` (line 621): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `observeGraphContainer` (line 628): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `cleanupObserver` (line 635): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `onLayout` (line 645): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleVerticalLayout` (line 657): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handlePersonDialogChange` (line 664): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `capitalizeInitial` (line 672): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `getChildName` (line 680): Test found, missing, unauthorized, and upstream-failure results. No direct test file is linked yet.
- [ ] `renderPersonAudio` (line 688): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `Genealogy` (line 739): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `renderGenealogyErr` (line 745): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/saibai.tsx`

- [ ] `loadGenealogy` (line 45): Test found, missing, unauthorized, and upstream-failure results. No direct test file is linked yet.
- [ ] `renderContributor` (line 68): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `Saibai` (line 85): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `Acknowledgment` (line 133): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `closeWarning` (line 136): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SliderTrack` (line 166): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SliderTrackFill` (line 174): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SliderTrackProgress` (line 187): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SliderThumb` (line 200): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `SliderPreview` (line 212): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `MediaSlider` (line 233): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `PlayButton` (line 260): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `AudioControls` (line 280): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `Player` (line 324): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `buildGeoJsonData` (line 370): Run on clean input; verify deterministic output and a useful failure on invalid input. No direct test file is linked yet.
- [ ] `renderMapFailureFallback` (line 378): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `GeographicMap` (line 389): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `renderGeography` (line 398): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `selectGeography` (line 412): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `renderGeographies` (line 427): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `handleDialogOpenChange` (line 434): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderSelectedVideo` (line 443): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `TabsTrigger` (line 503): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `handleClick` (line 508): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `renderCorpusFailureFallback` (line 550): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `Corpus` (line 562): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `hydrateSelectedTabFromLocation` (line 565): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `renderTabButton` (line 574): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderTimelineItem` (line 586): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderTimelineSection` (line 594): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderCorpusPanel` (line 612): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/alert.tsx`

- [ ] `Alert` (line 12): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `AlertTitle` (line 28): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `AlertDescription` (line 38): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.
- [ ] `AlertError` (line 48): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/components/ui/button.tsx`

- [ ] `renderButton` (line 44): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `renderButtonLink` (line 61): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/dialog.tsx`

- [ ] `DialogHeader` (line 14): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DialogTitle` (line 24): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DialogDescription` (line 34): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.
- [ ] `DialogContent` (line 46): Render each state; check interactions, accessibility, loading, and error behavior. No direct test file is linked yet.

### `src/components/ui/variants.ts`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `src/env.d.ts`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `src/layouts/SiteLayout.astro`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `src/lib/corpus-tabs.ts`

- [ ] `resolveCorpusTab` (line 12): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/corpus-tabs.test.mjs`](../tests/corpus-tabs.test.mjs).
- [ ] `isCorpusTabId` (line 24): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/corpus-tabs.test.mjs`](../tests/corpus-tabs.test.mjs).

### `src/lib/genealogy-endpoints.ts`

- [ ] `getSpousePairChildren` (line 9): Test found, missing, unauthorized, and upstream-failure results. Candidate coverage: [`tests/genealogy-endpoints.test.mjs`](../tests/genealogy-endpoints.test.mjs).
- [ ] `markGenealogyNodeEndpoints` (line 27): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/genealogy-endpoints.test.mjs`](../tests/genealogy-endpoints.test.mjs).
- [ ] `callback@28` (line 28): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/genealogy-endpoints.test.mjs`](../tests/genealogy-endpoints.test.mjs).
- [ ] `callback@29` (line 29): Test expected input/output, empty and boundary cases, and a relevant failure path. Candidate coverage: [`tests/genealogy-endpoints.test.mjs`](../tests/genealogy-endpoints.test.mjs).

### `src/lib/types.ts`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `src/lib/utils.ts`

- [ ] `cn` (line 10): Test expected input/output, empty and boundary cases, and a relevant failure path. No direct test file is linked yet.

### `src/pages/index.astro`

- [ ] File behavior: execute or compile this source, including expected output and failure handling. No direct test file is linked yet.

### `tests/corpus-tabs.test.mjs`

- [ ] `resolvesSharedCorpusTabs` (line 24): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.

### `tests/error-boundary.test.mjs`

- [ ] `storesDescendantRenderErr` (line 47): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `rendersChildrenAndCustomFallback` (line 56): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `fallback` (line 65): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `usesAccessibleDefaultFallback` (line 79): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `reportsNamedBoundaryAndStack` (line 95): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `recordErr` (line 102): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `usesGenericNameForMissingMetadata` (line 119): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `recordErr` (line 125): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `clearsErrAfterResetKeyChange` (line 141): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `captureState` (line 150): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.

### `tests/genealogy-endpoints.test.mjs`

- [ ] `callback@27` (line 27): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `callback@39` (line 39): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `callback@47` (line 47): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.
- [ ] `callback@52` (line 52): Run this test and verify its assertions cover the helper, failure path, and relevant fixture. No direct test file is linked yet.

## Document inventory

- [ ] [`.changeset/repository-structure.md`](../.changeset/repository-structure.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`CHANGELOG.md`](../CHANGELOG.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`CONTENT-NOTICE.md`](../CONTENT-NOTICE.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`README.md`](../README.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.
- [ ] [`docs/README.md`](../docs/README.md): Render, check links and examples, then review each factual claim and instruction against the current implementation.

## Configuration and other owned files

- [ ] `.changeset/config.json`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `.github/workflows/repository-check.yml`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `.gitignore`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `LICENSE`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/config/pnpm-lock.yaml`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/husky/pre-commit`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/knip.json`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/netlify.toml`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/package.json`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/pnpm-lock.yaml`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/quality.json`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `config/tsconfig.json`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `package.json`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `pnpm-workspace.yaml`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `public/fonts/AUTHENTICSans-130.woff`: render or load this asset and inspect the visual or byte-level result.
- [ ] `public/fonts/AUTHENTICSans-130.woff2`: render or load this asset and inspect the visual or byte-level result.
- [ ] `public/fonts/AUTHENTICSans-150.woff`: render or load this asset and inspect the visual or byte-level result.
- [ ] `public/fonts/AUTHENTICSans-150.woff2`: render or load this asset and inspect the visual or byte-level result.
- [ ] `public/fonts/AUTHENTICSans-90.woff`: render or load this asset and inspect the visual or byte-level result.
- [ ] `public/fonts/AUTHENTICSans-90.woff2`: render or load this asset and inspect the visual or byte-level result.
- [ ] `public/fonts/Avara-Bold.woff`: render or load this asset and inspect the visual or byte-level result.
- [ ] `public/fonts/Avara-Bold.woff2`: render or load this asset and inspect the visual or byte-level result.
- [ ] `public/fonts/Avara-BoldItalic.woff`: render or load this asset and inspect the visual or byte-level result.
- [ ] `public/fonts/Avara-BoldItalic.woff2`: render or load this asset and inspect the visual or byte-level result.
- [ ] `public/fonts/IndieFlower-Regular.ttf`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `public/fonts/IndieFlower-Regular.woff2`: render or load this asset and inspect the visual or byte-level result.
- [ ] `src/effects.css`: validate syntax or schema, exercise its owning tool, and check references to this file.
- [ ] `src/styles.css`: validate syntax or schema, exercise its owning tool, and check references to this file.

Inventory: 119 function-like declarations, 5 documents, 28 other owned files, and 27 executable source files.
