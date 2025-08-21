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
        email: 'provider3@conexa.com',
        password: 'provider123',
        fullName: 'Thomas Développeur',
        role: Role.PROVIDER,
      },
      {
        email: 'provider4@conexa.com',
        password: 'provider123',
        fullName: 'Sophie Chef',
        role: Role.PROVIDER,
      },
      {
        email: 'provider5@conexa.com',
        password: 'provider123',
        fullName: 'Lucas Masseur',
        role: Role.PROVIDER,
      },
      {
        email: 'provider6@conexa.com',
        password: 'provider123',
        fullName: 'Emma Musicienne',
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
      {
        email: 'client3@conexa.com',
        password: 'client123',
        fullName: 'Marc Client',
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
    // Récupérer tous les providers avec leurs profils
    const providers = await this.prisma.user.findMany({
      where: { role: Role.PROVIDER },
      include: { providerProfile: true },
    });

    const clients = await this.prisma.user.findMany({
      where: { role: Role.CLIENT },
      include: { clientProfile: true },
    });

    const providerProfilesData = [
      {
        businessName: 'Coaching Excellence',
        description: 'Coach sportif professionnel avec 10 ans d\'expérience. Spécialisé en musculation, cardio et préparation physique.',
        phone: '+33123456789',
        defaultPrice: 60.00,
        experience: '10 ans d\'expérience en coaching sportif',
        certifications: 'Diplôme d\'État BPJEPS, Certification CrossFit Level 1',
      },
      {
        businessName: 'Cabinet Juridique Martin',
        description: 'Avocate spécialisée en droit des affaires, droit du travail et contentieux commercial.',
        phone: '+33123456790',
        defaultPrice: 150.00,
        experience: '15 ans d\'expérience en droit des affaires',
        certifications: 'Master 2 Droit des Affaires, Barreau de Paris',
      },
      {
        businessName: 'DevWeb Solutions',
        description: 'Développeur full-stack spécialisé en React, Node.js et applications web modernes.',
        phone: '+33123456791',
        defaultPrice: 80.00,
        experience: '8 ans de développement web',
        certifications: 'Certification AWS, Google Cloud Platform',
      },
      {
        businessName: 'Atelier Culinaire',
        description: 'Chef cuisinier proposant des cours de cuisine française et internationale.',
        phone: '+33123456792',
        defaultPrice: 75.00,
        experience: '12 ans en haute gastronomie',
        certifications: 'CAP Cuisine, Formation Institut Paul Bocuse',
      },
      {
        businessName: 'Bien-être & Relaxation',
        description: 'Masseur thérapeutique certifié, spécialisé en massage suédois et deep tissue.',
        phone: '+33123456793',
        defaultPrice: 70.00,
        experience: '6 ans en massothérapie',
        certifications: 'Certification FFMTR, Formation massage thérapeutique',
      },
      {
        businessName: 'École de Musique Harmony',
        description: 'Professeur de piano et guitare, tous niveaux. Méthode pédagogique adaptée.',
        phone: '+33123456794',
        defaultPrice: 45.00,
        experience: '20 ans d\'enseignement musical',
        certifications: 'Diplôme du Conservatoire, Formation pédagogie musicale',
      },
    ];

    const created = [];
    
    // S'assurer que TOUS les providers ont un profil
    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i];
      if (!provider.providerProfile) {
        const profileData = providerProfilesData[i % providerProfilesData.length];
        
        // Personnaliser selon le prestataire
        const customizedProfile = {
          ...profileData,
          businessName: i < providerProfilesData.length 
            ? profileData.businessName 
            : `${provider.fullName} Services`,
          description: i < providerProfilesData.length 
            ? profileData.description 
            : `Services professionnels proposés par ${provider.fullName}`,
          phone: `+3312345${(6795 + i).toString()}`, // Numéros uniques
        };

        await this.prisma.providerProfile.create({
          data: {
            userId: provider.id,
            ...customizedProfile,
          },
        });
        created.push(`Profil prestataire pour ${provider.fullName}`);
      }
    }

    // Créer les profils clients avec des données plus variées
    const clientPhones = [
      '+33123456700', '+33123456701', '+33123456702', 
      '+33123456703', '+33123456704', '+33123456705'
    ];
    
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      if (!client.clientProfile) {
        await this.prisma.clientProfile.create({
          data: {
            userId: client.id,
            phone: clientPhones[i % clientPhones.length],
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
      where: { role: Role.PROVIDER },
      include: { providerProfile: true },
    });

    if (providers.length === 0) {
      return { message: 'Aucun prestataire trouvé. Créez d\'abord des utilisateurs prestataires.' };
    }

    const created = [];
    const now = new Date();
    
    // Templates d'horaires selon le type de service
    const scheduleTemplates = [
      // Template 1: Horaires de bureau (coach sportif, consultation)
      [
        { hour: 8, minute: 0 }, { hour: 9, minute: 0 }, { hour: 10, minute: 0 },
        { hour: 14, minute: 0 }, { hour: 15, minute: 0 }, { hour: 16, minute: 0 }, { hour: 17, minute: 0 }
      ],
      // Template 2: Horaires flexibles (massage, cours de musique)
      [
        { hour: 9, minute: 30 }, { hour: 11, minute: 0 }, 
        { hour: 14, minute: 30 }, { hour: 16, minute: 0 }, { hour: 18, minute: 30 }
      ],
      // Template 3: Horaires étendus (développement web, cours cuisine)
      [
        { hour: 9, minute: 0 }, { hour: 11, minute: 0 }, { hour: 14, minute: 0 }, 
        { hour: 16, minute: 0 }, { hour: 19, minute: 0 }, { hour: 20, minute: 30 }
      ],
    ];

    for (let providerIndex = 0; providerIndex < providers.length; providerIndex++) {
      const provider = providers[providerIndex];
      const defaultPrice = provider.providerProfile?.defaultPrice || 50.00;
      const schedule = scheduleTemplates[providerIndex % scheduleTemplates.length];
      
      // Créer des créneaux pour les 14 prochains jours
      for (let day = 1; day <= 14; day++) {
        const date = new Date(now);
        date.setDate(date.getDate() + day);
        
        // Éviter les dimanches pour certains prestataires
        if (date.getDay() === 0 && providerIndex % 2 === 0) continue;

        for (const time of schedule) {
          const startTime = new Date(date);
          startTime.setHours(time.hour, time.minute, 0, 0);
          
          // Durée variable selon le service (30min à 2h)
          const durations = [30, 60, 90, 120];
          const duration = durations[providerIndex % durations.length];
          
          const endTime = new Date(startTime);
          endTime.setMinutes(startTime.getMinutes() + duration);

          const existingSlot = await this.prisma.slot.findFirst({
            where: {
              providerId: provider.id,
              startTime: startTime,
            },
          });

          if (!existingSlot) {
            // Varier les prix selon l'horaire
            let adjustedPrice = Number(defaultPrice);
            if (time.hour >= 18) adjustedPrice *= 1.2; // Majoration soirée
            if (date.getDay() === 6) adjustedPrice *= 1.1; // Majoration samedi

            await this.prisma.slot.create({
              data: {
                providerId: provider.id,
                startTime,
                endTime,
                isAvailable: Math.random() > 0.1, // 90% de disponibilité
                price: Math.round(adjustedPrice * 100) / 100,
                description: this.getSlotDescription(duration, time.hour),
              },
            });
            created.push(`Créneau ${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString()} pour ${provider.fullName}`);
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

  private getSlotDescription(duration: number, hour: number): string {
    const descriptions: Record<number, string[]> = {
      30: ['Consultation express', 'Session découverte', 'Rendez-vous court'],
      60: ['Consultation standard', 'Session complète', 'Rendez-vous classique'],
      90: ['Session approfondie', 'Consultation détaillée', 'Séance intensive'],
      120: ['Session complète', 'Formation intensive', 'Atelier complet'],
    };

    const timeDescriptions = {
      morning: 'matinée',
      afternoon: 'après-midi',
      evening: 'soirée',
    };

    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    const baseDesc = descriptions[duration]?.[Math.floor(Math.random() * descriptions[duration].length)] || 'Consultation';
    
    return `${baseDesc} - ${timeDescriptions[timeOfDay]}`;
  }

  async seedBookings() {
    const clients = await this.prisma.user.findMany({
      where: { role: Role.CLIENT },
    });

    const availableSlots = await this.prisma.slot.findMany({
      where: { 
        isAvailable: true,
        startTime: { gte: new Date() } // Seulement les créneaux futurs
      },
      include: { provider: true },
      take: 20, // Limiter pour éviter trop de réservations
    });

    if (clients.length === 0 || availableSlots.length === 0) {
      return { 
        message: 'Impossible de créer des réservations : clients ou créneaux manquants',
        count: 0 
      };
    }

    const created = [];
    const statuses = ['PENDING', 'CONFIRMED'];
    
    // Créer quelques réservations de test
    const numberOfBookings = Math.min(10, availableSlots.length);
    
    for (let i = 0; i < numberOfBookings; i++) {
      const client = clients[i % clients.length];
      const slot = availableSlots[i];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      try {
        const booking = await this.prisma.booking.create({
          data: {
            clientId: client.id,
            slotId: slot.id,
            status: status as any,
            notes: `Réservation de test pour ${slot.description}`,
          },
        });

        // Marquer le créneau comme non disponible
        await this.prisma.slot.update({
          where: { id: slot.id },
          data: { isAvailable: false },
        });

        created.push(`Réservation ${booking.id} - ${client.fullName} chez ${slot.provider.fullName}`);
      } catch (error) {
        // Ignorer les erreurs de contraintes (réservation déjà existante)
        continue;
      }
    }

    return {
      message: created.length > 0 
        ? `${created.length} réservations créées`
        : 'Aucune réservation créée',
      count: created.length,
    };
  }

  async seedReviews() {
    const completedBookings = await this.prisma.booking.findMany({
      where: { status: 'CONFIRMED' }, // Utiliser CONFIRMED car COMPLETED n'existe pas
      include: { 
        client: true, 
        slot: { include: { provider: true } },
        review: true 
      },
    });

    if (completedBookings.length === 0) {
      return { 
        message: 'Aucune réservation confirmée trouvée pour créer des avis',
        count: 0 
      };
    }

    const reviewTemplates = [
      {
        rating: 5,
        comments: [
          'Excellent service ! Très professionnel et à l\'écoute.',
          'Je recommande vivement, résultats au-delà de mes attentes.',
          'Prestation de qualité, je reviendrai certainement.',
          'Parfait ! Exactement ce que je recherchais.',
        ]
      },
      {
        rating: 4,
        comments: [
          'Très bon service, quelques petits points à améliorer.',
          'Globalement satisfait, bonne prestation.',
          'Bien dans l\'ensemble, je recommande.',
          'Service de qualité avec un bon rapport qualité/prix.',
        ]
      },
      {
        rating: 3,
        comments: [
          'Service correct, sans plus.',
          'Prestation moyenne, peut mieux faire.',
          'Acceptable mais j\'attendais mieux.',
        ]
      },
    ];

    const created = [];

    for (const booking of completedBookings) {
      if (!booking.review) {
        const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
        const comment = template.comments[Math.floor(Math.random() * template.comments.length)];

        try {
          const review = await this.prisma.review.create({
            data: {
              clientId: booking.clientId,
              providerId: booking.slot.providerId,
              bookingId: booking.id,
              rating: template.rating,
              comment: comment,
            },
          });

          created.push(`Avis ${review.rating}/5 par ${booking.client.fullName} pour ${booking.slot.provider.fullName}`);
        } catch (error) {
          // Ignorer les erreurs de contraintes
          continue;
        }
      }
    }

    return {
      message: created.length > 0 
        ? `${created.length} avis créés`
        : 'Aucun avis créé (tous les bookings ont déjà des avis)',
      count: created.length,
    };
  }

  async seedAll() {
    const results = [];
    
    try {
      // 1. Créer les spécialités
      const specialtiesResult = await this.seedSpecialties();
      results.push(`Spécialités: ${specialtiesResult.message}`);
      
      // 2. Créer les utilisateurs
      const usersResult = await this.seedUsers();
      results.push(`Utilisateurs: ${usersResult.message}`);
      
      // 3. Créer les profils
      const profilesResult = await this.seedProfiles();
      results.push(`Profils: ${profilesResult.message}`);
      
      // 4. Associer des spécialités aux prestataires
      const specialtyAssociationsResult = await this.seedProviderSpecialties();
      results.push(`Associations spécialités: ${specialtyAssociationsResult.message}`);
      
      // 5. Créer les créneaux
      const slotsResult = await this.seedSlots();
      results.push(`Créneaux: ${slotsResult.message}`);
      
      // 6. Créer des réservations
      const bookingsResult = await this.seedBookings();
      results.push(`Réservations: ${bookingsResult.message}`);
      
      // 7. Créer des avis
      const reviewsResult = await this.seedReviews();
      results.push(`Avis: ${reviewsResult.message}`);
      
      return {
        message: results,
      };
    } catch (error) {
      return {
        message: [`Erreur lors du seeding: ${error instanceof Error ? error.message : 'Erreur inconnue'}`],
      };
    }
  }

  async seedProviderSpecialties() {
    const providers = await this.prisma.user.findMany({
      where: { role: Role.PROVIDER },
      include: { 
        providerProfile: { 
          include: { specialties: true } 
        } 
      },
    });

    const specialties = await this.prisma.specialty.findMany();

    if (providers.length === 0 || specialties.length === 0) {
      return { 
        message: 'Aucun prestataire ou spécialité trouvé',
        count: 0 
      };
    }

    const created = [];
    const levels = ['Débutant', 'Intermédiaire', 'Expert'];
    const certifications = [
      'Certification professionnelle',
      'Diplôme d\'État',
      'Formation spécialisée',
      'Certification internationale',
      'Auto-formation + expérience',
    ];

    for (const provider of providers) {
      if (!provider.providerProfile) continue;

      // Assigner 1-3 spécialités par prestataire
      const numberOfSpecialties = Math.floor(Math.random() * 3) + 1;
      const shuffledSpecialties = specialties.sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < numberOfSpecialties && i < shuffledSpecialties.length; i++) {
        const specialty = shuffledSpecialties[i];
        
        // Vérifier si l'association existe déjà
        const existingAssociation = await this.prisma.providerSpecialty.findUnique({
          where: {
            providerId_specialtyId: {
              providerId: provider.providerProfile.id,
              specialtyId: specialty.id,
            },
          },
        });

        if (!existingAssociation) {
          const level = levels[Math.floor(Math.random() * levels.length)];
          const certification = certifications[Math.floor(Math.random() * certifications.length)];

          await this.prisma.providerSpecialty.create({
            data: {
              providerId: provider.providerProfile.id,
              specialtyId: specialty.id,
              level,
              certification,
            },
          });

          created.push(`${provider.fullName} -> ${specialty.name} (${level})`);
        }
      }
    }

    return {
      message: created.length > 0 
        ? `${created.length} associations spécialité-prestataire créées`
        : 'Toutes les associations existent déjà',
      count: created.length,
    };
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
