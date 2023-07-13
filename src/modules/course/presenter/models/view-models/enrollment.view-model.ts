import { EnrollmentEntity } from '@modules/course/domain/entities/enrollment/enrollment.entity';
import { UserViewModel } from '@modules/user/presenter/models/view-models/user.view-model';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityViewModel } from '@shared/presenter/models/base-entity.view-model';
import { CourseViewModel } from './course.view-model';

export class EnrollmentViewModel extends BaseEntityViewModel {
  constructor(entity: EnrollmentEntity) {
    super(entity);

    this.course = new CourseViewModel(entity.course);
    this.student = new UserViewModel(entity.student);
  }

  @ApiProperty({ type: () => CourseViewModel })
  course: CourseViewModel;

  @ApiProperty({ type: () => UserViewModel })
  student: UserViewModel;
}
