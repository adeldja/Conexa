import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

// Mock du BookingService
const mockBookingService = {
  create: jest.fn(),
  findByClient: jest.fn(),
  findBySlot: jest.fn(),
  cancel: jest.fn(),
};

describe('BookingController', () => {
  let controller: BookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: mockBookingService,
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);

    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking', async () => {
      // Arrange
      const createBookingDto = {
        slotId: 'slot1',
        clientId: 'client1',
      };

      const mockBooking = {
        id: 'booking1',
        slotId: 'slot1',
        clientId: 'client1',
        status: 'PENDING',
        createdAt: new Date(),
      };

      mockBookingService.create.mockResolvedValue(mockBooking);

      // Act
      const result = await controller.create(createBookingDto);

      // Assert
      expect(mockBookingService.create).toHaveBeenCalledWith(createBookingDto);
      expect(result).toEqual(mockBooking);
    });
  });

  describe('findByClient', () => {
    it('should return bookings for a client', async () => {
      // Arrange
      const clientId = 'client1';
      const mockBookings = [
        {
          id: 'booking1',
          slotId: 'slot1',
          clientId,
          status: 'PENDING',
          createdAt: new Date(),
        },
      ];

      mockBookingService.findByClient.mockResolvedValue(mockBookings);

      // Act
      const result = await controller.findByClient(clientId);

      // Assert
      expect(mockBookingService.findByClient).toHaveBeenCalledWith(clientId);
      expect(result).toEqual(mockBookings);
    });
  });

  describe('findBySlot', () => {
    it('should return bookings for a slot', async () => {
      // Arrange
      const slotId = 'slot1';
      const mockBookings = [
        {
          id: 'booking1',
          slotId,
          clientId: 'client1',
          status: 'PENDING',
          createdAt: new Date(),
        },
      ];

      mockBookingService.findBySlot.mockResolvedValue(mockBookings);

      // Act
      const result = await controller.findBySlot(slotId);

      // Assert
      expect(mockBookingService.findBySlot).toHaveBeenCalledWith(slotId);
      expect(result).toEqual(mockBookings);
    });
  });

  describe('cancel', () => {
    it('should cancel a booking', async () => {
      // Arrange
      const bookingId = 'booking1';
      const mockBooking = {
        id: bookingId,
        slotId: 'slot1',
        clientId: 'client1',
        status: 'CANCELLED',
        createdAt: new Date(),
      };

      mockBookingService.cancel.mockResolvedValue(mockBooking);

      // Act
      const result = await controller.cancel(bookingId);

      // Assert
      expect(mockBookingService.cancel).toHaveBeenCalledWith(bookingId);
      expect(result).toEqual(mockBooking);
    });
  });
});
