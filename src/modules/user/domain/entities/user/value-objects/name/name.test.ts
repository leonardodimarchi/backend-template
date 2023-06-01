import { InvalidNameError } from '@modules/user/domain/errors/invalid-name.error';
import { Name } from '.';
import { faker } from '@faker-js/faker';
import { Left, Right } from '@shared/helpers/either';

describe('Name', () => {
  test('should accept a valid name', () => {
    const name = faker.person.fullName();
    expect(Name.create(name)).toBeInstanceOf(Right);
  });

  test('should not accept an empty string', () => {
    const name = '';
    expect(Name.create(name)).toBeInstanceOf(Left);
  });

  test('should not accept only whitespaces', () => {
    const name = ' ';
    expect(Name.create(name)).toBeInstanceOf(Left);
  });

  test('should accept exactly 256 chars', () => {
    const name = '.'.repeat(256)
    expect(Name.create(name)).toBeInstanceOf(Right);
  });

  test('should not accept more than 256 chars', () => {
    const name = '.'.repeat(256 + 1);
    expect(Name.create(name)).toBeInstanceOf(Left);
  });

  test('should not accept less than 2 chars', () => {
    const name = '.';
    expect(Name.create(name)).toBeInstanceOf(Left);
  });
});
