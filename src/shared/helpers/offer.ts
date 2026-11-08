import { LIST_SEPARATOR, TSV_SEPARATOR } from '../constants/index.js';
import { CityName, Good, Offer, OfferType, UserType } from '../types/index.js';

export function createOffer(line: string): Offer {
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
  ] = line.replace('\n', '').split(TSV_SEPARATOR);

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
