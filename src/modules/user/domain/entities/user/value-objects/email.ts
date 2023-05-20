import { InvalidEmailError } from '@modules/user/domain/errors/invalid-email.error';

export class Email {
  private constructor(email: string) {
    this.email = email;
    Object.freeze(this)
  }

  static create(email: string): Email {
    if (!Email.validate(email)) {
      throw new InvalidEmailError(email);
    }

    return new Email(email);
  }

  private readonly email: string;

  get value(): string {
    return this.email;
  }

  static validate(email: string): boolean {
    function emptyOrTooLarge(str: string, maxSize: number): boolean {
      if (!str || str.length > maxSize) {
        return true;
      }

      return false;
    }

    function nonConformant(email: string): boolean {
      const emailRegex =
        /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

      return !emailRegex.test(email);
    }

    function somePartIsTooLargeIn(domain: string): boolean {
      const maxPartSize = 63;
      const domainParts = domain.split('.');

      return domainParts.some(function (part) {
        return part.length > maxPartSize;
      });
    }

    const maxEmailSize = 320;

    if (emptyOrTooLarge(email, maxEmailSize) || nonConformant(email)) {
      return false;
    }

    const [local, domain] = email.split('@');
    const maxLocalSize = 64;
    const maxDomainSize = 255;

    if (
      emptyOrTooLarge(local, maxLocalSize) ||
      emptyOrTooLarge(domain, maxDomainSize)
    ) {
      return false;
    }

    if (somePartIsTooLargeIn(domain)) {
      return false;
    }

    return true;
  }
}
