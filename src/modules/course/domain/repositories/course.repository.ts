import { UUID } from "crypto";
import { CourseEntity } from "../entities/course/course.entity";

export abstract class CourseRepository {
  abstract save(user: CourseEntity): Promise<void>;
  abstract getById(id: UUID): Promise<CourseEntity | null>;
}
