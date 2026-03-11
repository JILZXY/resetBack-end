import { HydratedDocument } from 'mongoose';
export type PostDocument = HydratedDocument<Post>;
export declare class Post {
    authorId: string;
    title: string;
    content: string;
    isAnonymous: boolean;
    images: string[];
    tags: string[];
    reactionUps: number;
    commentCount: number;
    isDeleted: boolean;
    isEdited: boolean;
}
export declare const PostSchema: import("mongoose").Schema<Post, import("mongoose").Model<Post, any, any, any, (import("mongoose").Document<unknown, any, Post, any, import("mongoose").DefaultSchemaOptions> & Post & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Post, any, import("mongoose").DefaultSchemaOptions> & Post & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Post>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Post, import("mongoose").Document<unknown, {}, Post, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Post & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    authorId?: import("mongoose").SchemaDefinitionProperty<string, Post, import("mongoose").Document<unknown, {}, Post, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Post, import("mongoose").Document<unknown, {}, Post, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    content?: import("mongoose").SchemaDefinitionProperty<string, Post, import("mongoose").Document<unknown, {}, Post, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isAnonymous?: import("mongoose").SchemaDefinitionProperty<boolean, Post, import("mongoose").Document<unknown, {}, Post, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    images?: import("mongoose").SchemaDefinitionProperty<string[], Post, import("mongoose").Document<unknown, {}, Post, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tags?: import("mongoose").SchemaDefinitionProperty<string[], Post, import("mongoose").Document<unknown, {}, Post, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reactionUps?: import("mongoose").SchemaDefinitionProperty<number, Post, import("mongoose").Document<unknown, {}, Post, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    commentCount?: import("mongoose").SchemaDefinitionProperty<number, Post, import("mongoose").Document<unknown, {}, Post, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isDeleted?: import("mongoose").SchemaDefinitionProperty<boolean, Post, import("mongoose").Document<unknown, {}, Post, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isEdited?: import("mongoose").SchemaDefinitionProperty<boolean, Post, import("mongoose").Document<unknown, {}, Post, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Post>;
