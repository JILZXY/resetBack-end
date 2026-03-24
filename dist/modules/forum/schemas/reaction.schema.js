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
exports.ReactionSchema = exports.Reaction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Reaction = class Reaction {
    userId;
    targetId;
    targetType;
};
exports.Reaction = Reaction;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Reaction.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Reaction.prototype, "targetId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['post', 'comment'] }),
    __metadata("design:type", String)
], Reaction.prototype, "targetType", void 0);
exports.Reaction = Reaction = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'reactions',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    })
], Reaction);
exports.ReactionSchema = mongoose_1.SchemaFactory.createForClass(Reaction);
exports.ReactionSchema.index({ targetId: 1, targetType: 1, userId: 1 }, { unique: true });
//# sourceMappingURL=reaction.schema.js.map