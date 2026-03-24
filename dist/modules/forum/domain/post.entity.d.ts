export declare class PostEntity {
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
    isDeleted: boolean;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
}
