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
exports.DeleteAccountUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../infrastructure/repositories/user.repository");
const mail_service_1 = require("../../../shared/mail/mail.service");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
let DeleteAccountUseCase = class DeleteAccountUseCase {
    userRepo;
    mailService;
    prisma;
    constructor(userRepo, mailService, prisma) {
        this.userRepo = userRepo;
        this.mailService = mailService;
        this.prisma = prisma;
    }
    async execute(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new common_1.HttpException({
                code: 'USER_NOT_FOUND',
                message: 'Usuario no encontrado',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        await this.prisma.sponsorship.updateMany({
            where: {
                OR: [
                    { sponsor_id: userId },
                    { addict_id: userId }
                ],
                status: { in: ['ACTIVE', 'PENDING'] }
            },
            data: {
                status: 'INACTIVE',
                ended_at: new Date(),
                termination_reason: 'Cuenta del usuario eliminada'
            }
        });
        await this.userRepo.softDelete(userId);
        await this.mailService.sendFarewellEmail(user.email, user.name);
        return {
            message: 'Cuenta eliminada correctamente',
        };
    }
};
exports.DeleteAccountUseCase = DeleteAccountUseCase;
exports.DeleteAccountUseCase = DeleteAccountUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        mail_service_1.MailService,
        prisma_service_1.PrismaService])
], DeleteAccountUseCase);
//# sourceMappingURL=delete-account.usecase.js.map