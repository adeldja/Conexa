import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { PrismaService } from '../../prisma/prisma.service';

// Mock du PrismaService
const mockPrismaService = {
  booking: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  slot: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);

    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking for an available slot', async () => {
      // Arrange
      const createBookingDto = {
        slotId: 'slot1',
        clientId: 'client1',
      };

      const mockSlot = {
        id: 'slot1',
        providerId: 'provider1',
        startTime: new Date(),
        endTime: new Date(),
        isAvailable: true,
        createdAt: new Date(),
      };

      const mockBooking = {
        id: 'booking1',
        slotId: 'slot1',
        clientId: 'client1',
        status: 'PENDING',
        createdAt: new Date(),
      };

      mockPrismaService.slot.findUnique.mockResolvedValue(mockSlot);
      mockPrismaService.booking.create.mockResolvedValue(mockBooking);
      mockPrismaService.slot.update.mockResolvedValue({ ...mockSlot, isAvailable: false });

      // Act
      const result = await service.create(createBookingDto);

      // Assert
      expect(mockPrismaService.slot.findUnique).toHaveBeenCalledWith({
        where: { id: createBookingDto.slotId },
      });
      
      expect(mockPrismaService.booking.create).toHaveBeenCalledWith({
        data: {
          slotId: createBookingDto.slotId,
          clientId: createBookingDto.clientId,
        },
      });
      
      expect(mockPrismaService.slot.update).toHaveBeenCalledWith({
        where: { id: createBookingDto.slotId },
        data: { isAvailable: false },
      });
      
      expect(result).toEqual(mockBooking);
    });

    it('should throw an error if the slot does not exist', async () => {
      // Arrange
      const createBookingDto = {
        slotId: 'nonexistent',
        clientId: 'client1',
      };

      mockPrismaService.slot.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createBookingDto)).rejects.toThrow(
        'Le créneau demandé n\'existe pas',
      );
      
      expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
    });

    it('should throw an error if the slot is not available', async () => {
      // Arrange
      const createBookingDto = {
        slotId: 'slot1',
        clientId: 'client1',
      };

      const mockSlot = {
        id: 'slot1',
        providerId: 'provider1',
        startTime: new Date(),
        endTime: new Date(),
        isAvailable: false,
        createdAt: new Date(),
      };

      mockPrismaService.slot.findUnique.mockResolvedValue(mockSlot);

      // Act & Assert
      await expect(service.create(createBookingDto)).rejects.toThrow(
        'Ce créneau n\'est plus disponible',
      );
      
      expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
    });
  });

  describe('findByClient', () => {
    it('should return all bookings for a client', async () => {
      // Arrange
      const clientId = 'client1';
      const mockBookings = [
        {
          id: 'booking1',
          slotId: 'slot1',
          clientId,
          status: 'PENDING',
          createdAt: new Date(),
          slot: {
            id: 'slot1',
            startTime: new Date(),
            endTime: new Date(),
            provider: {
              id: 'provider1',
              email: 'provider@example.com',
              fullName: 'Provider Name',
            },
          },
        },
      ];

      mockPrismaService.booking.findMany.mockResolvedValue(mockBookings);

      // Act
      const result = await service.findByClient(clientId);

      // Assert
      expect(mockPrismaService.booking.findMany).toHaveBeenCalledWith({
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
      
      expect(result).toEqual(mockBookings);
    });
  });

  describe('cancel', () => {
    it('should cancel a booking and make the slot available again', async () => {
      // Arrange
      const bookingId = 'booking1';
      const mockBooking = {
        id: bookingId,
        slotId: 'slot1',
        clientId: 'client1',
        status: 'PENDING',
        createdAt: new Date(),
        slot: {
          id: 'slot1',
          providerId: 'provider1',
          startTime: new Date(),
          endTime: new Date(),
          isAvailable: false,
        },
      };

      const updatedBooking = {
        ...mockBooking,
        status: 'CANCELLED',
      };

      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.booking.update.mockResolvedValue(updatedBooking);
      mockPrismaService.slot.update.mockResolvedValue({
        ...mockBooking.slot,
        isAvailable: true,
      });

      // Act
      const result = await service.cancel(bookingId);

      // Assert
      expect(mockPrismaService.booking.findUnique).toHaveBeenCalledWith({
        where: { id: bookingId },
        include: { slot: true },
      });
      
      expect(mockPrismaService.booking.update).toHaveBeenCalledWith({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
      });
      
      expect(mockPrismaService.slot.update).toHaveBeenCalledWith({
        where: { id: mockBooking.slotId },
        data: { isAvailable: true },
      });
      
      expect(result).toEqual(updatedBooking);
    });

    it('should throw an error if the booking does not exist', async () => {
      // Arrange
      const bookingId = 'nonexistent';
      mockPrismaService.booking.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.cancel(bookingId)).rejects.toThrow(
        'Réservation non trouvée',
      );
      
      expect(mockPrismaService.booking.update).not.toHaveBeenCalled();
      expect(mockPrismaService.slot.update).not.toHaveBeenCalled();
    });
  });
});
