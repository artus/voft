type Executor<TryResult> = () => Promise<TryResult>;
type Transformer<TryResult, NextTryResult> = (
  result: TryResult
) => Promise<NextTryResult>;

export class AsyncTry<TryResult, TryError extends Error> {
  private result: TryResult | undefined;

  private constructor(
    private readonly value?: Promise<TryResult>,
    private error?: TryError
  ) {
    if (value && error) {
      throw new Error(
        'Try cannot be constructed with both a value and an error.'
      );
    }
  }

  map<NextTryResult>(
    transformer: Transformer<TryResult, NextTryResult>
  ): AsyncTry<NextTryResult, TryError> {
    if (this.value) {
      const transformedResult = this.value.then(transformer);
      return AsyncTry.of(() => transformedResult);
    } else {
      return new AsyncTry<NextTryResult, TryError>(undefined, this.error);
    }
  }

  async isSuccess(): Promise<boolean> {
    if (this.error) {
      return Promise.resolve(false);
    }

    if (this.value && this.result) {
      return Promise.resolve(true);
    } else if (this.value) {
      try {
        const result = await this.value;
        this.result = result;
        return this.isSuccess();
      } catch (error) {
        this.error = error as TryError;
        return Promise.resolve(false);
      }
    } else {
      return Promise.resolve(false);
    }
  }

  async isFailure(): Promise<boolean> {
    const isSuccess = await this.isSuccess();
    return !isSuccess;
  }

  async get(): Promise<TryResult> {
    if (await this.isSuccess()) {
      return this.result!;
    } else {
      throw this.error;
    }
  }

  async getOrElse(
    alternativeProvider: (error: TryError) => Promise<TryResult>
  ): Promise<TryResult> {
    if (this.value) {
      try {
        return await this.value;
      } catch (error) {
        return alternativeProvider(error as TryError);
      }
    } else if (this.error) {
      return alternativeProvider(this.error);
    } else {
      throw new Error('Cannot get value of an empty AsyncTry');
    }
  }

  async getOrElseThrow(
    failureMapper = (error: TryError): Error => error
  ): Promise<TryResult> {
    if (await this.isSuccess()) {
      return this.result!;
    } else {
      throw failureMapper(this.error!);
    }
  }

  async getCause(): Promise<TryError> {
    if (await this.isSuccess()) {
      throw new Error('Cannot get cause of a successful AsyncTry.');
    } else {
      return this.error!;
    }
  }

  andThen(
    transformer: Transformer<TryResult, unknown>
  ): AsyncTry<TryResult, TryError> {
    if (this.value) {
      const containedValue = this.value;
      const transformedResult = containedValue
        .then(transformer)
        .then(() => containedValue);
      return new AsyncTry(transformedResult);
    } else {
      return new AsyncTry<TryResult, TryError>(undefined, this.error);
    }
  }

  static failure<TryResult, TryError extends Error>(
    error: TryError
  ): AsyncTry<TryResult, TryError> {
    return new AsyncTry<TryResult, TryError>(undefined, error);
  }

  static success<TryResult, TryError extends Error>(
    result: TryResult
  ): AsyncTry<TryResult, TryError> {
    return new AsyncTry<TryResult, TryError>(Promise.resolve(result));
  }

  static of<TryResult, TryError extends Error>(
    executor: Executor<TryResult>
  ): AsyncTry<TryResult, TryError> {
    return new AsyncTry<TryResult, TryError>(executor());
  }
}
