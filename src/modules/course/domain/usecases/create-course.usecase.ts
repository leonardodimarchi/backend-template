import { UseCase } from '@shared/domain/usecase';
import { CourseEntity } from '../entities/course/course.entity';
import { Either } from '@shared/helpers/either';

export interface CreateCourseUseCaseInput {
  title: string;
  description: string;
  price: number;
  instructorId: string;
}

export interface CreateCourseUseCaseOutput {
  createdCourse: CourseEntity;
}

export type CreateCourseUseCaseErrors = any;

export class CreateCourseUseCase
  implements
    UseCase<
      CreateCourseUseCaseInput,
      CreateCourseUseCaseOutput,
      CreateCourseUseCaseErrors
    >
{
  async exec({
    title,
    description,
    price,
    instructorId,
  }: CreateCourseUseCaseInput): Promise<
    Either<CreateCourseUseCaseErrors, CreateCourseUseCaseOutput>
  > {
    throw new Error('Method not implemented.');
  }
}
