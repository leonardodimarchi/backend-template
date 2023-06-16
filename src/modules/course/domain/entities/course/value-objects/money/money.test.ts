import { InvalidMoneyError } from '@modules/course/domain/errors/invalid-money.error';
import { Money } from '.';

describe('Money', () => {
  it('should not accept negative amount', () => {
    const money = Money.create(-1);

    expect(money.isLeft()).toBeTruthy();
    expect(money.value).toBeInstanceOf(InvalidMoneyError);
  });

  it('should be able to have zero as currency', () => {
    const money = Money.create(0);

    expect(money.isRight()).toBeTruthy();
  });

  it('should be able to have integer as currency', () => {
    const money = Money.create(10);

    expect(money.isRight()).toBeTruthy();
  });

  it('should be able to have decimal as currency', () => {
    const money = Money.create(10.523);

    expect(money.isRight()).toBeTruthy();
  });
});
