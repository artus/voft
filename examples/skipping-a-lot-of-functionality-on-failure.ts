import { AsyncTry } from '../src';

async function fail(): Promise<string> {
  throw new Error('Failed!');
}

async function toUpperCase(value: string): Promise<string> {
  return value.toUpperCase();
}

async function toLowerCase(value: string): Promise<string> {
  return value.toLowerCase();
}

export async function skippingALotOfFunctionalityOnFailure(): Promise<void> {
  const asyncTry = AsyncTry.of(fail).map(toUpperCase).map(toLowerCase);

  const isFailure = await asyncTry.isFailure();
  console.log(`The AsyncTry is a failure: ${isFailure}`);
  console.log(
    `All subsequent operations were skipped because the first function threw an Error: ${
      (await asyncTry.getCause()).message
    }`
  );
}
