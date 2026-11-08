import { injectable } from 'inversify';
import { Logger as PinoInstance, pino } from 'pino';
import { Logger } from './logger.interface.js';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance = pino();

  public info(message: string): void {
    this.logger.info(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public error(message: string, error?: Error): void {
    this.logger.error(error, message);
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }
}
