import { UseCase } from '@shared/domain/usecase';
import { CourseEntity } from '../entities/course/course.entity';
import { Either, Left, Right } from '@shared/helpers/either';
import { InvalidMoneyError } from '../errors/invalid-money.error';
import { CourseRepository } from '../repositories/course.repository';
import { UUID } from 'crypto';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { InstructorNotFoundError } from '../errors/instructor-not-found.error';

export interface CreateCourseUseCaseInput {
  title: string;
  description: string;
  price: number;
  instructorId: UUID;
}

export interface CreateCourseUseCaseOutput {
  createdCourse: CourseEntity;
}

export type CreateCourseUseCaseErrors = InvalidMoneyError;

export class CreateCourseUseCase
  implements
    UseCase<
      CreateCourseUseCaseInput,
      CreateCourseUseCaseOutput,
      CreateCourseUseCaseErrors
    >
{
  constructor(
    private readonly repository: CourseRepository,
    private readonly userRepository: UserRepository
  ) {}

  async exec({
    title,
    description,
    price,
    instructorId,
  }: CreateCourseUseCaseInput): Promise<
    Either<CreateCourseUseCaseErrors, CreateCourseUseCaseOutput>
  > {
    const instructor = await this.userRepository.getById(instructorId);

    if (!instructor) {
      return new Left(new InstructorNotFoundError(instructorId));
    }

    const courseResult = CourseEntity.create({
      title,
      description,
      price,
      instructor,
    });

    if (courseResult.isLeft()) {
      return new Left(courseResult.value);
    }

    await this.repository.save(courseResult.value);

    return new Right({ createdCourse: courseResult.value });
  }
}
