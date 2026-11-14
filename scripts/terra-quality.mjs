import { runQualityFromCfg } from '@terra-symposium/standards-quality/cli';
import { fileURLToPath } from 'node:url';

await runQualityFromCfg(fileURLToPath(new URL('../config/quality.json', import.meta.url)), process.argv.slice(2));
