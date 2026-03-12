export class CommentEntity {
  id: string;
  postId: string;
  parentId: string | null;
  authorId: string;
  authorName?: string;
  content: string;
  isAnonymous: boolean;
  reactionUps: number;
  reportCount: number;
  isDeleted: boolean;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}
