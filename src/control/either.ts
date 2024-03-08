enum EitherSide {
  Left,
  Right,
}

/**
 * An Either is a datastructure that represents a value that can be of type 'Left' or 'Right'. It is used to represent the result of a computation that can fail.
 * By convention, the 'Left' type is used to represent the failure and the 'Right' type is used to represent the success.
 * An Either supports values that are null or undefined. It's up the consumer to decide if these values are valid or not.
 * When an Either is created, an ActiveSide is set. This ActiveSide is used to determine if the Either is a 'Left' or a 'Right', *not* the value itself.
 */
export class Either<Left, Right> {
  private constructor(
    private readonly activeSide: EitherSide,
    private readonly left?: Left,
    private readonly right?: Right
  ) {}

  /**
   * Check if the Either is a 'Left'.
   * @returns true if the Either is a 'Left', false otherwise.
   */
  isLeft(): boolean {
    return this.activeSide === EitherSide.Left;
  }

  /**
   * Check if the Either is a 'Right'.
   * @returns true if the Either is a 'Right', false otherwise.
   */
  isRight(): boolean {
    return this.activeSide === EitherSide.Right;
  }

  /**
   * Get the 'Left' value of the Either.
   * @returns The 'Left' value of the Either.
   * @throws An error if the Either is a 'Right'.
   */
  getLeft(): Left {
    if (this.isLeft()) {
      return this.left!;
    } else {
      throw new Error('Cannot get left of right Either.');
    }
  }

  /**
   * Get the 'Right' value of the Either.
   * @returns The 'Right' value of the Either.
   * @throws An error if the Either is a 'Left'.
   */
  getRight(): Right {
    if (this.isRight()) {
      return this.right!;
    } else {
      throw new Error('Cannot get right of left Either.');
    }
  }

  /**
   * Alias for 'getRight'. Get the value of the Either. If the Either is a 'Left', it will throw an error. If the Either is a 'Right', it will return the value.
   * @returns The value of the Either.
   * @throws An error if the Either is a 'Left'.
   */
  get(): Right {
    return this.getRight();
  }

  /**
   * Swap the Either. If the Either is a 'Left', it will become a 'Right' with the same value. If the Either is a 'Right', it will become a 'Left' with the same value.
   * @returns A new Either with the same value but on the opposite side.
   */
  swap(): Either<Right, Left> {
    return this.activeSide === EitherSide.Left
      ? Either.right(this.left!)
      : Either.left(this.right!);
  }

  /**
   * Maps the 'Left' value of the Either to a new value. If the Either is a 'Right', it will return a new 'Right' Either with the same value. If the Either is a 'Left', it will return a new 'Left' Either with the new value.
   * @param transformer A function that takes the 'Left' value and returns a new value.
   * @returns A new Either with the mapped 'Left' value if it was present, or the same 'Right' value if it was present.
   */
  mapLeft<NewLeft>(
    transformer: (left: Left) => NewLeft
  ): Either<NewLeft, Right> {
    return this.isLeft()
      ? Either.left(transformer(this.left!))
      : Either.right(this.right!);
  }

  /**
   * Maps the 'Right' value of the Either to a new value. If the Either is a 'Left', it will return a new 'Left' Either with the same value. If the Either is a 'Right', it will return a new 'Right' Either with the new value.
   * @param transformer A function that takes the 'Right' value and returns a new value.
   * @returns A new Either with the mapped 'Right' value if it was present, or the same 'Left' value if it was present.
   */
  mapRight<NewRight>(
    transformer: (right: Right) => NewRight
  ): Either<Left, NewRight> {
    return this.isRight()
      ? Either.right(transformer(this.right!))
      : Either.left(this.left!);
  }

  /**
   * Alias for 'mapRight'. Maps the 'Right' value of the Either to a new value. If the Either is a 'Left', it will return a new 'Left' Either with the same value. If the Either is a 'Right', it will return a new 'Right' Either with the new value.
   * @param transformer A function that takes the 'Right' value and returns a new value.
   * @returns A new Either with the mapped 'Right' value if it was present, or the same 'Left' value if it was present.
   */
  map<NewRight>(
    transformer: (right: Right) => NewRight
  ): Either<Left, NewRight> {
    return this.mapRight(transformer);
  }

  /**
   * Create a new 'Left' Either.
   * @param left The value of the 'Left' Either.
   * @returns A new 'Left' Either.
   */
  static left<Left, Right>(left: Left): Either<Left, Right> {
    return new Either<Left, Right>(EitherSide.Left, left);
  }

  /**
   * Create a new 'Right' Either.
   * @param right The value of the 'Right' Either.
   * @returns A new 'Right' Either.
   */
  static right<Left, Right>(right: Right): Either<Left, Right> {
    return new Either(EitherSide.Right, undefined as unknown as Left, right);
  }
}
