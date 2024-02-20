import { Try } from '../try';

describe('Try', () => {
  describe('of', () => {
    test('Should return a successful Try when the executor returns a value', () => {
      const tryResult = Try.of(() => 1);
      expect(tryResult.isSuccess()).toBe(true);
      expect(tryResult.get()).toBe(1);
    });

    test('Should return a failure Try when the executor throws an error', () => {
      const tryResult = Try.of(() => {
        throw new Error('Test error');
      });
      expect(tryResult.isFailure()).toBe(true);
      expect(() => tryResult.get()).toThrowError('Test error');
    });
  });

  describe('success', () => {
    test('Should return a successful Try with the result embedded', () => {
      const tryResult = Try.success(1);
      expect(tryResult.isSuccess()).toBe(true);
      expect(tryResult.get()).toBe(1);
    });

    test('Should return a successful Try, even when the result is undefined', () => {
      const tryResult = Try.success(undefined);
      expect(tryResult.isSuccess()).toBe(true);
      expect(tryResult.get()).toBe(undefined);
    });
  });

  describe('failure', () => {
    test('Should return a failure Try with the error embedded', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(tryResult.isFailure()).toBe(true);
      expect(() => tryResult.get()).toThrowError('Test error');
    });
  });

  describe('isSuccess', () => {
    test('Should return true when the Try is a success', () => {
      const tryResult = Try.success(1);
      expect(tryResult.isSuccess()).toBe(true);
    });

    test('Should return false when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(tryResult.isSuccess()).toBe(false);
    });
  });

  describe('isFailure', () => {
    test('Should return true when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(tryResult.isFailure()).toBe(true);
    });

    test('Should return false when the Try is a success', () => {
      const tryResult = Try.success(1);
      expect(tryResult.isFailure()).toBe(false);
    });
  });

  describe('map', () => {
    test('Should return a successful Try with the result of the executor when the Try is a success', () => {
      const tryResult = Try.success(1).map(value => value + 1);
      expect(tryResult.isSuccess()).toBe(true);
      expect(tryResult.get()).toBe(2);
    });

    test('Should return a failure Try with the error when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error')).map(
        value => value + 1
      );
      expect(tryResult.isFailure()).toBe(true);
      expect(() => tryResult.get()).toThrowError('Test error');
    });

    test('Should return a failure Try with the error when the executor throws an error', () => {
      const tryResult = Try.success(1).map(() => {
        throw new Error('Test error');
      });
      expect(tryResult.isFailure()).toBe(true);
      expect(() => tryResult.get()).toThrowError('Test error');
    });
  });

  describe('get', () => {
    test('Should return the result when the Try is a success', () => {
      const tryResult = Try.success(1);
      expect(tryResult.get()).toBe(1);
    });

    test('Should throw the error when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(() => tryResult.get()).toThrowError('Test error');
    });
  });

  describe('getOrElse', () => {
    test('Should return the result when the Try is a success', () => {
      const tryResult = Try.success(1);
      expect(tryResult.getOrElse(() => 2)).toBe(1);
    });

    test('Should return the result of the executor when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(tryResult.getOrElse(() => 2)).toBe(2);
    });

    test('Should apply the executor to the error when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(tryResult.getOrElse(error => error.message)).toBe('Test error');
    });

    test('Should apply the executor to the error when the Try is a failure, even when the executor returns undefined', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(tryResult.getOrElse(() => undefined)).toBe(undefined);
    });
  });

  describe('getOrElseThrow', () => {
    test('Should return the result when the Try is a success', () => {
      const tryResult = Try.success(1);
      expect(tryResult.getOrElseThrow()).toBe(1);
    });

    test('Should throw the error when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(() => tryResult.getOrElseThrow()).toThrowError('Test error');
    });

    test('Should apply the executor to the error when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(() =>
        tryResult.getOrElseThrow(error => new Error(error.message))
      ).toThrowError('Test error');
    });

    test('Should apply the executor to the error when the Try is a failure, even when the executor returns undefined', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(() =>
        tryResult.getOrElseThrow(() => (undefined as unknown) as Error)
      ).toThrowError(undefined);
    });
  });

  describe('getCause', () => {
    test('Should throw an error when the Try is a success', () => {
      const tryResult = Try.success(1);
      expect(() => tryResult.getCause()).toThrowError(
        'Cannot get cause of a successful Try.'
      );
    });

    test('Should return the error when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error'));
      expect(tryResult.getCause()).toBeInstanceOf(Error);
      expect(tryResult.getCause().message).toBe('Test error');
    });
  });

  describe('andThen', () => {
    test('Should run the executor, but return the original Try if the executor did not throw', () => {
      const tryResult = Try.success(1);
      const nextStepTry = tryResult.andThen(() => 2);
      expect(tryResult.isSuccess()).toBe(true);
      expect(tryResult.get()).toBe(1);
      expect(nextStepTry).toBe(tryResult);
    });

    test('Should run the executor, but return a new Try if the executor threw', () => {
      const tryResult = Try.success(1);
      const nextStepTry = tryResult.andThen(() => {
        throw new Error('Test error');
      });
      expect(tryResult.isSuccess()).toBe(true);
      expect(tryResult.get()).toBe(1);
      expect(nextStepTry.isFailure()).toBe(true);
      expect(() => nextStepTry.get()).toThrowError('Test error');
    });
  });

  describe('mapFailure', () => {
    test('Should return a successful Try with the same result when the Try is a success', () => {
      const tryResult = Try.success(1).mapFailure(
        () => new Error('Test error')
      );
      expect(tryResult.isSuccess()).toBe(true);
      expect(tryResult.get()).toBe(1);
    });

    test('Should return a failure Try with the result of the executor when the Try is a failure', () => {
      const tryResult = Try.failure(new Error('Test error')).mapFailure(
        error => new Error(error.message + ', New error')
      );
      expect(tryResult.isFailure()).toBe(true);
      expect(() => tryResult.get()).toThrowError('Test error, New error');
    });

    test('Should return a failure Try with the result of the executor when the executor throws an error', () => {
      const tryResult = Try.failure(new Error('Test error')).mapFailure(() => {
        throw new Error('New error');
      });
      expect(tryResult.isFailure()).toBe(true);
      expect(() => tryResult.get()).toThrowError('New error');
    });
  });
});
