import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

describe('AvailabilityController', () => {
  let controller: AvailabilityController;

  const mockAvailabilityService = {
    create: jest.fn(),
    findByProvider: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailabilityController],
      providers: [
        {
          provide: AvailabilityService,
          useValue: mockAvailabilityService,
        },
      ],
    }).compile();

    controller = module.get<AvailabilityController>(AvailabilityController);
    
    // Réinitialiser tous les mocks après chaque test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a slot', async () => {
      // Arrange
      const createSlotDto: CreateSlotDto = {
        providerId: 'provider-id',
        startTime: '2025-07-01T09:00:00.000Z',
        endTime: '2025-07-01T10:00:00.000Z',
        isAvailable: true
      };

      const expectedSlot = {
        id: 'slot-id',
        providerId: 'provider-id',
        startTime: new Date('2025-07-01T09:00:00.000Z'),
        endTime: new Date('2025-07-01T10:00:00.000Z'),
        isAvailable: true,
        createdAt: new Date(),
      };

      mockAvailabilityService.create.mockResolvedValue(expectedSlot);

      // Act
      const result = await controller.create(createSlotDto);

      // Assert
      expect(result).toEqual(expectedSlot);
      expect(mockAvailabilityService.create).toHaveBeenCalledWith(createSlotDto);
    });
  });

  describe('findByProvider', () => {
    it('should find slots by provider ID', async () => {
      // Arrange
      const providerId = 'provider-id';
      const expectedSlots = [
        {
          id: 'slot-1',
          providerId,
          startTime: new Date('2025-07-01T09:00:00.000Z'),
          endTime: new Date('2025-07-01T10:00:00.000Z'),
          isAvailable: true,
          createdAt: new Date(),
        },
      ];

      mockAvailabilityService.findByProvider.mockResolvedValue(expectedSlots);

      // Act
      const result = await controller.findByProvider(providerId);

      // Assert
      expect(result).toEqual(expectedSlots);
      expect(mockAvailabilityService.findByProvider).toHaveBeenCalledWith(providerId);
    });
  });

  describe('findOne', () => {
    it('should find a slot by ID', async () => {
      // Arrange
      const slotId = 'slot-id';
      const expectedSlot = {
        id: slotId,
        providerId: 'provider-id',
        startTime: new Date('2025-07-01T09:00:00.000Z'),
        endTime: new Date('2025-07-01T10:00:00.000Z'),
        isAvailable: true,
        createdAt: new Date(),
      };

      mockAvailabilityService.findOne.mockResolvedValue(expectedSlot);

      // Act
      const result = await controller.findOne(slotId);

      // Assert
      expect(result).toEqual(expectedSlot);
      expect(mockAvailabilityService.findOne).toHaveBeenCalledWith(slotId);
    });
  });

  describe('update', () => {
    it('should update a slot', async () => {
      // Arrange
      const slotId = 'slot-id';
      const updateSlotDto: UpdateSlotDto = {
        isAvailable: false,
      };

      const expectedSlot = {
        id: slotId,
        providerId: 'provider-id',
        startTime: new Date('2025-07-01T09:00:00.000Z'),
        endTime: new Date('2025-07-01T10:00:00.000Z'),
        isAvailable: false,
        createdAt: new Date(),
      };

      mockAvailabilityService.update.mockResolvedValue(expectedSlot);

      // Act
      const result = await controller.update(slotId, updateSlotDto);

      // Assert
      expect(result).toEqual(expectedSlot);
      expect(mockAvailabilityService.update).toHaveBeenCalledWith(slotId, updateSlotDto);
    });
  });

  describe('remove', () => {
    it('should delete a slot', async () => {
      // Arrange
      const slotId = 'slot-id';
      const expectedSlot = {
        id: slotId,
        providerId: 'provider-id',
        startTime: new Date('2025-07-01T09:00:00.000Z'),
        endTime: new Date('2025-07-01T10:00:00.000Z'),
        isAvailable: true,
        createdAt: new Date(),
      };

      mockAvailabilityService.remove.mockResolvedValue(expectedSlot);

      // Act
      const result = await controller.remove(slotId);

      // Assert
      expect(result).toEqual(expectedSlot);
      expect(mockAvailabilityService.remove).toHaveBeenCalledWith(slotId);
    });
  });
});
