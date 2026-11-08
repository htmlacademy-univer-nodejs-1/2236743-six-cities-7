import { modelOptions, prop } from '@typegoose/typegoose';
import { Location } from '../../types/index.js';

@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
export class LocationEntity implements Location {
  @prop({ required: true })
  public latitude!: number;

  @prop({ required: true })
  public longitude!: number;
}
