"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactivateAccountUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../infrastructure/repositories/user.repository");
const bcrypt = __importStar(require("bcrypt"));
let ReactivateAccountUseCase = class ReactivateAccountUseCase {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(dto) {
        try {
            const user = await this.userRepo.findByEmailIncludeDeleted(dto.email);
            if (!user || !user.isDeleted) {
                throw new common_1.HttpException({
                    code: 'USER_NOT_FOUND',
                    message: 'Usuario no encontrado o la cuenta ya está activa',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
            if (!isPasswordValid) {
                throw new common_1.HttpException({
                    code: 'INVALID_CREDENTIALS',
                    message: 'Contraseña incorrecta',
                }, common_1.HttpStatus.UNAUTHORIZED);
            }
            await this.userRepo.reactivate(user.id);
            return {
                message: 'Cuenta reactivada correctamente. Ahora puedes iniciar sesión.',
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            console.error('Reactivate account error:', error);
            throw new common_1.HttpException({
                code: 'INTERNAL_ERROR',
                message: 'Error interno al reactivar la cuenta'
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ReactivateAccountUseCase = ReactivateAccountUseCase;
exports.ReactivateAccountUseCase = ReactivateAccountUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], ReactivateAccountUseCase);
//# sourceMappingURL=reactivate-account.usecase.js.map