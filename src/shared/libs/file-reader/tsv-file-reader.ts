import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { CityName, Good, Offer, OfferType, UserType } from '../../types/index.js';

const LIST_SEPARATOR = ';';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      postDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
      authorName,
      authorEmail,
      authorAvatar,
      authorType,
      commentsCount,
      latitude,
      longitude,
    ] = line.split('\t');

    return {
      title,
      description,
      postDate: new Date(postDate),
      city: city as CityName,
      previewImage,
      images: images.split(LIST_SEPARATOR),
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: Number(rating),
      type: type as OfferType,
      bedrooms: Number(bedrooms),
      maxAdults: Number(maxAdults),
      price: Number(price),
      goods: goods.split(LIST_SEPARATOR) as Good[],
      author: {
        name: authorName,
        email: authorEmail,
        avatarPath: authorAvatar || undefined,
        type: authorType as UserType,
      },
      commentsCount: Number(commentsCount),
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
    };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
