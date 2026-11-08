import 'reflect-metadata';
import { createRestApplicationContainer, RestApplication } from './rest/index.js';
import { getErrorMessage } from './shared/helpers/index.js';
import { Logger } from './shared/libs/logger/index.js';
import { Component } from './shared/types/index.js';

async function bootstrap() {
  const container = createRestApplicationContainer();
  const logger = container.get<Logger>(Component.Logger);

  try {
    const application = container.get<RestApplication>(Component.RestApplication);
    await application.init();
  } catch (error: unknown) {
    logger.error(`Application failed to start: ${getErrorMessage(error)}`);
    process.exitCode = 1;
  }
}

bootstrap();
