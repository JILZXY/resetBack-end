"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const config_1 = require("@nestjs/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
let PrismaService = class PrismaService {
    config;
    prisma;
    constructor(config) {
        this.config = config;
        const pool = new pg_1.Pool({
            connectionString: this.config.get('database.url'),
        });
        const adapter = new adapter_pg_1.PrismaPg(pool);
        this.prisma = new client_1.PrismaClient({
            adapter,
            log: this.config.get('app.nodeEnv') === 'development'
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
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map