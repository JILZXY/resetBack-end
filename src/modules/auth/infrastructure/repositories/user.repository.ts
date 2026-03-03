import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UserEntity } from '../../domain/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.toEntity(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.toEntity(user);
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: string;
    addictionName?: string;
    classification?: string;
  }): Promise<UserEntity> {
    const role = data.role ?? 'patient';
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash: data.passwordHash,
        role: role,
        ...(role === 'patient' && data.addictionName
          ? {
              addictions: {
                create: {
                  custom_name: data.addictionName,
                  classification: data.classification ?? '',
                },
              },
            }
          : {}),
      },
      include: {
        addictions: true,
      }
    });
    return this.toEntity(user);
  }

  private toEntity(raw: any): UserEntity {
    const entity = new UserEntity();
    entity.id = raw.id;
    entity.name = raw.name;
    entity.email = raw.email;
    entity.passwordHash = raw.password_hash;
    entity.role = raw.role;
    entity.createdAt = raw.created_at;
    entity.updatedAt = raw.updated_at;
    return entity;
  }
}