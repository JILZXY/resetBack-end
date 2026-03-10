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
exports.CreateEncouragementNoteUseCase = void 0;
const common_1 = require("@nestjs/common");
const encouragement_note_repository_1 = require("../infrastructure/repositories/encouragement-note.repository");
const user_repository_1 = require("../../auth/infrastructure/repositories/user.repository");
let CreateEncouragementNoteUseCase = class CreateEncouragementNoteUseCase {
    noteRepo;
    userRepo;
    constructor(noteRepo, userRepo) {
        this.noteRepo = noteRepo;
        this.userRepo = userRepo;
    }
    async execute(senderId, receiverId, content) {
        const receiver = await this.userRepo.findById(receiverId);
        if (!receiver) {
            throw new common_1.HttpException({
                code: 'RECEIVER_NOT_FOUND',
                message: 'El destinatario no existe',
                details: { receiverId },
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const note = await this.noteRepo.create({
            senderId,
            receiverId,
            content,
        });
        return note;
    }
};
exports.CreateEncouragementNoteUseCase = CreateEncouragementNoteUseCase;
exports.CreateEncouragementNoteUseCase = CreateEncouragementNoteUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [encouragement_note_repository_1.EncouragementNoteRepository,
        user_repository_1.UserRepository])
], CreateEncouragementNoteUseCase);
//# sourceMappingURL=create-encouragement-note.usecase.js.map