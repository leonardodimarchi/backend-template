import { InvalidMoneyError } from "@modules/course/domain/errors/invalid-money.error";
import { Money } from ".";

describe('Money', () => {
  it('should not accept negative amount', () => {
    const money = Money.create(-1);

    expect(money.isLeft()).toBeTruthy();
    expect(money.value).toBeInstanceOf(InvalidMoneyError);
  });
});
