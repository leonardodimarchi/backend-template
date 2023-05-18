export abstract class Usecase<TInput, TOutput> {
  abstract exec(input: TInput): TOutput | Promise<TOutput>;
}
