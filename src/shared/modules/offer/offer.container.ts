import { types } from '@typegoose/typegoose';
import { ContainerModule } from 'inversify';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/index.js';

export const offerContainer = new ContainerModule((bind) => {
  bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
});
