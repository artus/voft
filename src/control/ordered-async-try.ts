type Executor<TryResult> = () => Promise<TryResult>;
type Transformer<PreviousTryResult, NextTryResult> = (
  result: PreviousTryResult
) => NextTryResult;

export class AsyncTry<InitialTryResult, TryResult, TryError extends Error> {
  constructor(
    private readonly initiator: Executor<InitialTryResult>,
    private readonly transformers: ((
      currentResult: InitialTryResult | TryResult
    ) => Promise<InitialTryResult | TryResult>)[] = [],
    private readonly error?: TryError
  ) {}

  map<NextTryResult>(
    transformer: Transformer<TryResult, NextTryResult>
  ): AsyncTry<InitialTryResult, NextTryResult, TryError> {
    return new AsyncTry<InitialTryResult, NextTryResult, TryError>(
      this.initiator,
      [...this.transformers, transformer],
      this.error
    );
  }

  static of<TryResult, TryError extends Error>(
    executor: Executor<TryResult>
  ): AsyncTry<TryResult, TryResult, TryError> {
    return new AsyncTry(executor);
  }
}
