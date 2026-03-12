import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../infrastructure/repositories/user.repository';

@Injectable()
export class GetProfileUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    // Since findById does not yet eagerly load the addictions, we'll need to update it
    // Wait, findById can be updated similar to findByEmail

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      sponsorCode: user.sponsorCode,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      addiction: user.addictions?.[0] ?? null,
    };
  }
}
