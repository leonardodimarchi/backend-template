import { faker } from '@faker-js/faker';
import { CourseEntity } from '@modules/course/domain/entities/course/course.entity';
import { CurrencyCode } from '@modules/course/domain/entities/course/value-objects/money';
import { CourseNotFoundError } from '@modules/course/domain/errors/course-not-found.error';
import { InstructorNotFoundError } from '@modules/course/domain/errors/instructor-not-found.error';
import { InvalidMoneyError } from '@modules/course/domain/errors/invalid-money.error';
import { StudentAlreadyEnrolledError } from '@modules/course/domain/errors/student-already-enrolled.error';
import { StudentNotFoundError } from '@modules/course/domain/errors/student-not-found.error';
import {
  CreateCourseUseCase,
  CreateCourseUseCaseInput,
} from '@modules/course/domain/usecases/create-course.usecase';
import {
  EnrollStudentInCourseUseCase,
  EnrollStudentInCourseUseCaseInput,
} from '@modules/course/domain/usecases/enroll-student-in-course.usecase';
import {
  GetAllCoursesUseCase,
  GetAllCoursesUseCaseInput,
} from '@modules/course/domain/usecases/get-all-courses.usecase';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Left, Right } from '@shared/helpers/either';
import { PaginatedEntities } from '@shared/infra/database/interfaces/paginated-entities.interface';
import { PaginatedViewModel } from '@shared/presenter/models/paginated.view-model.';
import { MockCourse } from 'test/factories/mock-course';
import { MockEnrollment } from 'test/factories/mock-enrollment';
import { createI18nMock } from 'test/utils/create-i18n-mock';
import { DeepMocked, createMock } from 'test/utils/create-mock';
import { CourseViewModel } from '../models/view-models/course.view-model';
import { EnrollmentViewModel } from '../models/view-models/enrollment.view-model';
import { CourseController } from './course.controller';

