import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async create(createSlotDto: CreateSlotDto) {
    try {
      // Convertir les dates de string à Date object
      const data = {
        ...createSlotDto,
        startTime: new Date(createSlotDto.startTime),
        endTime: new Date(createSlotDto.endTime),
        // Assurer que isAvailable est défini
        isAvailable: createSlotDto.isAvailable !== undefined ? createSlotDto.isAvailable : true
      };

      console.log('Creating slot with data:', data);
      
      return await this.prisma.slot.create({
        data,
      });
    } catch (error) {
      console.error('Error creating slot:', error);
      throw error;
    }
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
