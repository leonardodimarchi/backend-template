import { CourseEntity } from "../entities/course/course.entity";

export abstract class CourseRepository {
  abstract save(user: CourseEntity): Promise<void>;
}
