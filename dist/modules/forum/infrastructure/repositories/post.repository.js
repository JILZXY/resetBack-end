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
exports.PostRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const post_schema_1 = require("../../schemas/post.schema");
const post_entity_1 = require("../../domain/post.entity");
let PostRepository = class PostRepository {
    postModel;
    constructor(postModel) {
        this.postModel = postModel;
    }
    async create(data) {
        const post = await this.postModel.create({
            authorId: data.authorId,
            title: data.title,
            content: data.content,
            isAnonymous: data.isAnonymous,
            tags: data.tags ?? [],
            images: data.images ?? [],
        });
        return this.toEntity(post);
    }
    async findAll(page, limit, tag) {
        const filter = { isDeleted: false };
        if (tag)
            filter.tags = tag;
        const posts = await this.postModel
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        return posts.map((p) => this.toEntity(p));
    }
    async findById(id) {
        const post = await this.postModel
            .findOne({ _id: id, isDeleted: false })
            .exec();
        return post ? this.toEntity(post) : null;
    }
    async findByAuthorId(authorId) {
        const posts = await this.postModel
            .find({ authorId, isDeleted: false })
            .sort({ createdAt: -1 })
            .exec();
        return posts.map((p) => this.toEntity(p));
    }
    async update(id, data) {
        const post = await this.postModel
            .findByIdAndUpdate(id, { $set: data }, { new: true })
            .exec();
        return post ? this.toEntity(post) : null;
    }
    async softDelete(id) {
        await this.postModel
            .findByIdAndUpdate(id, { $set: { isDeleted: true } })
            .exec();
    }
    async incrementReaction(id) {
        const post = await this.postModel
            .findByIdAndUpdate(id, { $inc: { reactionUps: 1 } }, { new: true })
            .exec();
        return post ? this.toEntity(post) : null;
    }
    async decrementReaction(id) {
        const post = await this.postModel
            .findByIdAndUpdate(id, { $inc: { reactionUps: -1 } }, { new: true })
            .exec();
        return post ? this.toEntity(post) : null;
    }
    async incrementCommentCount(id) {
        await this.postModel
            .findByIdAndUpdate(id, { $inc: { commentCount: 1 } })
            .exec();
    }
    async decrementCommentCount(id) {
        await this.postModel
            .findByIdAndUpdate(id, { $inc: { commentCount: -1 } })
            .exec();
    }
    toEntity(raw) {
        const entity = new post_entity_1.PostEntity();
        entity.id = raw._id.toString();
        entity.authorId = raw.authorId;
        entity.title = raw.title;
        entity.content = raw.content;
        entity.isAnonymous = raw.isAnonymous;
        entity.images = raw.images;
        entity.tags = raw.tags;
        entity.reactionUps = raw.reactionUps;
        entity.commentCount = raw.commentCount;
        entity.isDeleted = raw.isDeleted;
        entity.isEdited = raw.isEdited;
        entity.createdAt = raw.createdAt;
        entity.updatedAt = raw.updatedAt;
        return entity;
    }
};
exports.PostRepository = PostRepository;
exports.PostRepository = PostRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PostRepository);
//# sourceMappingURL=post.repository.js.map