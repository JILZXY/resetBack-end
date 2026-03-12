import { HydratedDocument } from 'mongoose';
export type ReactionDocument = HydratedDocument<Reaction>;
export declare class Reaction {
    userId: string;
    targetId: string;
    targetType: string;
}
export declare const ReactionSchema: import("mongoose").Schema<Reaction, import("mongoose").Model<Reaction, any, any, any, (import("mongoose").Document<unknown, any, Reaction, any, import("mongoose").DefaultSchemaOptions> & Reaction & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Reaction, any, import("mongoose").DefaultSchemaOptions> & Reaction & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Reaction>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Reaction, import("mongoose").Document<unknown, {}, Reaction, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Reaction & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<string, Reaction, import("mongoose").Document<unknown, {}, Reaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetId?: import("mongoose").SchemaDefinitionProperty<string, Reaction, import("mongoose").Document<unknown, {}, Reaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetType?: import("mongoose").SchemaDefinitionProperty<string, Reaction, import("mongoose").Document<unknown, {}, Reaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Reaction>;
