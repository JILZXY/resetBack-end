import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UserEntity } from '../../domain/user.entity';
const { nanoid } = require('nanoid');

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, is_deleted: false },
      include: { addictions: true },
    });
    if (!user) return null;
    return this.toEntity(user);
  }

  async findByEmailIncludeDeleted(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: { addictions: true },
    });
    if (!user) return null;
    return this.toEntity(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, is_deleted: false },
      include: { addictions: true },
    });
    if (!user) return null;
    return this.toEntity(user);
  }

  async findBySponsorCode(code: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { sponsor_code: code, is_deleted: false },
    });
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
    const sponsorCode =
      role === 'PADRINO' ? nanoid(8).toUpperCase() : undefined;

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
      },
    });

    // Si es ADICTO, inicializar su primer Streak
    if (role === 'ADICTO' && user.addictions?.[0]) {
      await this.prisma.streak.create({
        data: {
          user_id: user.id,
          user_addiction_id: user.addictions[0].id,
          started_at: new Date(),
          day_counter: 0,
          status: 'active',
        },
      });
    }

    // Actualizar avatar_url dinámico basado en el ID generado
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        avatar_url: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.id}`,
      },
      include: {
        addictions: true,
      },
    });

    return this.toEntity(updatedUser);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    });
  }

  async reactivate(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        is_deleted: false,
        deleted_at: null,
        is_verified: true, // Asumimos que ya estaba verificado si lo borró
      },
    });
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
    entity.isVerified = raw.is_verified;
    entity.twoFactorEnabled = raw.two_factor_enabled;
    entity.createdAt = raw.created_at;
    entity.updatedAt = raw.updated_at;
    entity.isDeleted = raw.is_deleted;
    entity.addictions = raw.addictions ?? [];
    return entity;
  }
}
