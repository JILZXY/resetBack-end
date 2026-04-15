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
exports.UpdateProfileUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../infrastructure/repositories/user.repository");
let UpdateProfileUseCase = class UpdateProfileUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId, dto) {
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
        }
        catch (error) {
            throw new common_1.HttpException('Error updating profile', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UpdateProfileUseCase = UpdateProfileUseCase;
exports.UpdateProfileUseCase = UpdateProfileUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UpdateProfileUseCase);
//# sourceMappingURL=update-profile.usecase.js.map