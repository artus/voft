type Executor<TryResult> = () => TryResult;
type Transformer<TryResult, NextTryResult> = (
  result: TryResult
) => NextTryResult;

export class Try<TryResult, TryError extends Error> {
  private constructor(
    private readonly isSuccessful: boolean,
    private readonly value?: TryResult,
    private readonly error?: TryError
  ) {
    if (value && error) {
      throw new Error(
        'Try cannot be constructed with both a value and an error.'
      );
    }
  }

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
   * @returns A new Try with the mapped value, a new Try with the error if one occured in the executor, or the original Try if it is a failure.
   */
  map<NextTryResult>(
    transformer: Transformer<TryResult, NextTryResult>
  ): Try<NextTryResult, TryError> {
    if (this.isSuccess()) {
      return Try.of<NextTryResult, TryError>(() => transformer(this.value!));
    } else {
      return new Try<NextTryResult, TryError>(false, undefined, this.error);
    }
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
   * Return the value embedded in the Try, or return the result of the executor if the Try is a failure.
   *
   * @param transformer A function that takes the Try's error and returns a value.
   * @returns The value embedded in the Try, or the result of the executor.
   */
  getOrElse<NextTryResult>(
    transformer: Transformer<TryError, NextTryResult>
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
  getOrElseThrow(failureMapper = (error: TryError): Error => error): TryResult {
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
  getCause(): TryError {
    if (this.isSuccess()) {
      throw new Error('Cannot get cause of a successful Try.');
    } else {
      return this.error!;
    }
  }

  /**
   * Perform an action on the embedded value, but continue with the same Try. Does not throw if the Try is a failure.
   *
   * @param transformer A function that takes the Try's value and returns nothing.
   * @returns The original Try.
   */
  andThen(
    transformer: Transformer<TryResult, unknown>
  ): Try<TryResult, TryError> {
    if (this.isSuccess()) {
      try {
        transformer(this.value!);
      } catch (error) {
        return Try.failure(error as TryError);
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
  mapFailure<NextTryError extends Error>(
    failureMapper: (error: TryError) => NextTryError
  ): Try<TryResult, NextTryError> {
    if (this.isSuccess()) {
      return Try.of<TryResult, NextTryError>(() => this.value!);
    } else {
      try {
        return Try.failure(failureMapper(this.error!));
      } catch (error) {
        return Try.failure(error as NextTryError);
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
  static of<TryResult, TryError extends Error>(
    executor: Executor<TryResult>
  ): Try<TryResult, TryError> {
    try {
      const result = executor();
      return Try.success(result);
    } catch (error) {
      return new Try<TryResult, TryError>(false, undefined, error as TryError);
    }
  }

  /**
   * Create a new successful Try with a value.
   *
   * @param value The value to embed in the Try.
   * @returns A new Try with the value.
   */
  static success<TryResult>(value: TryResult): Try<TryResult, never> {
    return new Try<TryResult, never>(true, value);
  }

  /**
   * Create a new failed Try with an error.
   *
   * @param error The error to embed in the Try.
   * @returns A new Try with the error.
   */
  static failure<TryError extends Error>(
    error: TryError
  ): Try<never, TryError> {
    return new Try<never, TryError>(false, undefined, error);
  }
}
