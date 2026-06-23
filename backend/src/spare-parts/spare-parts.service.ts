import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, isValidObjectId } from 'mongoose';
import { CreateSparePartDto } from './dto/create-spare-part.dto';
import { UpdateSparePartDto } from './dto/update-spare-part.dto';
import { QuerySparePartsDto } from './dto/query-spare-parts.dto';
import { calculateStatus } from './calculate-status';
import { SparePart, SparePartDocument } from './schemas/spare-part.schema';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

  async findAll(query: QuerySparePartsDto = {}): Promise<SparePartDocument[]> {
    const filter: FilterQuery<SparePartDocument> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.search) {
      const regex = new RegExp(escapeRegExp(query.search), 'i');
      filter.$or = [{ name: regex }, { brand: regex }, { category: regex }];
    }

    return this.sparePartModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<SparePartDocument> {
    const part = isValidObjectId(id)
      ? await this.sparePartModel.findById(id).exec()
      : null;
    if (!part) {
      throw new NotFoundException(`Spare part ${id} not found`);
    }
    return part;
  }

  async update(
    id: string,
    dto: UpdateSparePartDto,
  ): Promise<SparePartDocument> {
    const changes: Partial<SparePart> = { ...dto };
    if (dto.stock !== undefined) {
      changes.status = calculateStatus(dto.stock);
    }

    const updated = isValidObjectId(id)
      ? await this.sparePartModel
          .findByIdAndUpdate(id, changes, { new: true, runValidators: true })
          .exec()
      : null;
    if (!updated) {
      throw new NotFoundException(`Spare part ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = isValidObjectId(id)
      ? await this.sparePartModel.findByIdAndDelete(id).exec()
      : null;
    if (!deleted) {
      throw new NotFoundException(`Spare part ${id} not found`);
    }
  }
}
