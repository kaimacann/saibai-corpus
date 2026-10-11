# Saibai Corpus

A public-facing corpus site presenting historical Saibai material through an Astro and React application.

## What it does

It presents curated Saibai corpus material through an interactive site with explicit reuse boundaries.

## Prerequisites, setup, usage, and operations

Use the Node and pnpm versions declared in `package.json`. Run `pnpm install --frozen-lockfile` and `pnpm dev`; use `pnpm build` for deployment output.

### Common commands

```sh
pnpm dev
pnpm check
pnpm build
```

## Security and Limitations

The software license does not grant blanket reuse rights for cultural, family, genealogical, oral-history, language, place-based, or third-party materials. Follow cultural protocols and seek permission.

## Development and structure

Astro and React render corpus content. `CONTENT-NOTICE.md` explains reuse limits; Netlify configuration describes static publishing.

## Validation

pnpm check, pnpm quality:all, pnpm test:all, pnpm build

| Check | Command |
| --- | --- |
| dev | `pnpm dev` |
| check | `pnpm check` |
| build | `pnpm build` |

## References

Source references: [CONTENT-NOTICE.md](CONTENT-NOTICE.md), [package.json](package.json).

## Contributing

No contribution guide was present in the inspected source snapshot.

## Credits and license

The repository includes an MIT license at [LICENSE](LICENSE).
