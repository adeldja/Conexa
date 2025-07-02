import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access token and user on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'CLIENT',
      };

      const expectedResult = {
        access_token: 'jwt-token',
        user: user,
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const req = { user };
      const result = await controller.login(loginDto, req);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });
  });

  describe('register', () => {
    it('should create user and return access token on successful registration', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password123',
        fullName: 'New User',
        role: 'CLIENT',
      };

      const expectedResult = {
        access_token: 'jwt-token',
        user: {
          id: '2',
          email: 'newuser@example.com',
          fullName: 'New User',
          role: 'CLIENT',
        },
      };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should handle registration errors', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        fullName: 'Existing User',
        role: 'CLIENT',
      };

      mockAuthService.register.mockRejectedValue(
        new Error('Email already exists')
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        'Email already exists'
      );
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'CLIENT',
      };

      const req = { user };
      const result = controller.getProfile(req);

      expect(result).toEqual(user);
    });
  });
});
