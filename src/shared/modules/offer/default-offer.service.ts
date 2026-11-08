import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT, PREMIUM_OFFER_COUNT } from './offer.constant.js';
import { OfferEntity } from './offer.entity.js';
import { OfferService } from './offer-service.interface.js';
import { Logger } from '../../libs/logger/index.js';
import { CityName, Component, SortType } from '../../types/index.js';
import { CommentEntity } from '../comment/comment.entity.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate('authorId')
      .exec();
  }

  public async find(count = DEFAULT_OFFER_COUNT): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .sort({ postDate: SortType.Down })
      .limit(count)
      .exec();
  }

  public async findPremiumByCity(city: CityName): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ postDate: SortType.Down })
      .limit(PREMIUM_OFFER_COUNT)
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate('authorId')
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.findByIdAndDelete(offerId).exec();

    if (result) {
      await this.commentModel.deleteMany({ offerId }).exec();
    }

    return result;
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: offerId })) !== null;
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, { $inc: { commentsCount: 1 } }, { new: true })
      .exec();
  }

  public async updateRating(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const [result] = await this.commentModel
      .aggregate<{ rating: number }>([
        { $match: { offerId: new Types.ObjectId(offerId) } },
        { $group: { _id: null, rating: { $avg: '$rating' } } },
        { $project: { _id: 0, rating: { $round: ['$rating', 1] } } },
      ])
      .exec();

    return this.offerModel
      .findByIdAndUpdate(offerId, { rating: result?.rating ?? 0 }, { new: true })
      .exec();
  }
}
