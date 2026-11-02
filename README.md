# Saibai Corpus

An interactive living corpus of Saibai stories, language, recordings, maps, and family connections.

## What it does

The site brings together several ways to explore the corpus:

- A chronological view of stories and recorded material
- Audio playback for selected recordings
- A map view focused on Saibai Island
- A family and genealogy view

The site displays a sensitivity notice because its collection includes images, sounds, and names of deceased people. It acknowledges Aboriginal and Torres Strait Islander peoples as Traditional Custodians and pays respect to the Koeybuway and Moegibuway peoples of Saibai Island. Please approach the material with care and respect.

The project’s MIT license applies to software source authored for the site; it does not grant a blanket license to corpus or third-party content. Read [`CONTENT-NOTICE.md`](CONTENT-NOTICE.md) before reusing material.

## Prerequisites

Not applicable.

## Get started

Use Node.js 22.19 or later and pnpm 10.30.3.

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

Useful checks:

```sh
pnpm check
pnpm run build
```

The development server prints the local URL when it starts. The production build is written to `dist/`.

## Usage

**Website:** [saibai-corpus.netlify.app](https://saibai-corpus.netlify.app) · **GitHub:** [kaimacann/saibai-corpus](https://github.com/kaimacann/saibai-corpus)

## Configuration and security

Not applicable.

## Development and structure

Not applicable.

## Validation

Not applicable.

## Deployment and operations

The Netlify project is [saibai-corpus](https://app.netlify.com/projects/saibai-corpus), and its intended public URL is [saibai-corpus.netlify.app](https://saibai-corpus.netlify.app). Connect this repository to that project, using the repository root as the base directory. The checked-in [`netlify.toml`](netlify.toml) sets `pnpm run build` as the build command, `dist` as the publish directory, and Node.js 22.19. The site does not require runtime secrets.

## Data, privacy, and limitations

Not applicable.

## References

Not applicable.

## Contributing

Not applicable.

## Credits and license

Not applicable.
