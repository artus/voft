import { Either } from './either';

type Executor<TryResult> = () => Promise<TryResult>;
type Transformer<TryResult, NextTryResult> = (
  result: TryResult
) => NextTryResult | Promise<NextTryResult>;

/**
 * An asynchronous version of the Try class.
 * An AsyncTry is a container for a value that may or may not be present, and may or may not be an error.
 * It is used to handle asynchronous operations that may fail.
 * An AsyncTry can be successful or a failure. A successful AsyncTry contains a value, while a failed AsyncTry contains an error.
 * An AsyncTry can be mapped to a new AsyncTry, or the value can be extracted from the AsyncTry.
 * If the AsyncTry is a failure, the error can be extracted or mapped to a new error.
 * The AsyncTry can also be used to perform actions on the value, or to provide a default value if the AsyncTry is a failure.
 * The AsyncTry can be used to chain operations together.
 */
export class AsyncTry<TryResult> {
  private result?: TryResult;

  private constructor(
    private readonly value?: Promise<TryResult>,
    private error?: Error
  ) {}

  /**
   * Map the AsyncTry to a new AsyncTry.
   *
   * @param transformer A function that takes the AsyncTry's value and returns a new value.
   * @returns A new AsyncTry with the mapped value, a new AsyncTry with the error if one occured in the transformer, or the original AsyncTry if it is a failure.
   */
  map<NextTryResult>(
    transformer: Transformer<TryResult, NextTryResult>
  ): AsyncTry<NextTryResult> {
    if (this.error) {
      return AsyncTry.failure<NextTryResult>(this.error!);
    } else {
      const transformedResult = this.value!.then(transformer);
      return AsyncTry.of(() => transformedResult);
    }
  }

  /**
   * Map the AsyncTry to a new AsyncTry with the result of the Async Transformer. If the AsyncTry is a failure, the new AsyncTry will be a failure.
   *
   * @param transformer A function that takes the AsyncTry's value and returns a new AsyncTry.
   * @returns A new AsyncTry with the result of the transformer, a new AsyncTry with the error if one occured in the transformer, or a new AsyncTry with the original failure if this is a failure.
   */
  flatMap<NextTryResult>(
    transformer: Transformer<TryResult, AsyncTry<NextTryResult>> = (
      value: TryResult
    ): AsyncTry<NextTryResult> =>
      AsyncTry.of(async () => value as unknown as NextTryResult)
  ): AsyncTry<NextTryResult> {
    if (this.error) {
      return AsyncTry.failure<NextTryResult>(this.error);
    }

    if (this.result && this.result instanceof AsyncTry) {
      return this.result.map(async (value: TryResult) => {
        return (await transformer(value)).get();
      });
    }

    return this.map(async (value: TryResult) => {
      if (value instanceof AsyncTry) {
        const result = await value.get();
        return (await transformer(result)).get();
      }
      return (await transformer(value)).get();
    });
  }

  /**
   * Check if the AsyncTry is successful. It is important to know that this method will resolve the value, which means it executes all chained transformers.
   *
   * @returns A Promise containing true if the AsyncTry is successful, false otherwise.
   */
  async isSuccess(): Promise<boolean> {
    if (this.error) {
      return Promise.resolve(false);
    }

    if (this.value && this.result) {
      return Promise.resolve(true);
    } else {
      try {
        const result = await this.value;
        this.result = result;
        return this.isSuccess();
      } catch (error) {
        this.error = error as Error;
        return Promise.resolve(false);
      }
    }
  }

  /**
   * Try to resolve the AsyncTry to an Either. If the AsyncTry is a failure, the Either will be of type 'Left' and contain the error. If the AsyncTry is successful, the Either will be of type 'Right' and contain the value.
   * @returns A Promise containing an Either with the result of the AsyncTry.
   */
  async resolve(): Promise<Either<Error, TryResult>> {
    if (await this.isSuccess()) {
      return Either.right(this.result!);
    } else {
      return Either.left(this.error!);
    }
  }

  /**
   * Check if the AsyncTry is a failure. It is important to know that this method will resolve the value, which means it executes all chained transformers.
   *
   * @returns A Promise containing true if the AsyncTry is a failure, false otherwise.
   */
  async isFailure(): Promise<boolean> {
    const isSuccess = await this.isSuccess();
    return !isSuccess;
  }

  /**
   * Get the value of the AsyncTry. If the AsyncTry is a failure, the Promise will be rejected with the error.
   * It's important to know that this method will resolve the value, which means it executes all chained transformers.
   *
   * @returns A Promise containing the value of the AsyncTry if it is successful. If the AsyncTry is a failure, the Promise will be rejected with the error.
   */
  async get(): Promise<TryResult> {
    if (await this.isSuccess()) {
      return this.result!;
    } else {
      throw this.error;
    }
  }

