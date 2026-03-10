import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UserEntity } from '../../domain/user.entity';
const { nanoid } = require('nanoid');

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

  async findBySponsorCode(code: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { sponsor_code: code } });
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
    const role = data.role ?? 'ADICTO';
    const sponsorCode = role === 'PADRINO' ? nanoid(8).toUpperCase() : undefined;

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash: data.passwordHash,
        role: role as any,
        sponsor_code: sponsorCode,
        ...(role === 'ADICTO' && data.addictionName
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

    // Actualizar avatar_url dinámico basado en el ID generado
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.id}`,
      },
      include: {
        addictions: true,
      }
    });

    return this.toEntity(updatedUser);
  }

  private toEntity(raw: any): UserEntity {
    const entity = new UserEntity();
    entity.id = raw.id;
    entity.name = raw.name;
    entity.email = raw.email;
    entity.passwordHash = raw.password_hash;
    entity.role = raw.role;
    entity.sponsorCode = raw.sponsor_code ?? null;
    entity.avatarUrl = raw.avatar_url;
    entity.createdAt = raw.created_at;
    entity.updatedAt = raw.updated_at;
    return entity;
  }
}
