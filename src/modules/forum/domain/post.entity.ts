export class PostEntity {
  id: string;
  authorId: string;
  authorName?: string;
  title: string;
  content: string;
  isAnonymous: boolean;
  images: string[];
  tags: string[];
  reactionUps: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}