import { Either, Right } from '@shared/helpers/either';
import { PaginatedEntitiesOptions } from '@shared/infra/database/interfaces/paginated-entities-options.interface.';
import { PaginatedEntities } from '@shared/infra/database/interfaces/paginated-entities.interface';
import { CourseEntity } from '../entities/course/course.entity';
import { CourseRepository } from '../repositories/course.repository';
import { UseCase } from '@shared/domain/usecases/usecase';

export interface GetAllCoursesUseCaseInput {
  paginationOptions: PaginatedEntitiesOptions;
}

export interface GetAllCoursesUseCaseOutput {
  paginatedCourses: PaginatedEntities<CourseEntity>;
}

export type GetAllCoursesUseCaseErrors = Error;

export class GetAllCoursesUseCase
  implements
    UseCase<
      GetAllCoursesUseCaseInput,
      GetAllCoursesUseCaseOutput,
      GetAllCoursesUseCaseErrors
    >
{
  constructor(private readonly repository: CourseRepository) {}

  async exec({
    paginationOptions,
  }: GetAllCoursesUseCaseInput): Promise<
    Either<GetAllCoursesUseCaseErrors, GetAllCoursesUseCaseOutput>
  > {
    const result = await this.repository.getAllPaginated(paginationOptions);

    return new Right({ paginatedCourses: result });
  }
}
