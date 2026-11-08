import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { DEFAULT_COMMENT_COUNT } from './comment.constant.js';
import { CommentEntity } from './comment.entity.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { Component, SortType } from '../../types/index.js';
import { OfferService } from '../offer/offer-service.interface.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);

    await this.offerService.incCommentCount(dto.offerId);
    await this.offerService.updateRating(dto.offerId);

    return comment.populate('authorId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .sort({ createdAt: SortType.Down })
      .limit(DEFAULT_COMMENT_COUNT)
      .populate('authorId')
      .exec();
  }
}
