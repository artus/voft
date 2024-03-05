import { Try } from '../src';

function getName(): Try<string> {
  return Try.of(() => 'John Doe');
}

function createMessage(name: string): Try<string> {
  return Try.of(() => `Hello World from ${name}!`);
}

function printMessage(message: string): Try<void> {
  return Try.of(() => console.log(message));
}

function transformMessage(message: string): Try<string> {
  return Try.of(() => message.toUpperCase());
}

export function chainAllTheseFunctions(): void {
  getName()
    .map(createMessage)
    .flatMap<string>()
    .andThen(printMessage)
    .flatMap(transformMessage)
    .andThen(printMessage);
}
