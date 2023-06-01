import { faker } from '@faker-js/faker';
import { Email } from '.';
import { Left, Right } from '@shared/helpers/either';

describe('E-mail', () => {
  test('should accept a valid email', () => {
    expect(Email.create(faker.internet.email())).toBeInstanceOf(Right);
  });
  
  test('should not accept an empty string', () => {
    const email = '';
    expect(Email.create(email)).toBeInstanceOf(Left);
  });

  test('should not accept a string larger than 320 chars', () => {
    const email =
      'l'.repeat(64) + '@' + 'd'.repeat(128) + '.' + 'd'.repeat(127);
    expect(Email.create(email)).toBeInstanceOf(Left);
  });

  test('should not accept domain part larger than 255 chars', () => {
    const email = 'local@' + 'd'.repeat(128) + '.' + 'd'.repeat(127);
    expect(Email.create(email)).toBeInstanceOf(Left);
  });

  test('should not accept local part larger than 64 chars', () => {
    const email = 'l'.repeat(65) + '@mail.com';
    expect(Email.create(email)).toBeInstanceOf(Left);
  });

  test('should not accept an empty local part', () => {
    const email = '@mail.com';
    expect(Email.create(email)).toBeInstanceOf(Left);
  });

  test('should not accept an empty domain', () => {
    const email = 'any@';
    expect(Email.create(email)).toBeInstanceOf(Left);
  });

  test('should not accept domain with a part larger than 63 chars', () => {
    const email = 'any@' + 'd'.repeat(64) + '.com';
    expect(Email.create(email)).toBeInstanceOf(Left);
  });

  test('should not accept a local part with invalid char', () => {
    const email = 'any email@mail.com';
    expect(Email.create(email)).toBeInstanceOf(Left);
  });

  test('should not accept a local part with two dots', () => {
    const email = 'any..email@mail.com';
    expect(Email.create(email)).toBeInstanceOf(Left);
  });

  test('should not accept a local part with ending dot', () => {
    const email = 'any.@mail.com';
    expect(Email.create(email)).toBeInstanceOf(Left);
  });

  test('should not accept an email without an at-sign', () => {
    const email = 'anymail.com';
    expect(Email.create(email)).toBeInstanceOf(Left);
  });
});
