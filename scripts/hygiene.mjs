/**
 * scripts/hygiene.mjs
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import { runQualityFromCfg } from '@terra-symposium/hygiene/cli';
import { fileURLToPath } from 'node:url';

await runQualityFromCfg(fileURLToPath(new URL('../config/quality.json', import.meta.url)), process.argv.slice(2));
