import { BaseEntity } from './base.entity';

describe('BaseEntity', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be created with a random uuid', () => {
    const entity = new BaseEntity<{}>({});

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuidRegex.test(entity.id)).toBeTruthy();
  });

  it('should be instantiated with a created date', () => {
    const entity = new BaseEntity<{}>({});

    expect(entity.createdAt.getTime()).toEqual(new Date().getTime());
  });

  it('should be instantiated with a updated date', () => {
    const entity = new BaseEntity<{}>({});

    expect(entity.updatedAt.getTime()).toEqual(new Date().getTime());
  });
});
