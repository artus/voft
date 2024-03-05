import { AsyncTry } from '../src';

function getName(): AsyncTry<string> {
  return AsyncTry.of(async () => 'John Doe');
}

function createMessage(name: string): AsyncTry<string> {
  return AsyncTry.of(async () => `Hello World from ${name}!`);
}

function printMessage(message: string): AsyncTry<void> {
  return AsyncTry.of(async () => console.log(message));
}

function transformMessage(message: string): AsyncTry<string> {
  return AsyncTry.of(async () => message.toUpperCase());
}

export async function chainAllTheseAsyncFunctions(): Promise<void> {
  await getName()
    .map(createMessage)
    .flatMap<string>()
    .andThen(printMessage)
    .flatMap(transformMessage)
    .andThen(printMessage)
    .get();
}
