export interface IWebHookUseCase {
  execute(sig: string, body: any): Promise<void>;
}
