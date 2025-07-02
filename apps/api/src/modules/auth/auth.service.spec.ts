import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword';

      const user = {
        id: '1',
        email,
        password: hashedPassword,
        fullName: 'Test User',
        role: 'CLIENT',
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      mockBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(result).toEqual({
        id: '1',
        email,
        fullName: 'Test User',
        role: 'CLIENT',
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should return null when user does not exist', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should return null when password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const hashedPassword = 'hashedPassword';

      const user = {
        id: '1',
        email,
        password: hashedPassword,
        fullName: 'Test User',
        role: 'CLIENT',
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      mockBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });
  });

  describe('login', () => {
    it('should return access token and user info', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'CLIENT',
      };

      const mockToken = 'jwt-token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(user);

      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: '1',
          email: 'test@example.com',
          fullName: 'Test User',
          role: 'CLIENT',
        },
      });

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: '1',
        email: 'test@example.com',
        role: 'CLIENT',
      });
    });
  });

  describe('register', () => {
    it('should create user and return login response', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password123',
        fullName: 'New User',
        role: 'CLIENT',
      };

      const createdUser = {
        id: '2',
        email: 'newuser@example.com',
        fullName: 'New User',
        role: 'CLIENT',
      };

      const mockToken = 'jwt-token';

      mockUsersService.create.mockResolvedValue(createdUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.register(registerDto);

      expect(result).toEqual({
        access_token: mockToken,
        user: createdUser,
      });

      expect(mockUsersService.create).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('validateUserById', () => {
    it('should return user without password when user exists', async () => {
      const userId = '1';
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        fullName: 'Test User',
        role: 'CLIENT',
      };

      mockUsersService.findOne.mockResolvedValue(user);

      const result = await service.validateUserById(userId);

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'CLIENT',
      });
      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      const userId = 'nonexistent';

      mockUsersService.findOne.mockResolvedValue(null);

      await expect(service.validateUserById(userId)).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
    });
  });
});
