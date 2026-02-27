import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../schemas/post.schema';
import { PostEntity } from '../../domain/post.entity';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<PostDocument>) {}

  async create(data: {
    authorId: string;
    title: string;
    content: string;
    isAnonymous: boolean;
    tags?: string[];
    images?: string[];
  }): Promise<PostEntity> {
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

  async findAll(page: number, limit: number, tag?: string): Promise<PostEntity[]> {
    const filter: any = { isDeleted: false };
    if (tag) filter.tags = tag;
    const posts = await this.postModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return posts.map((p) => this.toEntity(p));
  }

  async findById(id: string): Promise<PostEntity | null> {
    const post = await this.postModel.findOne({ _id: id, isDeleted: false }).exec();
    return post ? this.toEntity(post) : null;
  }

  async findByAuthorId(authorId: string): Promise<PostEntity[]> {
    const posts = await this.postModel
      .find({ authorId, isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
    return posts.map((p) => this.toEntity(p));
  }

  async update(id: string, data: Partial<{
    title: string;
    content: string;
    tags: string[];
    images: string[];
    isDeleted: boolean;
    isEdited: boolean;
  }>): Promise<PostEntity | null> {
    const post = await this.postModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
    return post ? this.toEntity(post) : null;
  }

  async softDelete(id: string): Promise<void> {
    await this.postModel.findByIdAndUpdate(id, { $set: { isDeleted: true } }).exec();
  }

  async incrementReaction(id: string): Promise<PostEntity | null> {
    const post = await this.postModel
      .findByIdAndUpdate(id, { $inc: { reactionUps: 1 } }, { new: true })
      .exec();
    return post ? this.toEntity(post) : null;
  }

  async decrementReaction(id: string): Promise<PostEntity | null> {
    const post = await this.postModel
      .findByIdAndUpdate(id, { $inc: { reactionUps: -1 } }, { new: true })
      .exec();
    return post ? this.toEntity(post) : null;
  }

  async incrementCommentCount(id: string): Promise<void> {
    await this.postModel.findByIdAndUpdate(id, { $inc: { commentCount: 1 } }).exec();
  }

  async decrementCommentCount(id: string): Promise<void> {
    await this.postModel
      .findByIdAndUpdate(id, { $inc: { commentCount: -1 } })
      .exec();
  }

  private toEntity(raw: PostDocument): PostEntity {
    const entity = new PostEntity();
    entity.id = (raw._id as any).toString();
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
    entity.createdAt = (raw as any).createdAt;
    entity.updatedAt = (raw as any).updatedAt;
    return entity;
  }
}