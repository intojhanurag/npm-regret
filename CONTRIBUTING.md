# Contributing to npm-regret

Thanks for your interest! This guide helps you get set up and productive fast.

## Setup

```bash
git clone <your-fork-url>
cd npm-regret
npm i
```

## Development

Run the CLI locally against a project:

```bash
node bin/npm-regret.js
```

Enable AI feedback:

```bash
export GROQ_API_KEY=your_key
```

## Tests

```bash
npm test
```

## Release

1. Bump version in `package.json`
2. `npm publish --access public`
3. Tag the release on GitHub

## Code style

- Modern Node ESM.
- Keep functions small and readable.
- Avoid catching errors you won’t handle.

