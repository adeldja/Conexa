import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

type UserResponse = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const { email, password, ...userData } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        ...userData,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        timezone: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findAll(): Promise<UserResponse[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        timezone: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string): Promise<
    UserResponse & {
      slots: Array<{
        id: string;
        startTime: Date;
        endTime: Date;
        isAvailable: boolean;
      }>;
      bookings: Array<{
        id: string;
        status: string;
        createdAt: Date;
        slot: {
          id: string;
          startTime: Date;
          endTime: Date;
          provider: {
            id: string;
            fullName: string | null;
            email: string;
          };
        };
      }>;
    }
  > {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        timezone: true,
        createdAt: true,
        slots: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            isAvailable: true,
          },
        },
        bookings: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            slot: {
              select: {
                id: true,
                startTime: true,
                endTime: true,
                provider: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        timezone: true,
        createdAt: true,
      },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Utilisateur supprimé avec succès' };
  }
}
