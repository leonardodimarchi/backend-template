import { UUID } from "crypto";
import { EnrollmentEntity } from "../entities/enrollment/enrollment.entity";

export abstract class EnrollmentRepository {
  abstract save(user: EnrollmentEntity): Promise<void>;
  abstract getByStudentAndCourse(studentId: UUID, courseId: UUID): Promise<EnrollmentEntity | null>;
}
