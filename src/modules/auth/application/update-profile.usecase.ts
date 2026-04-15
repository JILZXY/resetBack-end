import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { UpdateProfileDto } from '../infrastructure/dtos/update-profile.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, dto: UpdateProfileDto) {
    if (!dto.name) {
      return this.userRepository.findById(userId);
    }

    try {
      const updatedUser = await this.userRepository.update(userId, { name: dto.name });
      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        sponsorCode: updatedUser.sponsorCode,
      };
    } catch (error) {
      throw new HttpException('Error updating profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
