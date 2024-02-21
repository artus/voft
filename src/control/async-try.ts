type Executor<TryResult> = () => Promise<TryResult>;
type Transformer<TryResult, NextTryResult> = (
  result: TryResult
) => Promise<NextTryResult>;

export class AsyncTry<TryResult> {
  private result?: TryResult;

  private constructor(
    private readonly value?: Promise<TryResult>,
    private error?: Error
  ) {}

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

  async getOrElseThrow(
    failureMapper = (error: Error): Error => error
  ): Promise<TryResult> {
    if (await this.isSuccess()) {
      return this.result!;
    } else {
      throw failureMapper(this.error!);
    }
  }

  async getCause(): Promise<Error> {
    if (await this.isSuccess()) {
      throw new Error('Cannot get cause of a successful AsyncTry.');
    } else {
      return this.error!;
    }
  }

  andThen(transformer: Transformer<TryResult, unknown>): AsyncTry<TryResult> {
    if (this.result) {
      const transformedResult = transformer(this.result).then(
        () => this.result!
      );
      return new AsyncTry(transformedResult);
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

  static failure<TryResult>(error: Error): AsyncTry<TryResult> {
    return new AsyncTry<TryResult>(undefined, error);
  }

  static success<TryResult>(result: TryResult): AsyncTry<TryResult> {
    return new AsyncTry<TryResult>(Promise.resolve(result));
  }

  static of<TryResult>(executor: Executor<TryResult>): AsyncTry<TryResult> {
    return new AsyncTry<TryResult>(executor());
  }
}
