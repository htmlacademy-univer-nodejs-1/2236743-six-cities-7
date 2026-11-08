import { Logger } from './logger.interface.js';

export class ConsoleLogger implements Logger {
  public info(message: string): void {
    console.info(message);
  }

  public warn(message: string): void {
    console.warn(message);
  }

  public error(message: string, error?: Error): void {
    console.error(error ? `${message}: ${error.message}` : message);
  }

  public debug(message: string): void {
    console.debug(message);
  }
}
