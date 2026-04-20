import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor(private config: ConfigService) {
    const pool = new Pool({
      connectionString: this.config.get<string>('database.url'),
    });

    const adapter = new PrismaPg(pool);

    this.prisma = new PrismaClient({
      adapter,
      log:
        this.config.get<string>('app.nodeEnv') === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }

  async onModuleInit() {
    await this.prisma.$connect();
    console.log('Database connected');
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
    console.log('Database disconnected');
  }

  get $transaction() {
    return this.prisma.$transaction.bind(this.prisma);
  }

  get $queryRaw() {
    return this.prisma.$queryRaw.bind(this.prisma);
  }

  get $queryRawUnsafe() {
    return this.prisma.$queryRawUnsafe.bind(this.prisma);
  }

  get user() {
    return this.prisma.user;
  }

  get dailyLog() {
    return this.prisma.dailyLog;
  }

  get streak() {
    return this.prisma.streak;
  }

  get userAddiction() {
    return this.prisma.userAddiction;
  }

  get supportContact() {
    return this.prisma.supportContact;
  }

  get emergencyAlert() {
    return this.prisma.emergencyAlert;
  }

  get cravingLevel() {
    return this.prisma.cravingLevel;
  }

  get emotionalState() {
    return this.prisma.emotionalState;
  }

  get sponsorship() {
    return this.prisma.sponsorship;
  }

  get streakEvent() {
    return this.prisma.streakEvent;
  }

  get logAbsence() {
    return this.prisma.logAbsence;
  }

  get passwordResetToken() {
    return this.prisma.passwordResetToken;
  }

  get trustedDevice() {
    return this.prisma.trustedDevice;
  }

  get verificationToken() {
    return this.prisma.verificationToken;
  }
}
