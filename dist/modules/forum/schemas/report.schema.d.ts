import { HydratedDocument } from 'mongoose';
export type ReportDocument = HydratedDocument<Report>;
export declare enum ReportReason {
    SPAM = "SPAM",
    HARASSMENT = "HARASSMENT",
    HATE_SPEECH = "HATE_SPEECH",
    INAPPROPRIATE_CONTENT = "INAPPROPRIATE_CONTENT",
    OTHER = "OTHER"
}
export declare enum ReportStatus {
    PENDING = "PENDING",
    REVIEWED = "REVIEWED",
    DISMISSED = "DISMISSED",
    ACTION_TAKEN = "ACTION_TAKEN"
}
export declare class Report {
    reporterId: string;
    targetId: string;
    targetType: string;
    reason: ReportReason;
    details: string;
    status: ReportStatus;
}
export declare const ReportSchema: import("mongoose").Schema<Report, import("mongoose").Model<Report, any, any, any, (import("mongoose").Document<unknown, any, Report, any, import("mongoose").DefaultSchemaOptions> & Report & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Report, any, import("mongoose").DefaultSchemaOptions> & Report & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Report>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Report, import("mongoose").Document<unknown, {}, Report, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    reporterId?: import("mongoose").SchemaDefinitionProperty<string, Report, import("mongoose").Document<unknown, {}, Report, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetId?: import("mongoose").SchemaDefinitionProperty<string, Report, import("mongoose").Document<unknown, {}, Report, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetType?: import("mongoose").SchemaDefinitionProperty<string, Report, import("mongoose").Document<unknown, {}, Report, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<ReportReason, Report, import("mongoose").Document<unknown, {}, Report, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    details?: import("mongoose").SchemaDefinitionProperty<string, Report, import("mongoose").Document<unknown, {}, Report, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<ReportStatus, Report, import("mongoose").Document<unknown, {}, Report, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Report>;
