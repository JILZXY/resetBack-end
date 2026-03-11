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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncouragementNoteRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const encouragement_note_schema_1 = require("../../schemas/encouragement-note.schema");
const encouragement_note_entity_1 = require("../../domain/encouragement-note.entity");
let EncouragementNoteRepository = class EncouragementNoteRepository {
    noteModel;
    constructor(noteModel) {
        this.noteModel = noteModel;
    }
    async create(data) {
        const created = await this.noteModel.create(data);
        return this.toEntity(created);
    }
    async findByReceiverId(receiverId) {
        const notes = await this.noteModel
            .find({ receiverId })
            .sort({ createdAt: -1 })
            .exec();
        return notes.map((n) => this.toEntity(n));
    }
    toEntity(raw) {
        const entity = new encouragement_note_entity_1.EncouragementNoteEntity();
        entity.id = raw._id.toString();
        entity.senderId = raw.senderId;
        entity.receiverId = raw.receiverId;
        entity.content = raw.content;
        entity.createdAt = raw.createdAt;
        return entity;
    }
};
exports.EncouragementNoteRepository = EncouragementNoteRepository;
exports.EncouragementNoteRepository = EncouragementNoteRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(encouragement_note_schema_1.EncouragementNote.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EncouragementNoteRepository);
//# sourceMappingURL=encouragement-note.repository.js.map