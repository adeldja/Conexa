import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    try {
      // Vérifier que le créneau existe et est disponible
      const slot = await this.prisma.slot.findUnique({
        where: { id: createBookingDto.slotId },
      });

      if (!slot) {
        throw new Error("Le créneau demandé n'existe pas");
      }

      if (!slot.isAvailable) {
        throw new Error("Ce créneau n'est plus disponible");
      }

      // Créer la réservation
      const booking = await this.prisma.booking.create({
        data: {
          slotId: createBookingDto.slotId,
          clientId: createBookingDto.clientId,
        },
      });

      // Mettre à jour le statut du créneau si nécessaire
      await this.prisma.slot.update({
        where: { id: createBookingDto.slotId },
        data: { isAvailable: false },
      });

      return booking;
    } catch (error) {
      throw error;
    }
  }

  async findByClient(clientId: string) {
    return this.prisma.booking.findMany({
      where: { clientId },
      include: {
        slot: {
          include: {
            provider: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
  }

  async findByProvider(providerId: string) {
    return this.prisma.booking.findMany({
      where: {
        slot: {
          providerId: providerId,
        },
      },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        slot: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            isAvailable: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findBySlot(slotId: string) {
    return this.prisma.booking.findMany({
      where: { slotId },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }

  async cancel(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { slot: true },
    });

    if (!booking) {
      throw new Error('Réservation non trouvée');
    }

    // Mettre à jour le statut de la réservation
    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    // Rendre le créneau à nouveau disponible
    await this.prisma.slot.update({
      where: { id: booking.slotId },
      data: { isAvailable: true },
    });

    return updatedBooking;
  }
}
