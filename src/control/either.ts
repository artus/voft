enum EitherSide {
  Left,
  Right,
  None
}

export class Either<Left, Right> {

  private constructor(
    private readonly activeSide: EitherSide = EitherSide.None,
    private readonly _left?: Left,
    private readonly _right?: Right
  ){
    if (_left && _right) {
      throw new Error('Either cannot be constructed with both a left and a right.');
    }
    if (!_left && !_right) {
      throw new Error('Either must be constructed with either a left or a right.');
    }
  }

  right() {
    return new ProjectedEither(this._right, this._left);
  }

  left() {
    return new ProjectedEither(this._left, this._right);
  }

  isLeft() {
    return this.activeSide === EitherSide.Left;
  }

  isRight() {
    return this.activeSide=== EitherSide.Right;
  }

  getLeft() {
    if (this.isLeft()) {
      return this._left!;
    } else {
      throw new Error('Cannot get left of right Either.');
    }
  }

  getRight() {
    if (this.isRight()) {
      return this._right!;
    } else {
      throw new Error('Cannot get right of left Either.');
    }
  }

  swap() {
    const activeSide = this.activeSide === EitherSide.None ? EitherSide.None : this.activeSide === EitherSide.Left ? EitherSide.Right : EitherSide.Left;
    return new Either(activeSide, this._right, this._left);
  }

  static Left<Left, Right>(left: Left) {
    return new Either<Left, Right>(EitherSide.Left, left) as Either<Left, never>;
  }

  static right<Right>(right: Right) {
    return new Either(EitherSide.Right, undefined, right) as Either<never, Right>
  }
}

class ProjectedEither<ActualValue, AlternativeValue> {
  constructor(
    private readonly actualValue?: ActualValue,
    private readonly alternativeValue?: AlternativeValue,
  ) {}

  map<NextActualValue>(executor: (value: ActualValue) => NextActualValue | Promise<NextActualValue>) {
    if (this.actualValue) {
      return new ProjectedEither<NextActualValue | Promise<NextActualValue>, AlternativeValue>(executor(this.actualValue));
    }
    return this;
  }

  get() {
    if (!this.actualValue) {
      throw new Error("There is no value on this side of the Either.");
    }

    return this.actualValue;
  }

  getOrElse<NextAlternativeValue>(executor: (value: AlternativeValue) =>  NextAlternativeValue | Promise<NextAlternativeValue>) {
    if (!this.actualValue) {
      return executor(this.alternativeValue!);
    }

    return this.actualValue;
  }
}