import { Try } from '../try';

describe('Try', () => {
  describe('of', () => {
    it('Should return a successful Try when the executor returns a value', () => {
      const tryResult = Try.of(() => 1);
      expect(tryResult.isSuccess()).toStrictEqual(true);
      expect(tryResult.get()).toStrictEqual(1);
    });

    it('Should return a failure Try when the executor throws an error', () => {
      const tryResult = Try.of(() => {
        throw new Error('Test error');
      });
      expect(tryResult.isFailure()).toStrictEqual(true);
      expect(() => tryResult.get()).toThrow('Test error');
    });
  });

  describe('success', () => {
    it('Should return a successful Try with the result embedded', () => {
      const tryResult = Try.success(1);
      expect(tryResult.isSuccess()).toStrictEqual(true);
      expect(tryResult.get()).toStrictEqual(1);
    });

    it('Should return a successful Try, even when the result is undefined', () => {
      const tryResult = Try.success(undefined);
      expect(tryResult.isSuccess()).toStrictEqual(true);
      expect(tryResult.get()).toStrictEqual(undefined);
    });
  });

  describe('failure', () => {
    it('Should return a failure Try with the error embedded', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(tryResult.isFailure()).toStrictEqual(true);
      expect(() => tryResult.get()).toThrow('Test error');
    });
  });

  describe('isSuccess', () => {
    it('Should return true when the Try is a success', () => {
      const tryResult = Try.success(1);
      expect(tryResult.isSuccess()).toStrictEqual(true);
    });

    it('Should return false when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(tryResult.isSuccess()).toStrictEqual(false);
    });
  });

  describe('isFailure', () => {
    it('Should return true when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(tryResult.isFailure()).toStrictEqual(true);
    });

    it('Should return false when the Try is a success', () => {
      const tryResult = Try.success(1);
      expect(tryResult.isFailure()).toStrictEqual(false);
    });
  });

  describe('map', () => {
    it('Should return a successful Try with the result of the executor when the Try is a success', () => {
      const tryResult = Try.success(1).map((value) => value + 1);
      expect(tryResult.isSuccess()).toStrictEqual(true);
      expect(tryResult.get()).toStrictEqual(2);
    });

    it('Should return a failure Try with the error when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error')).map(
        (value) => value + 1
      );
      expect(tryResult.isFailure()).toStrictEqual(true);
      expect(() => tryResult.get()).toThrow('Test error');
    });

    it('Should return a failure Try with the error when the executor throws an error', () => {
      const tryResult = Try.success(1).map(() => {
        throw new Error('Test error');
      });
      expect(tryResult.isFailure()).toStrictEqual(true);
      expect(() => tryResult.get()).toThrow('Test error');
    });
  });

  describe('mapAsync', () => {
    it('Should return a new AsyncTry with the result of the transformation.', async () => {
      const tryResult = Try.success(1);
      const asyncTryResult = tryResult.mapAsync(async (value) => value + 1);
      const result = await asyncTryResult.get();
      expect(result).toStrictEqual(2);
    });

    it('Should return a new AsyncTry with the error of the original Try if it was a failure.', async () => {
      const tryResult = Try.failure(new Error('Test error'));
      const asyncTryResult = tryResult.mapAsync(async (value) => value + 1);
      await expect(asyncTryResult.get()).rejects.toThrow('Test error');
    });
  });

  describe('flatMap', () => {
    it('Should return a successful Try with the result of the executor when the Try is a success', () => {
      const tryResult = Try.success(1).flatMap((value) =>
        Try.success(value + 1)
      );
      expect(tryResult.isSuccess()).toStrictEqual(true);
      expect(tryResult.get()).toStrictEqual(2);
    });

    it('Should return a failure Try with the error when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error')).flatMap((value) =>
        Try.success(value + 1)
      );
      expect(tryResult.isFailure()).toStrictEqual(true);
      expect(() => tryResult.get()).toThrow('Test error');
    });

    it('Should return a failure Try with the error when the executor throws an error', () => {
      const tryResult = Try.success(1).flatMap(() => {
        return Try.failure(new Error('Test error'));
      });
      expect(tryResult.isFailure()).toStrictEqual(true);
      expect(() => tryResult.get()).toThrow('Test error');
    });

    it('Should unwrap a nested Try.', () => {
      const tryResult = Try.success(Try.success(1)).flatMap();
      expect(tryResult.isSuccess()).toStrictEqual(true);
      expect(tryResult.get()).toStrictEqual(1);
    });
  });

  describe('get', () => {
    it('Should return the result when the Try is a success', () => {
      const tryResult = Try.success(1);
      expect(tryResult.get()).toStrictEqual(1);
    });

    it('Should throw the error when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(() => tryResult.get()).toThrow('Test error');
    });
  });

  describe('getOrElse', () => {
    it('Should return the result when the Try is a success', () => {
      const tryResult = Try.success(1);
      expect(tryResult.getOrElse(() => 2)).toStrictEqual(1);
    });

    it('Should return the result of the executor when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(tryResult.getOrElse(() => 2)).toStrictEqual(2);
    });

    it('Should apply the executor to the error when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(tryResult.getOrElse((error) => error.message)).toStrictEqual(
        'Test error'
      );
    });

    it('Should apply the executor to the error when the Try is a failure, even when the executor returns undefined', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(tryResult.getOrElse(() => undefined)).toStrictEqual(undefined);
    });
  });

  describe('getOrElseThrow', () => {
    it('Should return the result when the Try is a success', () => {
      const tryResult = Try.success(1);
      expect(tryResult.getOrElseThrow()).toStrictEqual(1);
    });

    it('Should throw the error when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(() => tryResult.getOrElseThrow()).toThrow('Test error');
    });

    it('Should apply the executor to the error when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(() =>
        tryResult.getOrElseThrow((error) => new Error(error.message))
      ).toThrow('Test error');
    });

    it('Should apply the executor to the error when the Try is a failure, even when the executor returns undefined', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(() =>
        tryResult.getOrElseThrow(() => undefined as unknown as Error)
      ).toThrow(undefined);
    });
  });

  describe('getCause', () => {
    it('Should throw an error when the Try is a success', () => {
      const tryResult = Try.success(1);
      expect(() => tryResult.getCause()).toThrow(
        'Cannot get cause of a successful Try.'
      );
    });

    it('Should return the error when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(tryResult.getCause()).toBeInstanceOf(Error);
      expect(tryResult.getCause().message).toStrictEqual('Test error');
    });
  });

  describe('andThen', () => {
    it('Should run the executor, but return the original Try if the executor did not throw', () => {
      const tryResult = Try.success(1);
      const nextStepTry = tryResult.andThen(() => 2);
      expect(tryResult.isSuccess()).toStrictEqual(true);
      expect(tryResult.get()).toStrictEqual(1);
      expect(nextStepTry).toStrictEqual(tryResult);
    });

    it('Should run the executor, but return a new Try if the executor threw', () => {
      const tryResult = Try.success(1);
      const nextStepTry = tryResult.andThen(() => {
        throw new Error('Test error');
      });
      expect(tryResult.isSuccess()).toStrictEqual(true);
      expect(tryResult.get()).toStrictEqual(1);
      expect(nextStepTry.isFailure()).toStrictEqual(true);
      expect(() => nextStepTry.get()).toThrow('Test error');
    });

    it('It should stop subsequent transformations if the transformator throws', () => {
      let executionCount = 0;
      const throwingTransformer = (): void => {
        throw new Error('Test error');
      };

      const incrementingTransformer = (value: number): number => {
        executionCount++;
        return value + 1;
      };

      const tryResult = Try.success(1)
        .map(incrementingTransformer)
        .andThen(throwingTransformer)
        .map(incrementingTransformer);

      expect(tryResult.isFailure()).toStrictEqual(true);
      expect(() => tryResult.get()).toThrow('Test error');
      expect(executionCount).toStrictEqual(1);
    });
  });

  describe('onFailure', () => {
    it('Should run the executor, but return the original Try if the executor did not throw', () => {
      const tryResult = Try.success(1);
      const nextStepTry = tryResult.onFailure(() => {});
      expect(tryResult.isSuccess()).toStrictEqual(true);
      expect(tryResult.get()).toStrictEqual(1);
      expect(nextStepTry).toStrictEqual(tryResult);
    });

    it('Should run the executor, but return a new Try if the executor threw', () => {
      const tryResult = Try.failure(new Error('Test error'));
      const nextStepTry = tryResult.onFailure(() => {
        throw new Error('New error');
      });
      expect(tryResult.isFailure()).toStrictEqual(true);
      expect(() => tryResult.get()).toThrow('Test error');
      expect(nextStepTry.isFailure()).toStrictEqual(true);
      expect(() => nextStepTry.get()).toThrow('New error');
    });

    it('Should do nothing if the Try is a success', () => {
      let executionCount = 0;
      const incrementingTransformer = (): void => {
        executionCount++;
      };

      const tryResult = Try.success(1).onFailure(incrementingTransformer);

      expect(tryResult.isSuccess()).toStrictEqual(true);
      expect(tryResult.get()).toStrictEqual(1);
      expect(executionCount).toStrictEqual(0);
    });
  });

  describe('recoverWith', () => {
    it('Should return a successful Try with the result when the Try is a success', () => {
      const tryResult = Try.success(1).recoverWith(() => 2);
      expect(tryResult.isSuccess()).toStrictEqual(true);
      expect(tryResult.get()).toStrictEqual(1);
    });

    it('Should return a successful Try with the result when the Try is a failure', () => {
      const tryResult = Try.of<number>(() => {
        throw new Error('Test error');
      }).recoverWith(() => 2);
      expect(tryResult.isSuccess()).toStrictEqual(true);
      expect(tryResult.get()).toStrictEqual(2);
    });

    it('Should return a failed Try with the error when the transformer throws an error', () => {
      const tryResult = Try.of<number>(() => {
        throw new Error('Test error');
      }).recoverWith(() => {
        throw new Error('Another test error');
      });
      expect(tryResult.isFailure()).toStrictEqual(true);
      expect(() => tryResult.get()).toThrow('Another test error');
    });
  });

  describe('mapFailure', () => {
    it('Should return a successful Try with the same result when the Try is a success', () => {
      const tryResult = Try.success(1).mapFailure(
        () => new Error('Test error')
      );
      expect(tryResult.isSuccess()).toStrictEqual(true);
      expect(tryResult.get()).toStrictEqual(1);
    });

    it('Should return a failure Try with the result of the executor when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error')).mapFailure(
        (error) => new Error(error.message + ', New error')
      );
      expect(tryResult.isFailure()).toStrictEqual(true);
      expect(() => tryResult.get()).toThrow('Test error, New error');
    });

    it('Should return a failure Try with the result of the executor when the executor throws an error', () => {
      const tryResult = Try.failure(new Error('Test error')).mapFailure(() => {
        throw new Error('New error');
      });
      expect(tryResult.isFailure()).toStrictEqual(true);
      expect(() => tryResult.get()).toThrow('New error');
    });
  });
});
