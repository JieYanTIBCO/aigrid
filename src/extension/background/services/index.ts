export interface ServiceAdapter {
  authenticate(): Promise<void>;
  sendMessage(message: string): Promise<string>;
  handleResponse(response: any): void;
}

export abstract class BaseService implements ServiceAdapter {
  abstract authenticate(): Promise<void>;
  abstract sendMessage(message: string): Promise<string>;
  abstract handleResponse(response: any): void;
}
