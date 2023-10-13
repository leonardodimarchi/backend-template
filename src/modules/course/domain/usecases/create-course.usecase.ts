import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { UseCase } from '@shared/domain/usecase';
import { Either, Left, Right } from '@shared/helpers/either';
import { UUID } from 'crypto';
import { CourseEntity } from '../entities/course/course.entity';
import { InstructorNotFoundError } from '../errors/instructor-not-found.error';
import { InvalidMoneyError } from '../errors/invalid-money.error';
import { CourseRepository } from '../repositories/course.repository';

export interface CreateCourseUseCaseInput {
  title: string;
  description: string;
  price: number;
  instructorId: UUID;
}

export interface CreateCourseUseCaseOutput {
  createdCourse: CourseEntity;
}

export type CreateCourseUseCaseErrors =
  | InvalidMoneyError
  | InstructorNotFoundError;

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
    private readonly userRepository: UserRepository,
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
      instructorId,
    });

    if (courseResult.isLeft()) {
      return new Left(courseResult.value);
    }

    await this.repository.save(courseResult.value);

    return new Right({ createdCourse: courseResult.value });
  }
}
