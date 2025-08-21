import { PrismaClient, Role, Status } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 3 spécialités (idempotent)
  const yoga = await prisma.specialty.upsert({
    where: { name: 'Yoga' },
    update: {},
    create: { name: 'Yoga', description: 'Cours de yoga détente', icon: '🧘' },
  });

  const massage = await prisma.specialty.upsert({
    where: { name: 'Massage' },
    update: {},
    create: { name: 'Massage', description: 'Massage relaxant', icon: '💆' },
  });

  const coaching = await prisma.specialty.upsert({
    where: { name: 'Coaching' },
    update: {},
    create: { name: 'Coaching', description: 'Coaching sportif personnalisé', icon: '🏋️' },
  });

  // 3 clients
  const clients = await Promise.all(
    [1, 2, 3].map((i) =>
      prisma.user.upsert({
        where: { email: `client${i}@mail.com` },
        update: {},
        create: {
          email: `client${i}@mail.com`,
          password: 'hashedpassword',
          fullName: `Client ${i}`,
          role: Role.CLIENT,
          clientProfile: {
            create: { phone: `060000000${i}` },
          },
        },
      }),
    ),
  );

  // 3 providers
  const providers = await Promise.all(
    [1, 2, 3].map((i) =>
      prisma.user.upsert({
        where: { email: `provider${i}@mail.com` },
        update: {},
        create: {
          email: `provider${i}@mail.com`,
          password: 'hashedpassword',
          fullName: `Provider ${i}`,
          role: Role.PROVIDER,
          providerProfile: {
            create: {
              businessName: `Biz ${i}`,
              description: 'Services de qualité',
              phone: `070000000${i}`,
              address: `Rue ${i}, Paris`,
              specialties: {
                create: [{ specialtyId: i === 1 ? yoga.id : i === 2 ? massage.id : coaching.id, level: 'Expert' }],
              },
            },
          },
        },
      }),
    ),
  );

  // 1 slot par provider
  const slots = await Promise.all(
    providers.map((p, i) =>
      prisma.slot.upsert({
        where: { id: `slot-${i}` }, // ID fixe pour éviter doublons
        update: {},
        create: {
          id: `slot-${i}`,
          providerId: p.id,
          startTime: new Date(2025, 0, 1 + i, 10, 0),
          endTime: new Date(2025, 0, 1 + i, 11, 0),
          price: 50.0,
          description: `Service ${i + 1} by ${p.fullName}`,
        },
      }),
    ),
  );

  // 1 booking + review par client
  await Promise.all(
    clients.map((c, i) =>
      prisma.booking.upsert({
        where: { id: `booking-${i}` },
        update: {},
        create: {
          id: `booking-${i}`,
          clientId: c.id,
          slotId: slots[i].id,
          status: Status.CONFIRMED,
          notes: 'Hâte du rendez-vous !',
          review: {
            create: {
              rating: 5,
              comment: `Super prestation ${i + 1}`,
              providerId: slots[i].providerId,
              clientId: c.id,
            },
          },
        },
      }),
    ),
  );

  console.log('✅ Seed terminé');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
