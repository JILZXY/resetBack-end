import { HydratedDocument } from 'mongoose';
export type EncouragementNoteDocument = HydratedDocument<EncouragementNote>;
export declare class EncouragementNote {
    senderId: string;
    receiverId: string;
    content: string;
}
export declare const EncouragementNoteSchema: import("mongoose").Schema<EncouragementNote, import("mongoose").Model<EncouragementNote, any, any, any, (import("mongoose").Document<unknown, any, EncouragementNote, any, import("mongoose").DefaultSchemaOptions> & EncouragementNote & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, EncouragementNote, any, import("mongoose").DefaultSchemaOptions> & EncouragementNote & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, EncouragementNote>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EncouragementNote, import("mongoose").Document<unknown, {}, EncouragementNote, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<EncouragementNote & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    senderId?: import("mongoose").SchemaDefinitionProperty<string, EncouragementNote, import("mongoose").Document<unknown, {}, EncouragementNote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EncouragementNote & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    receiverId?: import("mongoose").SchemaDefinitionProperty<string, EncouragementNote, import("mongoose").Document<unknown, {}, EncouragementNote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EncouragementNote & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    content?: import("mongoose").SchemaDefinitionProperty<string, EncouragementNote, import("mongoose").Document<unknown, {}, EncouragementNote, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EncouragementNote & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, EncouragementNote>;
