import { InvalidNameError } from '@modules/user/domain/errors/invalid-name.error';
import { Either, Left, Right } from '@shared/helpers/either';

export class Name {
  private constructor(name: string) {
    this.name = name;
    Object.freeze(this);
  }

  static create(name: string): Either<InvalidNameError, Name> {
    if (!Name.validate(name)) {
      return new Left(new InvalidNameError(name));
    }

    return new Right(new Name(name));
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
