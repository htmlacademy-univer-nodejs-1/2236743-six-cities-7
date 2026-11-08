import { setTimeout } from 'node:timers/promises';
import { inject, injectable } from 'inversify';
import Mongoose from 'mongoose';
import { DatabaseClient } from './database-client.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../logger/index.js';

const RETRY_COUNT = 5;
const RETRY_TIMEOUT = 1000;
const SERVER_SELECTION_TIMEOUT = 3000;

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose | null = null;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {}

  public async connect(uri: string): Promise<void> {
    if (this.mongoose) {
      throw new Error('MongoDB client already connected');
    }

    this.logger.info('Trying to connect to MongoDB...');

    for (let attempt = 1; attempt <= RETRY_COUNT; attempt++) {
      try {
        this.mongoose = await Mongoose.connect(uri, { serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT });
        this.logger.info('Database connection established');
        return;
      } catch (error) {
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`, error as Error);
        await setTimeout(RETRY_TIMEOUT);
      }
    }

    throw new Error(`Unable to establish database connection after ${RETRY_COUNT} attempts`);
  }

  public async disconnect(): Promise<void> {
    if (!this.mongoose) {
      return;
    }

    await this.mongoose.disconnect();
    this.mongoose = null;
    this.logger.info('Database connection closed');
  }
}
