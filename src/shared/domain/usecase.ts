import { Either } from "@shared/helpers/either";
import { DomainError } from "./domain.error";

export abstract class UseCase<TInput, TOutput, TError extends DomainError = Error> {
  abstract exec(input: TInput): Either<TError, TOutput> | Promise<Either<TError, TOutput>>;
}
