import { AsyncTry } from '../async-try';

const testError = new Error('This is a test error.');

const throwingAsyncExecutor = async (): Promise<number> => {
  throw testError;
};

const successfulAsyncExecutor = async (): Promise<number> => {
  return 1;
};

describe('AsyncTry', () => {
  it('Should only execute each executor or transformer once in a chain.', async () => {
    let executorCalls = 0;
    let transformerCalls = 0;
    const executor = async (): Promise<number> => {
      executorCalls++;
      return 1;
    };
    const numberTransformer = async (value: number): Promise<number> => {
      transformerCalls++;
      return value + 1;
    };
    const stringTransformer = async (value: number): Promise<string> => {
      transformerCalls++;
      return 'Value: ' + value;
    };
    const asyncTry = AsyncTry.of(executor)
      .map(numberTransformer)
      .map(numberTransformer)
      .map(stringTransformer);

    const result = await asyncTry.get();

    const isSuccess = await asyncTry.isSuccess();

    expect(isSuccess).toStrictEqual(true);
    expect(executorCalls).toStrictEqual(1);
    expect(transformerCalls).toStrictEqual(3);
    expect(result).toStrictEqual('Value: 3');
  });

  it('Should be able to handle a lot of chaining', async () => {
    let executorCalls = 0;
    let additionalTransformerCalls = 0;
    let transformerCalls = 0;
    const executor = async (): Promise<number> => {
      executorCalls++;
      return 1;
    };
    const numberTransformer = async (value: number): Promise<number> => {
      transformerCalls++;
      return value + 1;
    };
    const stringTransformer = async (value: number): Promise<string> => {
      transformerCalls++;
      return 'Value: ' + value;
    };
    const additionalTransformer = async (value: number): Promise<number> => {
      additionalTransformerCalls++;
      return value + 1;
    };

    const asyncTry = AsyncTry.of(executor)
      .andThen(additionalTransformer)
      .map(numberTransformer)
      .andThen(additionalTransformer)
      .map(numberTransformer)
      .andThen(additionalTransformer)
      .map(stringTransformer);

    const result = await asyncTry.get();
    const isSuccess = await asyncTry.isSuccess();

    expect(isSuccess).toStrictEqual(true);
    expect(executorCalls).toStrictEqual(1);
    expect(transformerCalls).toStrictEqual(3);
    expect(additionalTransformerCalls).toStrictEqual(3);
    expect(result).toStrictEqual('Value: 3');
  });

  describe('of', () => {
    it('Should return a successful AsyncTry when the provided Executor does not throw.', async () => {
      const result = AsyncTry.of(successfulAsyncExecutor);
      expect(await result.isSuccess()).toStrictEqual(true);
    });

    it('Should return a failure AsyncTry when the provided Executor throws.', async () => {
      const result = AsyncTry.of(throwingAsyncExecutor);
      expect(await result.isFailure()).toStrictEqual(true);
    });
  });

  describe('map', () => {
    it('Should take the result of the previous AsyncTry and return a new AsyncTry with the result of the transformer.', async () => {
      const result = await AsyncTry.of(successfulAsyncExecutor).map(
        async value => value + 1
      );
      expect(await result.get()).toStrictEqual(2);
    });

    it('Should not apply the transformer when the AsyncTry is a failure.', async () => {
      let executionCount = 0;
      const result = AsyncTry.of(throwingAsyncExecutor).map(async value => {
        executionCount++;
        return value + 1;
      });
      expect(await result.isFailure()).toStrictEqual(true);
      expect(executionCount).toStrictEqual(0);
    });
  });

  describe('isSuccess', () => {
    it('Should return true when the AsyncTry is a success.', async () => {
      const result = AsyncTry.of(successfulAsyncExecutor);
      expect(await result.isSuccess()).toStrictEqual(true);
    });

    it('Should return false when the AsyncTry is a failure.', async () => {
      const result = AsyncTry.of(throwingAsyncExecutor);
      expect(await result.isSuccess()).toStrictEqual(false);
    });
  });

  describe('isFailure', () => {
    it('Should return true when the AsyncTry is a failure.', async () => {
      const result = AsyncTry.of(throwingAsyncExecutor);
      expect(await result.isFailure()).toStrictEqual(true);
    });

    it('Should return false when the AsyncTry is a success.', async () => {
      const result = AsyncTry.of(successfulAsyncExecutor);
      expect(await result.isFailure()).toStrictEqual(false);
    });
  });

  describe('get', () => {
    it('Should return the result when the AsyncTry is a success.', async () => {
      const result = AsyncTry.of(successfulAsyncExecutor);
      expect(await result.get()).toStrictEqual(1);
    });

    it('Should throw the error when the AsyncTry is a failure.', async () => {
      const result = AsyncTry.of(throwingAsyncExecutor);
      await expect(result.get()).rejects.toThrowError('This is a test error.');
    });
  });

  describe('getOrElse', () => {
    it('Should return the result when the AsyncTry is a success.', async () => {
      const result = AsyncTry.of(successfulAsyncExecutor);
      expect(await result.getOrElse(async () => 2)).toStrictEqual(1);
    });

    it('Should return the result of the executor when the AsyncTry is a failure.', async () => {
      const result = AsyncTry.of(throwingAsyncExecutor);
      expect(await result.getOrElse(async () => 2)).toStrictEqual(2);
    });
  });

  describe('getOrElseThrow', () => {
    it('Should return the result when the AsyncTry is a success.', async () => {
      const result = AsyncTry.of(successfulAsyncExecutor);
      expect(await result.getOrElseThrow()).toStrictEqual(1);
    });

    it('Should throw the error when the AsyncTry is a failure.', async () => {
      const result = AsyncTry.of(throwingAsyncExecutor);
      await expect(result.getOrElseThrow()).rejects.toThrowError(
        'This is a test error.'
      );
    });

    it('Should throw the error returned by the failureMapper when the AsyncTry is a failure.', async () => {
      const result = AsyncTry.of(throwingAsyncExecutor);
      await expect(
        result.getOrElseThrow(error => new Error('New error: ' + error.message))
      ).rejects.toThrowError('New error: This is a test error.');
    });
  });

  describe('getCause', () => {
    it('Should return the error when the AsyncTry is a failure.', async () => {
      const result = AsyncTry.of(throwingAsyncExecutor);
      expect(await result.getCause()).toStrictEqual(testError);
    });

    it('Should throw an error when the AsyncTry is a success.', async () => {
      const result = AsyncTry.of(successfulAsyncExecutor);
      await expect(result.getCause()).rejects.toThrowError(
        'Cannot get cause of a successful AsyncTry'
      );
    });
  });

  describe('andThen', () => {
    it('Should apply the transformer on the original result, but return an AsyncTry without changing the original result.', async () => {
      let executionCount = 0;
      const result = await AsyncTry.of(successfulAsyncExecutor)
        .andThen(async (value: number) => {
          executionCount++;
          return value + 1;
        })
        .get();
      expect(result).toStrictEqual(1);
      expect(executionCount).toStrictEqual(1);
    });

    it('Should not apply the transformer when the AsyncTry is a failure.', async () => {
      let executionCount = 0;
      const result = AsyncTry.of(throwingAsyncExecutor).andThen(async value => {
        executionCount++;
        return value + 1;
      });
      expect(await result.isFailure()).toStrictEqual(true);
      expect(executionCount).toStrictEqual(0);
    });
  });

  describe('failure', () => {
    it('Should return a failure AsyncTry with the provided error.', async () => {
      const result = AsyncTry.failure(testError);
      expect(await result.isFailure()).toStrictEqual(true);
      expect(await result.getCause()).toStrictEqual(testError);
    });
  });

  describe('success', () => {
    it('Should return a successful AsyncTry with the provided result.', async () => {
      const result = AsyncTry.success(1);
      expect(await result.isSuccess()).toStrictEqual(true);
      expect(await result.get()).toStrictEqual(1);
    });
  });
});
