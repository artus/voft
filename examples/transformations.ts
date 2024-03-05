import { Try } from '../src/control/try';

function getRandomNumberBetweenOneAndTen(): number {
  return Math.floor(Math.random() * 10) + 1;
}

function double(value: number): number {
  return value * 2;
}

function triple(value: number): number {
  return value * 3;
}

function divideByTwo(value: number): number {
  return value / 2;
}

function printResult(value: number): void {
  console.log(value);
}

export function doSomeTransformations(): Try<number> {
  return Try.of(getRandomNumberBetweenOneAndTen)
    .map(double)
    .map(triple)
    .map(divideByTwo)
    .andThen(printResult);
}
