import { OfferGenerator } from './offer-generator.interface.js';
import { CITY_LOCATIONS, LIST_SEPARATOR, TSV_SEPARATOR } from '../../constants/index.js';
import {
  generateRandomValue,
  getRandomBoolean,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';
import { CityName, Good, MockServerData, OfferType } from '../../types/index.js';

const IMAGES_COUNT = 6;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_BEDROOMS = 1;
const MAX_BEDROOMS = 8;

const MIN_ADULTS = 1;
const MAX_ADULTS = 10;

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const MIN_COMMENTS = 0;
const MAX_COMMENTS = 50;

const MAX_DAYS_AGO = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

const LOCATION_OFFSET = 0.05;
const LOCATION_PRECISION = 6;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(
    private readonly mockData: MockServerData
  ) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const postDate = new Date(Date.now() - generateRandomValue(0, MAX_DAYS_AGO * DAY_MS)).toISOString();
    const city = getRandomItem(Object.values(CityName));
    const previewImage = getRandomItem(this.mockData.previewImages);
    const images = getRandomItems(this.mockData.images, IMAGES_COUNT).join(LIST_SEPARATOR);
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const type = getRandomItem(Object.values(OfferType));
    const bedrooms = generateRandomValue(MIN_BEDROOMS, MAX_BEDROOMS);
    const maxAdults = generateRandomValue(MIN_ADULTS, MAX_ADULTS);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const goods = getRandomItems(Object.values(Good)).join(LIST_SEPARATOR);
    const author = getRandomItem(this.mockData.users);
    const commentsCount = generateRandomValue(MIN_COMMENTS, MAX_COMMENTS);
    const { latitude, longitude } = CITY_LOCATIONS[city];

    return [
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
      author.name,
      author.email,
      author.avatarPath ?? '',
      author.type,
      commentsCount,
      generateRandomValue(latitude - LOCATION_OFFSET, latitude + LOCATION_OFFSET, LOCATION_PRECISION),
      generateRandomValue(longitude - LOCATION_OFFSET, longitude + LOCATION_OFFSET, LOCATION_PRECISION),
    ].join(TSV_SEPARATOR);
  }
}
