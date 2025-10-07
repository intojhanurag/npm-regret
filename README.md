# npm-regret

> AI-powered dependency analyzer – unused, missing, outdated + witty AI feedback.

## Install / Run

Run directly in your project directory:

```bash
npx npm-regret
```

Optionally enable AI feedback (Groq):

```bash
export GROQ_API_KEY=your_key_here
npx npm-regret
```

## What it does

- Finds unused dependencies by scanning imports/require/dynamic imports
- Flags missing dependencies used in code but not installed
- Lists outdated dependencies via `npm outdated --json`
- Sends a summary to Groq LLM for concise, witty guidance

## Notes / Caveats

- This is a static scan; false positives can happen (e.g., runtime `require` paths, plugin resolvers).
- Node core modules like `fs`/`path` may appear as missing in certain edge cases when scanning this repo; ignore core modules in your interpretation.

## CI

- GitHub Actions run tests on pushes and PRs to `main`.
- GitHub Pages deploys the static site in `website/`.

## Development

```bash
npm i
npm test
npm start
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT – see [LICENSE](LICENSE).
