import { types } from '@typegoose/typegoose';
import { ContainerModule } from 'inversify';
import { DefaultUserService } from './default-user.service.js';
import { UserEntity, UserModel } from './user.entity.js';
import { UserService } from './user-service.interface.js';
import { Component } from '../../types/index.js';

export const userContainer = new ContainerModule((bind) => {
  bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
});
