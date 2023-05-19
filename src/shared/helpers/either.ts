export class Left<TLeft, TRight> {
  readonly value: TLeft;

  constructor(value: TLeft) {
    this.value = value;
  }

  isLeft(): this is Left<TLeft, TRight> {
    return true;
  }

  isRight(): this is Right<TLeft, TRight> {
    return false;
  }
}

export class Right<TLeft, TRight> {
  readonly value: TRight;

  constructor(value: TRight) {
    this.value = value;
  }

  isLeft(): this is Left<TLeft, TRight> {
    return false;
  }

  isRight(): this is Right<TLeft, TRight> {
    return true;
  }
}

export type Either<TLeft, TRight> = Left<TLeft, TRight> | Right<TLeft, TRight>;
