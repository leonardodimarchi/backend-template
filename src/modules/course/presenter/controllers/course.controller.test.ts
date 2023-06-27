import { DeepMocked, createMock } from 'test/utils/create-mock';
import { Left, Right } from '@shared/helpers/either';
import { createI18nMock } from 'test/utils/create-i18n-mock';
import { CourseController } from './course.controller';
import { CreateCourseUseCase, CreateCourseUseCaseInput } from '@modules/course/domain/usecases/create-course.usecase';
import { MockCourse } from 'test/factories/mock-course';
import { CourseViewModel } from '../models/view-models/course.view-model';
import { InvalidMoneyError } from '@modules/course/domain/errors/invalid-money.error';
import { faker } from '@faker-js/faker';
import { CurrencyCode } from '@modules/course/domain/entities/course/value-objects/money';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InstructorNotFoundError } from '@modules/course/domain/errors/instructor-not-found.error';

describe('CourseController', () => {
  let controller: CourseController;
  let createCourseUseCase: DeepMocked<CreateCourseUseCase>;

  beforeEach(() => {
    createCourseUseCase = createMock<CreateCourseUseCase>();
    controller = new CourseController(createCourseUseCase);
  });

  describe('create', () => {
    it('should return an course view model', async () => {
      const createdCourse = MockCourse.createEntity();
      const expectedResult = new CourseViewModel(createdCourse);

      createCourseUseCase.exec.mockResolvedValueOnce(new Right({ createdCourse }));

      const result = await controller.create(MockCourse.createPayload(), createI18nMock());

      expect(result).toBeInstanceOf(CourseViewModel);
      expect(result).toEqual(expectedResult);
    });

    it('should call the usecase with the correct params', async () => {
      const createdCourse = MockCourse.createEntity();
      const payload = MockCourse.createPayload();

      jest
        .spyOn(createCourseUseCase, 'exec')
        .mockResolvedValueOnce(new Right({ createdCourse }));

      await controller.create(payload, createI18nMock());

      expect(createCourseUseCase.exec).toHaveBeenCalledTimes(1);
      expect(createCourseUseCase.exec).toHaveBeenCalledWith<
        [CreateCourseUseCaseInput]
      >({
        title: payload.title,
        description: payload.description,
        price: payload.price,
        instructorId: payload.instructorId,
      });
    });

    it('should throw a 403 http exception when receiving a invalid money error', async () => {
      createCourseUseCase.exec.mockResolvedValueOnce(
        new Left(new InvalidMoneyError(+faker.commerce.price(), CurrencyCode.USD))
      );

      const call = async () =>
       await controller.create(MockCourse.createPayload(), createI18nMock());

      expect(call).rejects.toThrow(BadRequestException);
    });

    it('should throw a 404 http exception when receiving a instructor not found error', async () => {
      createCourseUseCase.exec.mockResolvedValueOnce(
        new Left(new InstructorNotFoundError(faker.string.uuid()))
      );

      const call = async () =>
       await controller.create(MockCourse.createPayload(), createI18nMock());

      expect(call).rejects.toThrow(NotFoundException);
    });
  });
});
