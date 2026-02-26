import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaModule } from './shared/database/prisma/prisma.module';
import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { mongoConfig } from './config/mongo.config';
import { sendgridConfig } from './config/sendgrid.config';
import { AuthModule } from './modules/auth/auth.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { StreakModule } from './modules/streak/streak.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { ForumModule } from './modules/forum/forum.module';
import { SponsorshipModule } from './modules/sponsorship/sponsorship.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
      load: [appConfig, databaseConfig, jwtConfig, mongoConfig, sendgridConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.url'),
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    AuthModule,
    TrackingModule,
    StreakModule,
    EmergencyModule,
    ForumModule,
    SponsorshipModule,
  ],
})
export class AppModule {}