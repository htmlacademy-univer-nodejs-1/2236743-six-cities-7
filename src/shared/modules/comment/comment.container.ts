import { types } from '@typegoose/typegoose';
import { ContainerModule } from 'inversify';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { CommentService } from './comment-service.interface.js';
import { DefaultCommentService } from './default-comment.service.js';
import { Component } from '../../types/index.js';

export const commentContainer = new ContainerModule((bind) => {
  bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
});
