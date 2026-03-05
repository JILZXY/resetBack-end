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
exports.EncouragementNoteSchema = exports.EncouragementNote = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let EncouragementNote = class EncouragementNote {
    senderId;
    receiverId;
    content;
};
exports.EncouragementNote = EncouragementNote;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EncouragementNote.prototype, "senderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EncouragementNote.prototype, "receiverId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EncouragementNote.prototype, "content", void 0);
exports.EncouragementNote = EncouragementNote = __decorate([
    (0, mongoose_1.Schema)({ collection: 'encouragement_notes', timestamps: { createdAt: 'createdAt', updatedAt: false } })
], EncouragementNote);
exports.EncouragementNoteSchema = mongoose_1.SchemaFactory.createForClass(EncouragementNote);
exports.EncouragementNoteSchema.index({ receiverId: 1, createdAt: -1 });
exports.EncouragementNoteSchema.index({ senderId: 1 });
//# sourceMappingURL=encouragement-note.schema.js.map