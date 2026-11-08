import { config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { Config } from './config.interface.js';
import { configRestSchema, RestSchema } from './rest.schema.js';
import { Component } from '../../types/index.js';
import { Logger } from '../logger/index.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    const { error } = config({ quiet: true });

    if (error) {
      this.logger.warn('.env file not found, using environment variables');
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict' });

    this.config = configRestSchema.getProperties();
    this.logger.info('Configuration loaded');
  }

  public get<K extends keyof RestSchema>(key: K): RestSchema[K] {
    return this.config[key];
  }
}
