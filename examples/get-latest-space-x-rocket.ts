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