describe('CourseController', () => {
  let controller: CourseController;
  let createCourseUseCase: DeepMocked<CreateCourseUseCase>;
  let enrollStudentInCourseUseCase: DeepMocked<EnrollStudentInCourseUseCase>;
  let getAllCoursesUseCase: DeepMocked<GetAllCoursesUseCase>;

  beforeEach(() => {
    createCourseUseCase = createMock<CreateCourseUseCase>();
    enrollStudentInCourseUseCase = createMock<EnrollStudentInCourseUseCase>();
    getAllCoursesUseCase = createMock<GetAllCoursesUseCase>();
    controller = new CourseController(
      createCourseUseCase,
      enrollStudentInCourseUseCase,
      getAllCoursesUseCase,
    );
  });

  describe('getAll', () => {
    it('should return an paginated course view model', async () => {
      const items: PaginatedEntities<CourseEntity> = {
        page: 1,
        pageLimit: 5,
        totalPageCount: 2,
        entities: [
          MockCourse.createEntity(),
          MockCourse.createEntity(),
          MockCourse.createEntity(),
          MockCourse.createEntity(),
          MockCourse.createEntity(),
        ],
      };
      const expectedResult = new PaginatedViewModel(items, CourseViewModel);

      getAllCoursesUseCase.exec.mockResolvedValueOnce(
        new Right({ paginatedCourses: items }),
      );

      const result = await controller.getAll({ page: 1, pageLimit: 5 });

      expect(result).toBeInstanceOf(PaginatedViewModel);
      expect(result).toEqual(expectedResult);
    });

    it('should call the usecase with the correct params', async () => {
      const items: PaginatedEntities<CourseEntity> = {
        page: 1,
        pageLimit: 5,
        totalPageCount: 1,
        entities: [MockCourse.createEntity()],
      };

      getAllCoursesUseCase.exec.mockResolvedValueOnce(
        new Right({ paginatedCourses: items }),
      );

      await controller.getAll({ page: 1, pageLimit: 5 });

      expect(getAllCoursesUseCase.exec).toHaveBeenCalledTimes(1);
      expect(getAllCoursesUseCase.exec).toHaveBeenCalledWith<
        [GetAllCoursesUseCaseInput]
      >({
        paginationOptions: {
          page: 1,
          pageLimit: 5,
        },
      });
    });

    it('should throw a 500 http exception when receiving an unknown error', async () => {
      getAllCoursesUseCase.exec.mockResolvedValueOnce(new Left(new Error()));

      const call = async () =>
        await controller.getAll({ page: 1, pageLimit: 5 });

      expect(call).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('create', () => {
    it('should return an course view model', async () => {
      const createdCourse = MockCourse.createEntity();
      const expectedResult = new CourseViewModel(createdCourse);

      createCourseUseCase.exec.mockResolvedValueOnce(
        new Right({ createdCourse }),
      );

      const result = await controller.create(
        MockCourse.createPayload(),
        createI18nMock(),
      );

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
        new Left(
          new InvalidMoneyError(+faker.commerce.price(), CurrencyCode.USD),
        ),
      );

      const call = async () =>
        await controller.create(MockCourse.createPayload(), createI18nMock());

      expect(call).rejects.toThrow(BadRequestException);
    });

    it('should throw a 404 http exception when receiving a instructor not found error', async () => {
      createCourseUseCase.exec.mockResolvedValueOnce(
        new Left(new InstructorNotFoundError(faker.string.uuid())),
      );

      const call = async () =>
        await controller.create(MockCourse.createPayload(), createI18nMock());

      expect(call).rejects.toThrow(NotFoundException);
    });
  });

  describe('enrollStudent', () => {
    it('should return an enrollment view model', async () => {
      const createdEnrollment = MockEnrollment.createEntity();
      const expectedResult = new EnrollmentViewModel(createdEnrollment);

      enrollStudentInCourseUseCase.exec.mockResolvedValueOnce(
        new Right({ createdEnrollment }),
      );

      const result = await controller.enrollStudent(
        MockEnrollment.createPayload(),
        createI18nMock(),
      );

      expect(result).toBeInstanceOf(EnrollmentViewModel);
      expect(result).toEqual(expectedResult);
    });

    it('should call the usecase with the correct params', async () => {
      const createdEnrollment = MockEnrollment.createEntity();
      const payload = MockEnrollment.createPayload();

      jest
        .spyOn(enrollStudentInCourseUseCase, 'exec')
        .mockResolvedValueOnce(new Right({ createdEnrollment }));

      await controller.enrollStudent(payload, createI18nMock());

      expect(enrollStudentInCourseUseCase.exec).toHaveBeenCalledTimes(1);
      expect(enrollStudentInCourseUseCase.exec).toHaveBeenCalledWith<
        [EnrollStudentInCourseUseCaseInput]
      >({
        courseId: payload.courseId,
        studentId: payload.studentId,
      });
    });

    it('should throw a 404 http exception when receiving a course not found error', async () => {
      enrollStudentInCourseUseCase.exec.mockResolvedValueOnce(
        new Left(new CourseNotFoundError(faker.string.uuid())),
      );

      const call = async () =>
        await controller.enrollStudent(
          MockEnrollment.createPayload(),
          createI18nMock(),
        );

      expect(call).rejects.toThrow(NotFoundException);
    });

    it('should throw a 404 http exception when receiving a student not found error', async () => {
      enrollStudentInCourseUseCase.exec.mockResolvedValueOnce(
        new Left(new StudentNotFoundError(faker.string.uuid())),
      );

      const call = async () =>
        await controller.enrollStudent(
          MockEnrollment.createPayload(),
          createI18nMock(),
        );

      expect(call).rejects.toThrow(NotFoundException);
    });

    it('should throw a 409 http exception when receiving a student already enrolled error', async () => {
      enrollStudentInCourseUseCase.exec.mockResolvedValueOnce(
        new Left(
          new StudentAlreadyEnrolledError(
            faker.string.uuid(),
            faker.string.uuid(),
          ),
        ),
      );

      const call = async () =>
        await controller.enrollStudent(
          MockEnrollment.createPayload(),
          createI18nMock(),
        );

      expect(call).rejects.toThrow(ConflictException);
    });
  });
});
