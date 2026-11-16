# Saibai Corpus

Saibai Corpus helps visitors explore Saibai family, language, place, and oral-history material.

The site brings together several ways to explore the corpus:

- A chronological view of stories and recorded material
- Audio playback for selected recordings
- A map view focused on Saibai Island
- A family and genealogy view

The site displays a sensitivity notice because its collection includes images, sounds, and names of deceased people. It acknowledges Aboriginal and Torres Strait Islander peoples as Traditional Custodians and pays respect to the Koeybuway and Moegibuway peoples of Saibai Island. Please approach the material with care and respect.

The project’s MIT license applies to software source authored for the site; it does not grant a blanket license to corpus or third-party content. Read [`CONTENT-NOTICE.md`](CONTENT-NOTICE.md) before reusing material.

## Get started

Use Node.js 22.19 or later and pnpm 10.30.3.

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

The development server prints the local URL when it starts. The production build is written to `dist/site/`.

## Validation

| Command                | Checks                        |
| ---------------------- | ----------------------------- |
| `pnpm run quality`     | Changed and untracked files   |
| `pnpm run quality:all` | Full configured Quality scope |
| `pnpm run test`        | Project test suite            |
| `pnpm run build`       | Build output                  |

Quality can apply safe fixes; review the diff before committing. No separate browser or Playwright test command is defined here.

## Contributing

`src/pages/` defines the site; `src/components/` contains corpus and genealogy views. `public/` holds published assets and `CONTENT-NOTICE.md` explains content use. The site displays a sensitivity notice for images, sounds, and names of deceased people.

Open a pull request against `development` and review the results of [`repository-check.yml`](.github/workflows/repository-check.yml) before merging. Keep unrelated changes out of the pull request.

## Documentation

The Netlify project is [saibai-corpus](https://app.netlify.com/projects/saibai-corpus), with the intended public URL [saibai-corpus.netlify.app](https://saibai-corpus.netlify.app). Connect this repository using its root as the base directory. [`netlify.toml`](netlify.toml) sets `pnpm run build` as the build command, `dist/site` as the publish directory, and Node.js 22.19. The site does not require runtime secrets.

- [Content notice](CONTENT-NOTICE.md)
- [Astro configuration](config/astro.config.mjs)
- [MIT software license](LICENSE)

## License

The project’s MIT license applies to software source authored for the site; it does not grant blanket rights to corpus or third-party content. Read [`CONTENT-NOTICE.md`](CONTENT-NOTICE.md) before reusing material, and seek permission from relevant knowledge holders.
