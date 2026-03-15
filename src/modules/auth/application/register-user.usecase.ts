import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { RegisterDto } from '../infrastructure/dtos/register.dto';
import { VerificationTokenRepository } from '../infrastructure/repositories/verification-token.repository';
import { MailService } from 'src/shared/mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenRepo: VerificationTokenRepository,
    private readonly mailService: MailService,
  ) {}

  async execute(dto: RegisterDto) {
    const existing = await this.userRepo.findByEmailIncludeDeleted(dto.email);

    if (existing) {
      if (existing.isDeleted) {
        throw new HttpException(
          {
            code: 'ACCOUNT_DEACTIVATED',
            message: 'Esta cuenta ha sido desactivada. ¿Deseas reactivarla?',
            details: { email: dto.email },
          },
          HttpStatus.FORBIDDEN,
        );
      }
      throw new HttpException(
        {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Ya existe una cuenta con este correo electrónico',
          details: { email: dto.email },
        },
        HttpStatus.CONFLICT,
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
      addictionName: dto.addictionName,
      classification: dto.classification,
    });

    // GENERAR TOKEN DE VERIFICACIÓN
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expira en 24 horas

    await this.tokenRepo.create(user.id, token, expiresAt);
    
    // ENVIAR COREO DE VERIFICACIÓN VIA BREVO
    await this.mailService.sendVerificationEmail(user.email, token);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      sponsorCode: user.sponsorCode,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }
}
