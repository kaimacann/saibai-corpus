# Living Archive

This standalone Netlify site brings together the Saibai Corpus and Bridgette's Strikes. It contains the interactive archive, its maps and media players, the shared scoreboard UI, and the Netlify Function that stores scoreboard data.

## Develop and build

Use Node 22.19.0 and pnpm 10.30.3.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
```

The static pages are built from `src/pages`; the scoreboard API is in `netlify/functions/bridgette.mjs`.

## Netlify configuration

Connect the `Terra-Symposium/saibai-bridgette` repository to a new Netlify project and use the repository root as the base directory. `netlify.toml` sets the build command, publish directory, Node version, function directory, API route, and security headers.

Create `BRIDGETTE_EDITOR_TOKEN` in Infisical and provision it to the Netlify production Functions environment through the team's secret process. On plans with environment variable scopes, limit it to Functions; on plans without scopes, the app only reads it inside the function and never includes it in the built pages. The scoreboard is publicly readable; updates require this key. Staff enter it in the scoreboard UI. It is held in that browser tab's session storage and sent only to the same-origin function.

To carry forward the existing scoreboard, temporarily provision `BRIDGETTE_MIGRATION_SITE_ID` and `BRIDGETTE_MIGRATION_BLOBS_TOKEN` to the new site's production Functions environment. Its first read copies the existing `bridgette-dashboard/scoreboard` Blob into the new site's own store. The scoreboard stays unavailable until migration access is configured, preventing a default board from overwriting the existing data. Remove both migration variables after verifying the copied data. Never put credentials in this repository.

The migration needs a Netlify Blobs token with read access to the current site's store.

## Routes

- `/` links to both projects.
- `/saibai` hosts the corpus and its sensitivity notice.
- `/bridgette` hosts the scoreboard.
