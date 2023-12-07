
export class TryAsync<TryResult, TryError extends Error> {

  constructor(
    private isSuccesful: boolean,
    private readonly result?: TryResult,
    private readonly error?: TryError,
  ) {
    if (result && error) {
      throw new Error('Try cannot be constructed with both a value and an error.');
    }
    if (!result && !error) {
      throw new Error('Try must be constructed with either a value or an error.');
    }
  }

  isSuccess() {
    return this.isSuccesful;
  }

  isFailure() {
    return !this.isSuccesful;
  }

  get() {
    if (this.isSuccess()) {
      return this.result!;
    } else {
      throw this.error;
    }
  }

  async getOrElse<NextTryResult>(executor: (error: TryError) => Promise<NextTryResult>) {
    if (this.isSuccess()) {
      return this.result!;
    } else {
      return await executor(this.error!);
    }
  }

  async getOrElseThrow(failureMapper = async (error: TryError) => { throw error }) {
    if (this.isSuccess()) {
      return this.result!;
    } else {
      throw await failureMapper(this.error!);
    }
  }

  getCause() {
    if (this.isSuccess()) {
      throw new Error('Cannot get cause of a successful Try.');
    } else {
      return this.error!;
    }
  }

  async map<NextTryResult>(executor: (result: TryResult) => Promise<NextTryResult>): Promise<TryAsync<NextTryResult, TryError>> {
    if (this.isSuccess()) {
      return TryAsync.of(async () => executor(this.result!));
    } else {
      return TryAsync.failure(this.error!);
    }
  }
  static async of<TryResult, TryError extends Error>(executor: () => Promise<TryResult>) {
    try {
      const result = await executor();
      return new TryAsync<TryResult, TryError>(true, result);
    } catch (error) {
      return new TryAsync<TryResult, TryError>(false, undefined, (error as TryError));
    }
  }

  static success<TryResult>(value: TryResult) {
    return new TryAsync<TryResult, Error>(true, value);
  }

  static failure<TryResult, TryError extends Error>(error: TryError) {
    return new TryAsync<TryResult, TryError>(false, undefined, error);
  }
}