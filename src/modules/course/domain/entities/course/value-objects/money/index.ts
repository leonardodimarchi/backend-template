import { InvalidMoneyError } from '@modules/course/domain/errors/invalid-money.error';
import { Either, Left, Right } from '@shared/helpers/either';

// Currency following ISO 4217
export enum CurrencyCode {
  BRL = "Brazil Real",
  USD = "United States Dollar",
}

export class Money {
  private constructor(amount: number, currency: CurrencyCode) {
    this._amount = amount;
    this._currency = currency;
    Object.freeze(this);
  }

  static create(amount: number, currency: CurrencyCode = CurrencyCode.USD): Either<InvalidMoneyError, Money> {
    if (!Money.validate(amount)) {
      return new Left(new InvalidMoneyError(amount, currency));
    }

    return new Right(new Money(amount, currency));
  }

  private readonly _amount: number;
  private readonly _currency: string;

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  static validate(amount: number): boolean {
    return amount >= 0;
  }
}
