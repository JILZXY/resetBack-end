export class CommentEntity {
  id: string;
  postId: string;
  parentId: string | null;
  authorId: string;
  authorName?: string;
  content: string;
  isAnonymous: boolean;
  reactionUps: number;
  createdAt: Date;
  updatedAt: Date;
}