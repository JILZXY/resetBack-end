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
exports.GetProfileUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../infrastructure/repositories/user.repository");
let GetProfileUseCase = class GetProfileUseCase {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
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
};
exports.GetProfileUseCase = GetProfileUseCase;
exports.GetProfileUseCase = GetProfileUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], GetProfileUseCase);
//# sourceMappingURL=get-profile.usecase.js.map