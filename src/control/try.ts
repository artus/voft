import { AsyncTry } from './async-try';

type Executor<TryResult> = () => TryResult;
type Transformer<TryResult, NextTryResult> = (
  result: TryResult
) => NextTryResult;

/**
 * A Try is a container for a value or an error. It is used to handle exceptions in a functional way.
 * A Try can be successful or a failure. A successful Try contains a value, while a failed Try contains an error.
 * A Try can be mapped to a new Try, or the value can be extracted from the Try.
 * If the Try is a failure, the error can be extracted or mapped to a new error.
 * The Try can also be used to perform actions on the value, or to provide a default value if the Try is a failure.
 * The Try can be used to chain operations together.
 */
export class Try<TryResult> {
  private constructor(
    private readonly isSuccessful: boolean,
    private readonly value?: TryResult,
    private readonly error?: Error
  ) {}

  /**
   * Check if the Try is successful.
   *
   * @returns true if the Try is successful, false otherwise.
   */
  isSuccess(): boolean {
    return this.isSuccessful;
  }

  /**
   * Check if the Try is a failure.
   *
   * @returns true if the Try is a failure, false otherwise.
   */
  isFailure(): boolean {
    return !this.isSuccessful;
  }

  /**
   * Map the Try to a new Try.
   *
   * @param transformer A function that takes the Try's value and returns a new value.
   * @returns A new Try with the mapped value, a new Try with the error if one occured in the transformer, or the original Try if it is a failure.
   */
  map<NextTryResult>(
    transformer: Transformer<TryResult, NextTryResult>
  ): Try<NextTryResult> {
    if (this.isSuccess()) {
      return Try.of<NextTryResult>(() => transformer(this.value!));
    } else {
      return Try.failure(this.error!);
    }
  }

  /**
   * Map the Try to a new AsyncTry with the result of the Async Transformer. If the Try is a failure, the new AsyncTry will be a failure.
   * @param transformer An async function that takes the Try's value and returns a new value as a Promise.
   * @returns A new AsyncTry with the result of the transformer, a new AsyncTry with the error if one occured in the transformer, or a new AsyncTry with the original failure if this is a failure.
   */
  mapAsync<NextTryResult>(
    transformer: Transformer<TryResult, Promise<NextTryResult>>
  ): AsyncTry<NextTryResult> {
    if (this.isFailure()) {
      return AsyncTry.failure(this.error!);
    } else {
      return AsyncTry.of(() => transformer(this.value!));
    }
  }

  /**
   * Map the Try to a new Try, but flatten the result. If the Try is a failure, the new Try will be a failure.
   *
   * @param transformer A function that takes the Try's value and returns a new Try.
   * @returns A new Try with the result of the transformer, a new Try with the error if one occured in the transformer, or the original Try if it is a failure.
   */
  flatMap<NextTryResult>(
    transformer: Transformer<TryResult, Try<NextTryResult>> = (
      value: TryResult
    ): Try<NextTryResult> => Try.of(() => (value as unknown) as NextTryResult)
  ): Try<NextTryResult> {
    if (this.isFailure()) {
      return Try.failure(this.error!);
    }

    if (this.value && this.value instanceof Try) {
      return this.value.map(
        (value: TryResult): NextTryResult => {
          return transformer(value).get();
        }
      );
    }

    return transformer(this.value!);
  }

  /**
   * Return the value embedded in the Try, or throw the error if the Try is a failure.
   *
   * @returns The value embedded in the Try.
   */
  get(): TryResult {
    if (this.isSuccess()) {
      return this.value!;
    } else {
      throw this.error;
    }
  }

  /**
   * Return the value embedded in the Try, or return the result of the transformer if the Try is a failure.
   *
   * @param transformer A function that takes the Try's error and returns a value.
   * @returns The value embedded in the Try, or the result of the transformer.
   */
  getOrElse<NextTryResult>(
    transformer: Transformer<Error, NextTryResult>
  ): TryResult | NextTryResult {
    if (this.isSuccess()) {
      return this.value!;
    } else {
      return transformer(this.error!);
    }
  }

  /**
   * Return the value embedded in the Try, or throw the result of the executor if the Try is a failure.
   *
   * @param failureMapper A function that takes the Try's error and returns an error.
   * @returns The value embedded in the Try.
   */
  getOrElseThrow(failureMapper = (error: Error): Error => error): TryResult {
    if (this.isSuccess()) {
      return this.value!;
    } else {
      throw failureMapper(this.error!);
    }
  }

  /**
   * Return the error embedded in the Try, or throw an error if the Try is a success.
   *
   * @returns The error embedded in the Try.
   */
  getCause(): Error {
    if (this.isSuccess()) {
      throw new Error('Cannot get cause of a successful Try.');
    } else {
      return this.error!;
    }
  }

  /**
   * Perform an action on the embedded value, but continue with the same Try. Does not throw if the Try is a failure.
   * If the transformer throws, the result will be a failed Try.
   *
   * @param transformer A function that takes the Try's value and returns nothing.
   * @returns The original Try if it was a failure or the transformer succeeded, otherwise a new Try with the failure of the transformer.
   */
  andThen(transformer: Transformer<TryResult, unknown>): Try<TryResult> {
    if (this.isSuccess()) {
      try {
        transformer(this.value!);
      } catch (error) {
        return Try.failure(error as Error);
      }
    }
    return this;
  }

  /**
   * Map the embedded failure. Does nothing if the Try is a success.
   *
   * @param failureMapper A function that takes the Try's error and maps it to a new error.
   * @returns The original Try if it is a success, or a new Try with the mapped error.
   */
  mapFailure(failureMapper: (error: Error) => Error): Try<TryResult> {
    if (this.isSuccess()) {
      return Try.of<TryResult>(() => this.value!);
    } else {
      try {
        return Try.failure(failureMapper(this.error!));
      } catch (error) {
        return Try.failure(error as Error);
      }
    }
  }

  /**
   * Create a new Try by trying to execute the executor. If the executor throws an error, the Try will be a failure.
   * If the executor returns a value, the Try will be successful and contain the return value of the executor.
   *
   * @param executor A function that might return a value or throw an error.
   * @returns A new Try with the result of the executor, or a new Try with the error if one occured in the executor.
   */
  static of<TryResult>(executor: Executor<TryResult>): Try<TryResult> {
    try {
      const result = executor();
      return Try.success(result);
    } catch (error) {
      return Try.failure(error as Error);
    }
  }

  /**
   * Create a new successful Try with a value.
   *
   * @param value The value to embed in the Try.
   * @returns A new Try with the value.
   */
  static success<TryResult>(value: TryResult): Try<TryResult> {
    return new Try<TryResult>(true, value);
  }

  /**
   * Create a new failed Try with an error.
   *
   * @param error The error to embed in the Try.
   * @returns A new Try with the error.
   */
  static failure(error: Error): Try<never> {
    return new Try<never>(false, undefined, error);
  }
}
