import { Either } from '../either';

describe('Either', () => {
  describe('static right', () => {
    it('should create a new Either with the right value', () => {
      const right = 'right';
      const either = Either.right(right);
      expect(either.isRight()).toBe(true);
      expect(either.isLeft()).toBe(false);
      expect(either.getRight()).toBe(right);
    });

    it('Should not throw an error if the right value is null or undefined', () => {
      expect(() => Either.right(null as unknown as string)).not.toThrow();
      expect(() => Either.right(undefined as unknown as string)).not.toThrow();
    });
  });

  describe('static left', () => {
    it('should create a new Either with the left value', () => {
      const left = 'left';
      const either = Either.left(left);
      expect(either.isLeft()).toBe(true);
      expect(either.isRight()).toBe(false);
      expect(either.getLeft()).toBe(left);
    });

    it('Should not throw an error if the left value is null or undefined', () => {
      expect(() => Either.left(null as unknown as string)).not.toThrow();
      expect(() => Either.left(undefined as unknown as string)).not.toThrow();
    });
  });

  describe('isLeft', () => {
    it('should return true if the Either is left', () => {
      const left = Either.left('left');
      expect(left.isLeft()).toBe(true);
    });

    it('should return false if the Either is right', () => {
      const right = Either.right('right');
      expect(right.isLeft()).toBe(false);
    });

    it('should not throw if the left value is null or undefined', () => {
      const nullLeft = Either.left(null as unknown as string);
      const undefinedLeft = Either.left(undefined as unknown as string);
      expect(nullLeft.isLeft()).toBe(true);
      expect(undefinedLeft.isLeft()).toBe(true);
    });
  });

  describe('isRight', () => {
    it('should return true if the Either is right', () => {
      const right = Either.right('right');
      expect(right.isRight()).toBe(true);
    });

    it('should return false if the Either is left', () => {
      const left = Either.left('left');
      expect(left.isRight()).toBe(false);
    });

    it('should not throw if the right value is null or undefined', () => {
      const nullRight = Either.right(null as unknown as string);
      const undefinedRight = Either.right(undefined as unknown as string);
      expect(nullRight.isRight()).toBe(true);
      expect(undefinedRight.isRight()).toBe(true);
    });
  });

  describe('getLeft', () => {
    it('should return the left value of the Either', () => {
      const left = 'left';
      const either = Either.left(left);
      expect(either.getLeft()).toBe(left);
    });

    it('should throw an error if the Either is right', () => {
      const right = Either.right('right');
      expect(() => right.getLeft()).toThrow();
    });

    it('should not throw if the left value is null or undefined', () => {
      const nullLeft = Either.left(null as unknown as string);
      const undefinedLeft = Either.left(undefined as unknown as string);
      expect(nullLeft.getLeft()).toBe(null);
      expect(undefinedLeft.getLeft()).toBe(undefined);
    });
  });

  describe('getRight', () => {
    it('should return the right value of the Either', () => {
      const right = 'right';
      const either = Either.right(right);
      expect(either.getRight()).toBe(right);
    });

    it('should throw an error if the Either is left', () => {
      const left = Either.left('left');
      expect(() => left.getRight()).toThrow();
    });

    it('should not throw if the right value is null or undefined', () => {
      const nullRight = Either.right(null as unknown as string);
      const undefinedRight = Either.right(undefined as unknown as string);
      expect(nullRight.getRight()).toBe(null);
      expect(undefinedRight.getRight()).toBe(undefined);
    });
  });

  describe('get', () => {
    it('should return the value of the Either if it is right', () => {
      const right = Either.right('right');
      expect(right.get()).toBe('right');
    });

    it('should throw an error if the Either is left', () => {
      const left = Either.left('left');
      expect(() => left.get()).toThrow();
    });

    it('should not throw if the right value is null or undefined', () => {
      const nullRight = Either.right(null as unknown as string);
      const undefinedRight = Either.right(undefined as unknown as string);
      expect(nullRight.get()).toBe(null);
      expect(undefinedRight.get()).toBe(undefined);
    });
  });

  describe('swap', () => {
    it('should return a new Either with the same value but on the opposite side', () => {
      const left = Either.left('left');
      const right = Either.right('right');
      const swappedLeft = left.swap();
      const swappedRight = right.swap();
      expect(swappedLeft.isRight()).toBe(true);
      expect(swappedLeft.getRight()).toBe('left');
      expect(swappedRight.isLeft()).toBe(true);
      expect(swappedRight.getLeft()).toBe('right');
    });

    it('Should not throw an error if the value of the Either is null or undefined', () => {
      const nullLeft = Either.left(null as unknown as string);
      const undefinedLeft = Either.left(undefined as unknown as string);
      const nullRight = Either.right(null as unknown as string);
      const undefinedRight = Either.right(undefined as unknown as string);
      expect(nullLeft.swap().isRight()).toBe(true);
      expect(undefinedLeft.swap().isRight()).toBe(true);
      expect(nullRight.swap().isLeft()).toBe(true);
      expect(undefinedRight.swap().isLeft()).toBe(true);
    });
  });

  describe('mapLeft', () => {
    it('should return a new Either with the left value transformed', () => {
      const left = Either.left('left');
      const right = Either.right('right');
      const mappedLeft = left.mapLeft((value) => value + ' mapped');
      const mappedRight = right.mapLeft((value) => value + ' mapped');
      expect(mappedLeft.isLeft()).toBe(true);
      expect(mappedLeft.getLeft()).toBe('left mapped');
      expect(mappedRight.isRight()).toBe(true);
      expect(mappedRight.getRight()).toBe('right');
    });

    it('should return the same Either if it is right', () => {
      const right = Either.right('right');
      const mappedRight = right.mapLeft((value) => value + ' mapped');
      expect(mappedRight.isRight()).toBe(true);
      expect(mappedRight.getRight()).toBe('right');
    });
  });

  describe('mapRight', () => {
    it('should return a new Either with the right value transformed', () => {
      const left = Either.left('left');
      const right = Either.right('right');
      const mappedLeft = left.mapRight((value) => value + ' mapped');
      const mappedRight = right.mapRight((value) => value + ' mapped');
      expect(mappedLeft.isLeft()).toBe(true);
      expect(mappedLeft.getLeft()).toBe('left');
      expect(mappedRight.isRight()).toBe(true);
      expect(mappedRight.getRight()).toBe('right mapped');
    });

    it('should return the same Either if it is left', () => {
      const left = Either.left('left');
      const mappedLeft = left.mapRight((value) => value + ' mapped');
      expect(mappedLeft.isLeft()).toBe(true);
      expect(mappedLeft.getLeft()).toBe('left');
    });
  });

  describe('map', () => {
    it('should return a new Either with the right value transformed', () => {
      const left = Either.left('left');
      const right = Either.right('right');
      const mappedLeft = left.map((value) => value + ' mapped');
      const mappedRight = right.map((value) => value + ' mapped');
      expect(mappedLeft.isLeft()).toBe(true);
      expect(mappedLeft.getLeft()).toBe('left');
      expect(mappedRight.isRight()).toBe(true);
      expect(mappedRight.getRight()).toBe('right mapped');
    });

    it('should return the same Either if it is left', () => {
      const left = Either.left('left');
      const mappedLeft = left.map((value) => value + ' mapped');
      expect(mappedLeft.isLeft()).toBe(true);
      expect(mappedLeft.getLeft()).toBe('left');
    });
  });
});
