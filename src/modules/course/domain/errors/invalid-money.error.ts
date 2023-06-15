import { DomainError } from "@shared/domain/domain.error";

export class InvalidMoneyError extends Error implements DomainError {
  constructor(money: number, currency: string) {
    super(`Invalid money: ${money} - ${currency}`);

    this.name = 'InvalidMoneyError';
  }
}
