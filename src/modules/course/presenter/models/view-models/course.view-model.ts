import { CourseEntity } from "@modules/course/domain/entities/course/course.entity";
import { UserViewModel } from "@modules/user/presenter/models/view-models/user.view-model";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntityViewModel } from "@shared/presenter/models/base-entity.view-model";

export class CourseViewModel extends BaseEntityViewModel {
  constructor(entity: CourseEntity) {
    super(entity);

    this.title = entity.title;
    this.description = entity.description;
    this.price = entity.price.amount;
    this.instructor = new UserViewModel(entity.instructor);
  }

  @ApiProperty({ example: 'Flutter with Clean Architecture and TDD' })
  title: string;

  @ApiProperty({ example: 'Within this course, we will learn how to build good flutter applications' })
  description: string;

  @ApiProperty({ example: 49.99 })
  price: number;

  @ApiProperty({ type: () => UserViewModel })
  instructor: UserViewModel;
}
