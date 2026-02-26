import { Module } from '@nestjs/common';
import { SponsorshipController } from './sponsorship.controller';
import { AssignSponsorUseCase } from './application/assign-sponsor.usecase';
import { TerminateSponsorshipUseCase } from './application/terminate-sponsorship.usecase';
import { GraduateSponsorUseCase } from './application/graduate-sponsor.usecase';
import { SponsorshipRepository } from './infrastructure/repositories/sponsorship.repository';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from 'src/shared/database/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SponsorshipController],
  providers: [
    SponsorshipRepository,
    AssignSponsorUseCase,
    TerminateSponsorshipUseCase,
    GraduateSponsorUseCase,
  ],
  exports: [SponsorshipRepository]
})
export class SponsorshipModule {}
