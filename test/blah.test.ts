import { TryAsync } from '../src/domain/try-async';

async function getNumberAsync(): Promise<number> {
  return 42;
}

async function getNumberAsyncWithError(): Promise<number> {
  throw new Error('Something went wrong!');
}