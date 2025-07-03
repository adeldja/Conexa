import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingModule } from './booking.module';
import { BookingService } from './booking.service';
import { PrismaService } from '../../prisma/prisma.service';

// Mocks pour les guards et services
const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };

const mockBookingService = {
  create: jest.fn(),
  findByClient: jest.fn(),
  findBySlot: jest.fn(),
  cancel: jest.fn(),
};

const mockPrismaService = {
  // Add methods as needed for tests
};

describe('Booking Integration Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BookingModule],
    })
      .overrideProvider(BookingService)
      .useValue(mockBookingService)
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /bookings', () => {
    it('should create a new booking', async () => {
      // Arrange
      const bookingData = {
        slotId: 'slot1',
        clientId: 'client1',
      };

      const mockResponse = {
        id: 'booking1',
        slotId: 'slot1',
        clientId: 'client1',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      mockBookingService.create.mockResolvedValue(mockResponse);

      // Act & Assert
      return request(app.getHttpServer())
        .post('/bookings')
        .send(bookingData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockResponse);
          expect(mockBookingService.create).toHaveBeenCalledWith(bookingData);
        });
    });

    it('should validate booking data', async () => {
      // Test avec des données manquantes
      return request(app.getHttpServer())
        .post('/bookings')
        .send({})
        .expect(400);
    });
  });

  describe('GET /bookings/client/:clientId', () => {
    it('should get bookings for a client', async () => {
      // Arrange
      const clientId = 'client1';
      const mockResponse = [
        {
          id: 'booking1',
          slotId: 'slot1',
          clientId,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        },
      ];

      mockBookingService.findByClient.mockResolvedValue(mockResponse);

      // Act & Assert
      return request(app.getHttpServer())
        .get(`/bookings/client/${clientId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockResponse);
          expect(mockBookingService.findByClient).toHaveBeenCalledWith(clientId);
        });
    });
  });

  describe('PATCH /bookings/:id/cancel', () => {
    it('should cancel a booking', async () => {
      // Arrange
      const bookingId = 'booking1';
      const mockResponse = {
        id: bookingId,
        status: 'CANCELLED',
        slotId: 'slot1',
        clientId: 'client1',
        createdAt: new Date().toISOString(),
      };

      mockBookingService.cancel.mockResolvedValue(mockResponse);

      // Act & Assert
      return request(app.getHttpServer())
        .patch(`/bookings/${bookingId}/cancel`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockResponse);
          expect(mockBookingService.cancel).toHaveBeenCalledWith(bookingId);
        });
    });
  });
});
