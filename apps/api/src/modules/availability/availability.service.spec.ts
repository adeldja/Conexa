import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityService } from './availability.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

describe('AvailabilityService', () => {
  let service: AvailabilityService;

  const mockPrismaService = {
    slot: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AvailabilityService>(AvailabilityService);
    
    // Réinitialiser tous les mocks après chaque test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a slot with proper date conversion', async () => {
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

      mockPrismaService.slot.create.mockResolvedValue(expectedSlot);

      // Act
      const result = await service.create(createSlotDto);

      // Assert
      expect(result).toEqual(expectedSlot);
      expect(mockPrismaService.slot.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          providerId: createSlotDto.providerId,
          isAvailable: createSlotDto.isAvailable
        }),
      });
      
      // Vérifier que les dates sont bien converties en objets Date
      const createCall = mockPrismaService.slot.create.mock.calls[0][0];
      expect(createCall.data.startTime).toBeInstanceOf(Date);
      expect(createCall.data.endTime).toBeInstanceOf(Date);
    });
    
    it('should handle isAvailable being undefined', async () => {
      // Arrange
      const createSlotDto: CreateSlotDto = {
        providerId: 'provider-id',
        startTime: '2025-07-01T09:00:00.000Z',
        endTime: '2025-07-01T10:00:00.000Z',
        // isAvailable non spécifié
      };

      const expectedSlot = {
        id: 'slot-id',
        providerId: 'provider-id',
        startTime: new Date('2025-07-01T09:00:00.000Z'),
        endTime: new Date('2025-07-01T10:00:00.000Z'),
        isAvailable: true, // Valeur par défaut
        createdAt: new Date(),
      };

      mockPrismaService.slot.create.mockResolvedValue(expectedSlot);

      // Act
      const result = await service.create(createSlotDto);

      // Assert
      expect(result).toEqual(expectedSlot);
      
      // Vérifier que isAvailable est défini à true par défaut
      const createCall = mockPrismaService.slot.create.mock.calls[0][0];
      expect(createCall.data.isAvailable).toBe(true);
    });
    
    it('should handle error during slot creation', async () => {
      // Arrange
      const createSlotDto: CreateSlotDto = {
        providerId: 'provider-id',
        startTime: '2025-07-01T09:00:00.000Z',
        endTime: '2025-07-01T10:00:00.000Z',
      };

      const error = new Error('Erreur de création');
      mockPrismaService.slot.create.mockRejectedValue(error);

      // Act & Assert
      await expect(service.create(createSlotDto)).rejects.toThrow(error);
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

      mockPrismaService.slot.findMany.mockResolvedValue(expectedSlots);

      // Act
      const result = await service.findByProvider(providerId);

      // Assert
      expect(result).toEqual(expectedSlots);
      expect(mockPrismaService.slot.findMany).toHaveBeenCalledWith({
        where: { providerId },
        orderBy: { startTime: 'asc' },
      });
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

      mockPrismaService.slot.findUnique.mockResolvedValue(expectedSlot);

      // Act
      const result = await service.findOne(slotId);

      // Assert
      expect(result).toEqual(expectedSlot);
      expect(mockPrismaService.slot.findUnique).toHaveBeenCalledWith({
        where: { id: slotId },
      });
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

      mockPrismaService.slot.update.mockResolvedValue(expectedSlot);

      // Act
      const result = await service.update(slotId, updateSlotDto);

      // Assert
      expect(result).toEqual(expectedSlot);
      expect(mockPrismaService.slot.update).toHaveBeenCalledWith({
        where: { id: slotId },
        data: updateSlotDto,
      });
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

      mockPrismaService.slot.delete.mockResolvedValue(expectedSlot);

      // Act
      const result = await service.remove(slotId);

      // Assert
      expect(result).toEqual(expectedSlot);
      expect(mockPrismaService.slot.delete).toHaveBeenCalledWith({
        where: { id: slotId },
      });
    });
  });
});
