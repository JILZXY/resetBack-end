import { Module } from '@nestjs/common';
import { SponsorshipController } from './sponsorship.controller';
import { RequestSponsorshipUseCase } from './application/assign-sponsor.usecase';
import { AcceptSponsorshipUseCase } from './application/accept-sponsorship.usecase';
import { RejectSponsorshipUseCase } from './application/reject-sponsorship.usecase';
import { TerminateSponsorshipUseCase } from './application/terminate-sponsorship.usecase';
import { GraduateSponsorUseCase } from './application/graduate-sponsor.usecase';
import { GetGodchildProfileUseCase } from './application/get-godchild-profile.usecase';
import { SponsorshipRepository } from './infrastructure/repositories/sponsorship.repository';
import { AuthModule } from '../auth/auth.module';
import { ForumModule } from '../forum/forum.module';
import { EmergencyModule } from '../emergency/emergency.module';
import { PrismaModule } from 'src/shared/database/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ForumModule,
    EmergencyModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SponsorshipController],
  providers: [
    SponsorshipRepository,
    RequestSponsorshipUseCase,
    AcceptSponsorshipUseCase,
    RejectSponsorshipUseCase,
    TerminateSponsorshipUseCase,
    GraduateSponsorUseCase,
    GetGodchildProfileUseCase,
  ],
  exports: [SponsorshipRepository],
})
export class SponsorshipModule {}
