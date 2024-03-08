# voft

> Various Objects For Typescript

## Commands

### build

```bash
npm run build
```

This builds to `/dist`. Test files and examples are not included.

### test

```bash
npm test
```

This runs the tests in all `/test` directories.

### coverage

```bash
npm run test:coverage
```

This runs the tests and generates a coverage report. The coverage report is *not* saved, but is printed to the console.
The tests will fail if the coverage is below 100% for all files.

### lint

```bash
npm run lint
```

This runs the linter on all files in the `/src` directory.
