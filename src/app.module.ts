import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './shared/database/prisma/prisma.module';
import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { mongoConfig } from './config/mongo.config';
import { brevoConfig } from './config/brevo.config';
import { AuthModule } from './modules/auth/auth.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { StreakModule } from './modules/streak/streak.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { ForumModule } from './modules/forum/forum.module';
import { SponsorshipModule } from './modules/sponsorship/sponsorship.module';
import { AdminModule } from './modules/admin/admin.module';
import { MailModule } from './shared/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.ENV_FILE ||
        (process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development'),
      ignoreEnvFile: !!process.env.IGNORE_ENV_FILE || false,
      load: [appConfig, databaseConfig, jwtConfig, mongoConfig, brevoConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.url'),
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    MailModule,
    ScheduleModule.forRoot(),
    AuthModule,
    TrackingModule,
    StreakModule,
    EmergencyModule,
    ForumModule,
    SponsorshipModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