  /**
   * Get the value of the AsyncTry if it is successful, or the result of the alternative provider if it is a failure.
   *
   * @param alternativeProvider A function that takes the error and returns a new value.
   * @returns A Promise containing the value of the AsyncTry if it is successful, or the result of the alternative provider if it is a failure.
   */
  async getOrElse(
    alternativeProvider: (error: Error) => Promise<TryResult>
  ): Promise<TryResult> {
    if (this.error) {
      return alternativeProvider(this.error);
    } else {
      try {
        return await this.get();
      } catch (error) {
        return alternativeProvider(error as Error);
      }
    }
  }

  /**
   * Return the value of the AsyncTry if it is successful, or throw the result of the Error transformer if it is a failure.
   *
   * @param failureMapper A function that takes the error and returns a new error.
   * @returns A Promise containing the value of the AsyncTry if it is successful, or the result of the failure mapper if it is a failure.
   */
  async getOrElseThrow(
    failureMapper = (error: Error): Error => error
  ): Promise<TryResult> {
    if (await this.isSuccess()) {
      return this.result!;
    } else {
      throw failureMapper(this.error!);
    }
  }

  /**
   * Return the error of the AsyncTry if it is a failure, or throw an error if it is successful.
   *
   * @returns A Promise containing the error of the AsyncTry if it is a failure.
   */
  async getCause(): Promise<Error> {
    if (await this.isSuccess()) {
      throw new Error('Cannot get cause of a successful AsyncTry.');
    } else {
      return this.error!;
    }
  }

  /**
   * Perform an action on the value of the AsyncTry, but continue with the same AsyncTry. Does not throw if the AsyncTry is a failure.
   * If the transformer throws, the result will be a failed AsyncTry.
   *
   * @param transformer A function that takes the value and returns void.
   * @returns A new AsyncTry with the same value if the transformer was successful, or a new AsyncTry with the error if one occured in the transformer.
   */
  andThen<TransformedResult>(
    transformer: Transformer<TryResult, TransformedResult>
  ): AsyncTry<TryResult> {
    if (this.result) {
      const transformerResult = Promise.resolve(this.result)
        .then(transformer)
        .then(() => this.result!);
      return new AsyncTry(transformerResult);
    }

    if (this.error) {
      return this;
    } else {
      const containedValue = this.value!;
      const transformedResult = containedValue
        .then(transformer)
        .then(() => containedValue);
      return new AsyncTry(transformedResult);
    }
  }

  /**
   * Map the failure of the AsyncTry to a new failed AsyncTry. If the AsyncTry is a success, the new AsyncTry will be the same.
   * If the failureMapper throws, the result will be a failed AsyncTry with the error of the failureMapper.
   *
   * @param failureMapper A function that takes the error and returns a new error.
   * @returns A new failed AsyncTry with the mapped error, or the original AsyncTry if it is a success.
   */
  mapFailure(failureMapper: (error: Error) => Error): AsyncTry<TryResult> {
    if (this.result) {
      return this;
    }

    if (this.error) {
      return AsyncTry.failure(failureMapper(this.error));
    } else {
      const containedValue = this.value!;
      const transformedError = containedValue.then(
        (value: TryResult) => value,
        (error: Error) => {
          throw failureMapper(error);
        }
      );
      return new AsyncTry(transformedError);
    }
  }

  /**
   * Map the failure of the AsyncTry to a new successful AsyncTry. If the AsyncTry is a success, the new AsyncTry will be the same.
   * If the failureMapper throws, the result will be a failed AsyncTry with the error of the failureMapper.
   *
   * @param failureMapper A function that takes the error and returns a new successful value.
   * @returns A new successful AsyncTry with the mapped error, or the original AsyncTry if it is a success.
   */
  mapToSuccess(
    failureMapper: (error: Error) => TryResult
  ): AsyncTry<TryResult> {
    if (this.result) {
      return this;
    }

    if (this.error) {
      return AsyncTry.of(async () => failureMapper(this.error!));
    } else {
      const containedValue = this.value!;
      const transformedError = containedValue.then(
        (value: TryResult) => value,
        (error: Error) => failureMapper(error)
      );
      return new AsyncTry(transformedError);
    }
  }

  /**
   * Create a new failed AsyncTry with an error.
   *
   * @param error The error to embed in the new AsyncTry.
   * @returns A new failed AsyncTry with the error.
   */
  static failure<TryResult>(error: Error): AsyncTry<TryResult> {
    return new AsyncTry<TryResult>(undefined, error);
  }

  /**
   * Create a new successful AsyncTry with a value.
   *
   * @param result The value to embed in the new AsyncTry.
   * @returns A new successful AsyncTry with the value.
   */
  static success<TryResult>(result: TryResult): AsyncTry<TryResult> {
    return new AsyncTry<TryResult>(Promise.resolve(result));
  }

  /**
   * Create a new AsyncTry with the result of the executor. If the executor throws, the result will be a failed AsyncTry.
   * If the executor returns a value, the result will be a successful AsyncTry with the value.
   *
   * @param executor An async function that returns a value or throws an error.
   * @returns A new AsyncTry with the result of the executor, or a new failed AsyncTry with the error if one occured in the executor.
   */
  static of<TryResult>(executor: Executor<TryResult>): AsyncTry<TryResult> {
    return new AsyncTry<TryResult>(executor());
  }
}
