import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class GetProfileUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    let sponsor: any = null;
    if (user.role === 'ADICTO') {
      const sponsorship = await this.prisma.sponsorship.findFirst({
        where: {
          addict_id: userId,
          status: 'ACTIVE',
        },
        include: {
          sponsor: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar_url: true,
            },
          },
        },
      });

      if (sponsorship?.sponsor) {
        sponsor = {
          id: sponsorship.sponsor.id,
          name: sponsorship.sponsor.name,
          email: sponsorship.sponsor.email,
          avatarUrl: sponsorship.sponsor.avatar_url,
        };
      }
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      sponsorCode: user.sponsorCode,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      addiction: user.addictions?.[0] ?? null,
      sponsor,
    };
  }
}
