import { EnrollmentEntity } from "../entities/enrollment/enrollment.entity";

export abstract class EnrollmentRepository {
  abstract save(user: EnrollmentEntity): Promise<void>;
}
