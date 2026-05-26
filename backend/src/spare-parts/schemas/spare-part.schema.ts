import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SparePartStatus } from '../calculate-status';

export type SparePartDocument = HydratedDocument<SparePart>;

@Schema({ timestamps: true })
export class SparePart {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  brand!: string;

  @Prop({ required: true, trim: true })
  category!: string;

  @Prop({ required: true, trim: true })
  reference!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, min: 0 })
  stock!: number;

  @Prop({
    required: true,
    enum: ['disponible', 'bajo_stock', 'agotado'],
  })
  status!: SparePartStatus;
}

export const SparePartSchema = SchemaFactory.createForClass(SparePart);
