import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SparePartStatus } from '../calculate-status';

export type SparePartDocument = HydratedDocument<SparePart>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = (ret._id as { toString(): string })?.toString();
      delete ret._id;
      return ret;
    },
  },
})
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
