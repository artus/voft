# voft

> Various Objects For Typescript

`voft` is a library that provides various objects and utilities for TypeScript, allowing you to write more declarative and functional code.

Right now, the library includes the following classes:

 - `Try`: A class that allows you to chain synchronous functions and handle errors in a more declarative way.
 - `AsyncTry`: A class that allows you to chain asynchronous functions and handle errors in a more declarative way.
 - `Optional`: A class that allows you to convey the presence or absence of a value in a more declarative way.
 - `Either`: A class that allows you to convey a success or failure in a more declarative way.

You can find more information about each class in the [docs](https://artus.github.io/voft).

## Examples

You can find examples of how to use the classes in the [examples](examples) directory.

## Installation

```bash
npm install voft
```

## Included objects

```typescript
import { AsyncTry } from '../src';

interface Launch {
  rocket: string;
}

interface Rocket {
  name: string;
}

async function getLatestLaunch(): Promise<Launch> {
  const response = await fetch('https://api.spacexdata.com/v5/launches/latest');
  return response.json();
}

async function getRocket(rocketIdentifier: string): Promise<Rocket> {
  const response = await fetch(
    `https://api.spacexdata.com/v4/rockets/${rocketIdentifier}`
  );

  return response.json();
}

export function printRocketNameOfLatestLaunch(): AsyncTry<string> {
  return AsyncTry.of(getLatestLaunch)
    .andThen(() => console.log('Got the latest launch!'))
    .map((launch) => launch.rocket)
    .andThen((rocketId: string) =>
      console.log(`Got the rocket id: ${rocketId}`)
    )
    .map(getRocket)
    .andThen(() => console.log('Got the rocket!'))
    .map((rocket: Rocket) => rocket.name)
    .andThen((rocketName: string) =>
      console.log(`The rocket name is: ${rocketName}`)
    );
}
```

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

This runs the tests and generates a coverage report.
The tests will fail if the coverage is below 100% for all files.

### lint

```bash
npm run lint
```

This runs the linter on all files in the `/src` directory.

### docs

```bash
npm run docs
```

This generates documentation based on the JSDoc to the `/docs` directory.
