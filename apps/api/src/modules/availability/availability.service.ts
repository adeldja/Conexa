import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async create(createSlotDto: CreateSlotDto) {
    return this.prisma.slot.create({
      data: createSlotDto,
    });
  }

  async findByProvider(providerId: string) {
    return this.prisma.slot.findMany({
      where: { providerId },
      orderBy: { startTime: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.slot.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateSlotDto: UpdateSlotDto) {
    return this.prisma.slot.update({
      where: { id },
      data: updateSlotDto,
    });
  }

  async remove(id: string) {
    return this.prisma.slot.delete({
      where: { id },
    });
  }
}
