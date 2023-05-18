export abstract class UseCase<TInput, TOutput> {
  abstract exec(input: TInput): TOutput | Promise<TOutput>;
}
