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
exports.CommentRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comment_schema_1 = require("../../schemas/comment.schema");
const comment_entity_1 = require("../../domain/comment.entity");
let CommentRepository = class CommentRepository {
    commentModel;
    constructor(commentModel) {
        this.commentModel = commentModel;
    }
    async create(data) {
        const comment = await this.commentModel.create({
            postId: data.postId,
            authorId: data.authorId,
            content: data.content,
            isAnonymous: data.isAnonymous,
            parentId: data.parentId ?? null,
        });
        return this.toEntity(comment);
    }
    async findByPostId(postId) {
        const comments = await this.commentModel
            .find({ postId: postId, isDeleted: false })
            .sort({ createdAt: 1 })
            .exec();
        return comments.map((c) => this.toEntity(c));
    }
    async findById(id) {
        const comment = await this.commentModel
            .findOne({ _id: id, isDeleted: false })
            .exec();
        return comment ? this.toEntity(comment) : null;
    }
    async softDelete(id) {
        await this.commentModel
            .findByIdAndUpdate(id, { $set: { isDeleted: true } })
            .exec();
    }
    async softDeleteByPostId(postId) {
        await this.commentModel
            .updateMany({ postId: postId }, { $set: { isDeleted: true } })
            .exec();
    }
    async update(id, data) {
        const comment = await this.commentModel
            .findByIdAndUpdate(id, { $set: data }, { new: true })
            .exec();
        return comment ? this.toEntity(comment) : null;
    }
    async incrementReaction(id) {
        const comment = await this.commentModel
            .findByIdAndUpdate(id, { $inc: { reactionUps: 1 } }, { new: true })
            .exec();
        return comment ? this.toEntity(comment) : null;
    }
    async decrementReaction(id) {
        const comment = await this.commentModel
            .findByIdAndUpdate(id, { $inc: { reactionUps: -1 } }, { new: true })
            .exec();
        return comment ? this.toEntity(comment) : null;
    }
    toEntity(raw) {
        const entity = new comment_entity_1.CommentEntity();
        entity.id = raw._id.toString();
        entity.postId = raw.postId;
        entity.parentId = raw.parentId ?? null;
        entity.authorId = raw.authorId;
        entity.content = raw.content;
        entity.isAnonymous = raw.isAnonymous;
        entity.reactionUps = raw.reactionUps;
        entity.isDeleted = raw.isDeleted;
        entity.isEdited = raw.isEdited;
        entity.createdAt = raw.createdAt;
        entity.updatedAt = raw.updatedAt;
        return entity;
    }
};
exports.CommentRepository = CommentRepository;
exports.CommentRepository = CommentRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CommentRepository);
//# sourceMappingURL=comment.repository.js.map