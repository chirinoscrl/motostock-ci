import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSparePartDto } from './dto/create-spare-part.dto';
import { calculateStatus } from './calculate-status';
import { SparePart, SparePartDocument } from './schemas/spare-part.schema';

@Injectable()
export class SparePartsService {
  constructor(
    @InjectModel(SparePart.name)
    private readonly sparePartModel: Model<SparePartDocument>,
  ) {}

  async create(dto: CreateSparePartDto): Promise<SparePartDocument> {
    return this.sparePartModel.create({
      ...dto,
      status: calculateStatus(dto.stock),
    });
  }

  async findAll(): Promise<SparePartDocument[]> {
    return this.sparePartModel.find().sort({ createdAt: -1 }).exec();
  }
}
