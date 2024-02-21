enum EitherSide {
  Left,
  Right,
  None,
}

export class Either<Left, Right> {
  private constructor(
    private readonly activeSide: EitherSide = EitherSide.None,
    private readonly _left?: Left,
    private readonly _right?: Right
  ) {
    if (_left && _right) {
      throw new Error(
        'Either cannot be constructed with both a left and a right.'
      );
    }
    if (!_left && !_right) {
      throw new Error(
        'Either must be constructed with either a left or a right.'
      );
    }
  }

  right(): ProjectedEither<Right, Left> {
    return new ProjectedEither(this._right, this._left);
  }

  left(): ProjectedEither<Left, Right> {
    return new ProjectedEither(this._left, this._right);
  }

  isLeft(): boolean {
    return this.activeSide === EitherSide.Left;
  }

  isRight(): boolean {
    return this.activeSide === EitherSide.Right;
  }

  getLeft(): Left {
    if (this.isLeft()) {
      return this._left!;
    } else {
      throw new Error('Cannot get left of right Either.');
    }
  }

  getRight(): Right {
    if (this.isRight()) {
      return this._right!;
    } else {
      throw new Error('Cannot get right of left Either.');
    }
  }

  swap(): Either<Right, Left> {
    const activeSide =
      this.activeSide === EitherSide.None
        ? EitherSide.None
        : this.activeSide === EitherSide.Left
        ? EitherSide.Right
        : EitherSide.Left;
    return new Either(activeSide, this._right, this._left);
  }

  static Left<Left, Right>(left: Left): Either<Left, Right> {
    return new Either<Left, Right>(EitherSide.Left, left);
  }

  static right<Left, Right>(right: Right): Either<Left, Right> {
    return new Either(EitherSide.Right, (undefined as unknown) as Left, right);
  }
}

class ProjectedEither<ActualValue, AlternativeValue> {
  constructor(
    private readonly actualValue?: ActualValue,
    private readonly alternativeValue?: AlternativeValue
  ) {}

  map<NextActualValue>(
    executor: (value: ActualValue) => NextActualValue
  ):
    | ProjectedEither<NextActualValue, AlternativeValue>
    | ProjectedEither<ActualValue, AlternativeValue> {
    if (this.actualValue) {
      return new ProjectedEither<NextActualValue, AlternativeValue>(
        executor(this.actualValue)
      );
    }
    return this;
  }

  get(): ActualValue {
    if (!this.actualValue) {
      throw new Error('There is no value on this side of the Either.');
    }

    return this.actualValue;
  }

  getOrElse<NextAlternativeValue>(
    executor: (value: AlternativeValue) => NextAlternativeValue
  ): ActualValue | NextAlternativeValue {
    if (!this.actualValue) {
      return executor(this.alternativeValue!);
    }

    return this.actualValue;
  }
}
