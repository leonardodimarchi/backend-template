import { EnrollmentEntity } from '@modules/course/domain/entities/enrollment/enrollment.entity';
import { UserViewModel } from '@modules/user/presenter/models/view-models/user.view-model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityViewModel } from '@shared/presenter/models/base-entity.view-model';
import { UUID } from 'crypto';
import { CourseViewModel } from './course.view-model';

export class EnrollmentViewModel extends BaseEntityViewModel {
  constructor(entity: EnrollmentEntity) {
    super(entity);

    this.studentId = entity.studentId;
    this.courseId = entity.courseId;

    if (entity.course) this.course = new CourseViewModel(entity.course);
    if (entity.student) this.student = new UserViewModel(entity.student);
  }

  @ApiProperty()
  studentId: UUID;

  @ApiProperty()
  courseId: UUID;

  @ApiPropertyOptional({ type: () => UserViewModel })
  student?: UserViewModel;

  @ApiPropertyOptional({ type: () => CourseViewModel })
  course?: CourseViewModel;
}
