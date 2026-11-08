import { Container } from 'inversify';
import { RestApplication } from './rest.application.js';
import { Config, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { offerContainer } from '../shared/modules/offer/index.js';
import { userContainer } from '../shared/modules/user/index.js';
import { Component } from '../shared/types/index.js';

export function createRestApplicationContainer(): Container {
  const container = new Container();

  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  container.load(userContainer, offerContainer);

  return container;
}
