export interface BaseUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>
}

export interface BaseUseCaseWithoutInput<TOutput> {
  execute(): Promise<TOutput>
}
