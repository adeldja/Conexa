import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  constructor(private prisma: PrismaService) {}

  async seedSpecialties() {
    const specialties = [
      {
        name: 'Coaching sportif',
        description: 'Entraînement personnalisé et suivi sportif',
        icon: '💪',
      },
      {
        name: 'Consultation juridique',
        description: 'Conseils et accompagnement juridique',
        icon: '⚖️',
      },
      {
        name: 'Développement web',
        description: 'Création de sites web et applications',
        icon: '💻',
      },
      {
        name: 'Formation cuisine',
        description: 'Cours de cuisine et techniques culinaires',
        icon: '👨‍🍳',
      },
      {
        name: 'Massage thérapeutique',
        description: 'Soins et relaxation par le massage',
        icon: '💆',
      },
      {
        name: 'Cours de musique',
        description: 'Apprentissage d\'instruments et théorie musicale',
        icon: '🎵',
      },
    ];

    const created = [];
    for (const specialty of specialties) {
      const existing = await this.prisma.specialty.findUnique({
        where: { name: specialty.name },
      });

      if (!existing) {
        const newSpecialty = await this.prisma.specialty.create({
          data: specialty,
        });
        created.push(newSpecialty.name);
      }
    }

    return {
      message: created.length > 0 
        ? `${created.length} spécialités créées: ${created.join(', ')}`
        : 'Toutes les spécialités existent déjà',
      count: created.length,
    };
  }

  async seedUsers() {
    const users = [
      {
        email: 'admin@conexa.com',
        password: 'admin123',
        fullName: 'Admin Conexa',
        role: Role.ADMIN,
      },
      {
        email: 'provider1@conexa.com',
        password: 'provider123',
        fullName: 'Jean Dupont',
        role: Role.PROVIDER,
      },
      {
        email: 'provider2@conexa.com',
        password: 'provider123',
        fullName: 'Marie Martin',
        role: Role.PROVIDER,
      },
      {
        email: 'client1@conexa.com',
        password: 'client123',
        fullName: 'Pierre Client',
        role: Role.CLIENT,
      },
      {
        email: 'client2@conexa.com',
        password: 'client123',
        fullName: 'Sophie Client',
        role: Role.CLIENT,
      },
    ];

    const created = [];
    for (const userData of users) {
      const existing = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!existing) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await this.prisma.user.create({
          data: {
            ...userData,
            password: hashedPassword,
          },
        });
        created.push(newUser.email);
      }
    }

    return {
      message: created.length > 0 
        ? `${created.length} utilisateurs créés: ${created.join(', ')}`
        : 'Tous les utilisateurs existent déjà',
      count: created.length,
    };
  }

  async seedProfiles() {
    const providers = await this.prisma.user.findMany({
      where: { role: 'PROVIDER' },
      include: { providerProfile: true },
    });

    const clients = await this.prisma.user.findMany({
      where: { role: 'CLIENT' },
      include: { clientProfile: true },
    });

    const providerProfilesData = [
      {
        businessName: 'Coaching Excellence',
        description: 'Coach sportif professionnel avec 10 ans d\'expérience',
        phone: '+33123456789',
        defaultPrice: 50.00,
      },
      {
        businessName: 'Cabinet Juridique Martin',
        description: 'Avocate spécialisée en droit des affaires',
        phone: '+33123456790',
        defaultPrice: 120.00,
      },
    ];

    const created = [];
    
    // Créer les profils prestataires
    for (let i = 0; i < providers.length && i < providerProfilesData.length; i++) {
      const provider = providers[i];
      if (!provider.providerProfile) {
        await this.prisma.providerProfile.create({
          data: {
            userId: provider.id,
            ...providerProfilesData[i],
          },
        });
        created.push(`Profil prestataire pour ${provider.fullName}`);
      }
    }

    // Créer les profils clients
    for (const client of clients) {
      if (!client.clientProfile) {
        await this.prisma.clientProfile.create({
          data: {
            userId: client.id,
            phone: '+33123456700',
          },
        });
        created.push(`Profil client pour ${client.fullName}`);
      }
    }

    return {
      message: created.length > 0 
        ? `${created.length} profils créés: ${created.join(', ')}`
        : 'Tous les profils existent déjà',
      count: created.length,
    };
  }

  async seedSlots() {
    const providers = await this.prisma.user.findMany({
      where: { role: 'PROVIDER' },
    });

    if (providers.length === 0) {
      return { message: 'Aucun prestataire trouvé. Créez d\'abord des utilisateurs prestataires.' };
    }

    const created = [];
    const now = new Date();
    
    for (const provider of providers) {
      // Créer des créneaux pour les 7 prochains jours
      for (let day = 1; day <= 7; day++) {
        const date = new Date(now);
        date.setDate(date.getDate() + day);
        
        // Créer 3 créneaux par jour (9h, 14h, 16h)
        const times = [
          { hour: 9, minute: 0 },
          { hour: 14, minute: 0 },
          { hour: 16, minute: 0 },
        ];

        for (const time of times) {
          const startTime = new Date(date);
          startTime.setHours(time.hour, time.minute, 0, 0);
          
          const endTime = new Date(startTime);
          endTime.setHours(startTime.getHours() + 1); // 1h de durée

          const existingSlot = await this.prisma.slot.findFirst({
            where: {
              providerId: provider.id,
              startTime: startTime,
            },
          });

          if (!existingSlot) {
            await this.prisma.slot.create({
              data: {
                providerId: provider.id,
                startTime,
                endTime,
                isAvailable: true,
                price: 50.00,
                description: 'Consultation standard',
              },
            });
            created.push(`Créneau ${startTime.toLocaleString()} pour ${provider.fullName}`);
          }
        }
      }
    }

    return {
      message: created.length > 0 
        ? `${created.length} créneaux créés`
        : 'Tous les créneaux existent déjà',
      count: created.length,
    };
  }

  async seedBookings() {
    return { message: 'Seeder des réservations pas encore implémenté' };
  }

  async seedReviews() {
    return { message: 'Seeder des avis pas encore implémenté' };
  }

  async seedAll() {
    const results = [];
    
    try {
      const specialtiesResult = await this.seedSpecialties();
      results.push(`Spécialités: ${specialtiesResult.message}`);
      
      const usersResult = await this.seedUsers();
      results.push(`Utilisateurs: ${usersResult.message}`);
      
      const profilesResult = await this.seedProfiles();
      results.push(`Profils: ${profilesResult.message}`);
      
      const slotsResult = await this.seedSlots();
      results.push(`Créneaux: ${slotsResult.message}`);
      
      return {
        message: results,
      };
    } catch (error) {
      return {
        message: [`Erreur lors du seeding: ${error instanceof Error ? error.message : 'Erreur inconnue'}`],
      };
    }
  }

  async resetDatabase() {
    try {
      // Ordre important pour respecter les contraintes de clés étrangères
      await this.prisma.review.deleteMany();
      await this.prisma.booking.deleteMany();
      await this.prisma.slot.deleteMany();
      await this.prisma.providerSpecialty.deleteMany();
      await this.prisma.specialty.deleteMany();
      await this.prisma.providerProfile.deleteMany();
      await this.prisma.clientProfile.deleteMany();
      await this.prisma.user.deleteMany();

      return {
        message: 'Base de données réinitialisée avec succès',
      };
    } catch (error) {
      return {
        message: `Erreur lors de la réinitialisation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      };
    }
  }

  async cleanData(entity: string) {
    try {
      switch (entity) {
        case 'users':
          await this.prisma.user.deleteMany({ where: { role: { not: 'ADMIN' } } });
          break;
        case 'slots':
          await this.prisma.slot.deleteMany();
          break;
        case 'bookings':
          await this.prisma.booking.deleteMany();
          break;
        case 'reviews':
          await this.prisma.review.deleteMany();
          break;
        case 'specialties':
          await this.prisma.specialty.deleteMany();
          break;
        default:
          throw new Error(`Entité '${entity}' non reconnue`);
      }

      return {
        message: `Données '${entity}' supprimées avec succès`,
      };
    } catch (error) {
      return {
        message: `Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      };
    }
  }

  async getStats() {
    const stats = {
      users: await this.prisma.user.count(),
      providers: await this.prisma.user.count({ where: { role: Role.PROVIDER } }),
      clients: await this.prisma.user.count({ where: { role: Role.CLIENT } }),
      specialties: await this.prisma.specialty.count(),
      slots: await this.prisma.slot.count(),
      bookings: await this.prisma.booking.count(),
      reviews: await this.prisma.review.count(),
    };

    return { stats };
  }
}
