import { Optional } from '../optional';

describe('Optional', () => {
  describe('of', () => {
    it('should return an Optional with a value', () => {
      const optional = Optional.of(5);
      expect(optional.isPresent()).toBe(true);
      expect(optional.get()).toBe(5);
    });

    it('Should return an empty Optional if the value is null or undefined', () => {
      expect(Optional.of(null).isPresent()).toBe(false);
      expect(Optional.of(undefined).isPresent()).toBe(false);
    });
  });

  describe('empty', () => {
    it('Should return an empty Optional', () => {
      const optional = Optional.empty();
      expect(optional.isPresent()).toBe(false);
    });
  });

  describe('get', () => {
    it('Should return the value if present', () => {
      const optional = Optional.of(5);
      expect(optional.get()).toStrictEqual(5);
    });

    it('Should throw an error if the value is not present', () => {
      const optional = Optional.empty();
      expect(() => optional.get()).toThrow(
        'Cannot get value of an empty Optional'
      );
    });
  });

  describe('map', () => {
    it('Should return a new Optional with the transformed value if present', () => {
      const optional = Optional.of(5);
      const newOptional = optional.map((value) => value * 2);
      expect(newOptional.get()).toStrictEqual(10);
    });

    it('Should return an empty Optional if the value is not present', () => {
      const optional = Optional.of<number>(undefined as unknown as number);
      const newOptional = optional.map((value) => value * 2);
      expect(newOptional.isPresent()).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('Should return true if the value is not present', () => {
      const optional = Optional.empty();
      expect(optional.isEmpty()).toBe(true);
    });

    it('Should return false if the value is present', () => {
      const optional = Optional.of(5);
      expect(optional.isEmpty()).toBe(false);
    });
  });

  describe('getOrElse', () => {
    it('Should return the value if present', () => {
      const optional = Optional.of(5);
      expect(optional.getOrElse(() => 10)).toStrictEqual(5);
    });

    it('Should return the executor result if the value is not present', () => {
      const optional = Optional.empty();
      expect(optional.getOrElse(() => 10)).toStrictEqual(10);
    });
  });

  describe('getOrElseThrow', () => {
    it('Should return the value if present', () => {
      const optional = Optional.of(5);
      expect(optional.getOrElseThrow()).toStrictEqual(5);
    });

    it('Should throw the error if the value is not present', () => {
      const optional = Optional.empty();
      expect(() => optional.getOrElseThrow()).toThrow(
        'Cannot get value of an empty Optional'
      );
    });

    it('Should allow the use of a failure mapper', () => {
      const failureMapper = (error: Error): Error =>
        new Error('Custom error: ' + error.message);
      const optional = Optional.empty();
      expect(() => optional.getOrElseThrow(failureMapper)).toThrow(
        'Custom error: Cannot get value of an empty Optional'
      );
    });
  });

  describe('filter', () => {
    it('Should return the Optional if the predicate is true', () => {
      const optional = Optional.of(5);
      const newOptional = optional.filter((value) => value > 3);
      expect(newOptional.get()).toStrictEqual(5);
    });

    it('Should return an empty Optional if the predicate is false', () => {
      const optional = Optional.of(5);
      const newOptional = optional.filter((value) => value > 10);
      expect(newOptional.isPresent()).toBe(false);
    });
  });

  describe('ifPresent', () => {
    it('Should execute the consumer if the value is present', () => {
      const optional = Optional.of(5);
      let value = 0;
      optional.ifPresent((v) => {
        value = v;
      });
      expect(value).toStrictEqual(5);
    });

    it('Should not execute the consumer if the value is not present', () => {
      const optional = Optional.empty();
      let value = 0;
      optional.ifPresent(() => {
        value = 5;
      });
      expect(value).toStrictEqual(0);
    });
  });
});
