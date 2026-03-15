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
exports.ReactionRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const reaction_schema_1 = require("../../schemas/reaction.schema");
const reaction_entity_1 = require("../../domain/reaction.entity");
let ReactionRepository = class ReactionRepository {
    reactionModel;
    constructor(reactionModel) {
        this.reactionModel = reactionModel;
    }
    async findOne(userId, targetId, targetType) {
        const reaction = await this.reactionModel
            .findOne({ userId, targetId, targetType })
            .exec();
        return reaction ? this.toEntity(reaction) : null;
    }
    async create(data) {
        const reaction = await this.reactionModel.create(data);
        return this.toEntity(reaction);
    }
    async delete(userId, targetId, targetType) {
        await this.reactionModel.deleteOne({ userId, targetId, targetType }).exec();
    }
    toEntity(raw) {
        const entity = new reaction_entity_1.ReactionEntity();
        entity.id = raw._id.toString();
        entity.userId = raw.userId;
        entity.targetId = raw.targetId;
        entity.targetType = raw.targetType;
        entity.createdAt = raw.createdAt;
        return entity;
    }
};
exports.ReactionRepository = ReactionRepository;
exports.ReactionRepository = ReactionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(reaction_schema_1.Reaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReactionRepository);
//# sourceMappingURL=reaction.repository.js.map