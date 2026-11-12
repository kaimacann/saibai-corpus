import { runQualityFromCfg } from "@terra-symposium/standards-quality/cli";
import { fileURLToPath } from "node:url";

const configPath = fileURLToPath(
  new URL("../config/quality.json", import.meta.url),
);

await runQualityFromCfg(configPath, process.argv.slice(2));
