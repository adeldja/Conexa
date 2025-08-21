import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(clientId: string, createReviewDto: CreateReviewDto) {
    const { providerId, bookingId, ...reviewData } = createReviewDto;

    // Vérifier que le prestataire existe
    const provider = await this.prisma.user.findUnique({
      where: { id: providerId },
      include: { providerProfile: true },
    });

    if (!provider || !provider.providerProfile) {
      throw new NotFoundException('Prestataire non trouvé');
    }

    // Un client ne peut pas donner un avis sur lui-même
    if (clientId === providerId) {
      throw new BadRequestException('Vous ne pouvez pas donner un avis sur vous-même');
    }

    // Si un booking est spécifié, vérifier qu'il appartient au client et au prestataire
    if (bookingId) {
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          slot: true,
          review: true,
        },
      });

      if (!booking) {
        throw new NotFoundException('Réservation non trouvée');
      }

      if (booking.clientId !== clientId) {
        throw new ForbiddenException('Cette réservation ne vous appartient pas');
      }

      if (booking.slot.providerId !== providerId) {
        throw new BadRequestException('Cette réservation ne correspond pas au prestataire');
      }

      if (booking.review) {
        throw new ConflictException('Un avis a déjà été donné pour cette réservation');
      }

      // Seules les réservations confirmées peuvent avoir un avis
      if (booking.status !== 'CONFIRMED') {
        throw new BadRequestException('Vous ne pouvez donner un avis que pour une réservation confirmée');
      }
    }

    // Vérifier qu'un avis n'existe pas déjà pour ce client/prestataire/booking
    const existingReview = await this.prisma.review.findUnique({
      where: {
        clientId_providerId_bookingId: {
          clientId,
          providerId,
          bookingId: bookingId || '',
        },
      },
    });

    if (existingReview) {
      throw new ConflictException('Un avis existe déjà pour cette combinaison');
    }

    // Créer l'avis
    const review = await this.prisma.review.create({
      data: {
        clientId,
        providerId,
        bookingId,
        ...reviewData,
      },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
          },
        },
        provider: {
          select: {
            id: true,
            fullName: true,
          },
        },
        booking: true,
      },
    });

    // Mettre à jour les statistiques du prestataire
    await this.updateProviderRating(providerId);

    return review;
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
          },
        },
        provider: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByProvider(providerId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { providerId },
        include: {
          client: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { providerId } }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByClient(clientId: string) {
    return this.prisma.review.findMany({
      where: { clientId },
      include: {
        provider: {
          select: {
            id: true,
            fullName: true,
          },
        },
        booking: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
          },
        },
        provider: {
          select: {
            id: true,
            fullName: true,
          },
        },
        booking: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Avis non trouvé');
    }

    return review;
  }

  async update(id: string, clientId: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Avis non trouvé');
    }

    if (review.clientId !== clientId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres avis');
    }

    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
          },
        },
        provider: {
          select: {
            id: true,
            fullName: true,
          },
        },
        booking: true,
      },
    });

    // Mettre à jour les statistiques du prestataire
    await this.updateProviderRating(review.providerId);

    return updatedReview;
  }

  async remove(id: string, clientId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Avis non trouvé');
    }

    if (review.clientId !== clientId) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres avis');
    }

    const deletedReview = await this.prisma.review.delete({
      where: { id },
    });

    // Mettre à jour les statistiques du prestataire
    await this.updateProviderRating(review.providerId);

    return deletedReview;
  }

  // Méthode privée pour mettre à jour la note moyenne du prestataire
  private async updateProviderRating(providerId: string) {
    const stats = await this.prisma.review.aggregate({
      where: { providerId },
      _avg: { rating: true },
      _count: true,
    });

    await this.prisma.providerProfile.update({
      where: { userId: providerId },
      data: {
        averageRating: stats._avg.rating || null,
      },
    });
  }

  // Statistiques pour un prestataire
  async getProviderReviewStats(providerId: string) {
    const [stats, ratingBreakdown] = await Promise.all([
      this.prisma.review.aggregate({
        where: { providerId },
        _avg: { rating: true },
        _count: true,
      }),
      this.prisma.review.groupBy({
        by: ['rating'],
        where: { providerId },
        _count: true,
        orderBy: { rating: 'desc' },
      }),
    ]);

    return {
      totalReviews: stats._count,
      averageRating: stats._avg.rating || 0,
      ratingBreakdown: ratingBreakdown.map(item => ({
        rating: item.rating,
        count: item._count,
      })),
    };
  }
}
