import { InvalidNameError } from '@modules/user/domain/errors/invalid-name.error';

export class Name {
  private constructor(name: string) {
    this.name = name;
    Object.freeze(this);
  }

  static create(name: string): Name {
    if (!Name.validate(name)) {
      throw new InvalidNameError(name);
    }

    return new Name(name);
  }

  private readonly name: string;

  get value(): string {
    return this.name;
  }

  static validate(name: string): boolean {
    const trimmedName = name.trim();

    if (!trimmedName.length) {
      return false;
    }

    if (trimmedName.length < 2) {
      return false;
    }

    if (trimmedName.length > 256) {
      return false;
    }

    return true;
  }
}
