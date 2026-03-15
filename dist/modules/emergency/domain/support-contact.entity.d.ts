export declare class SupportContactEntity {
    id: string;
    userId: string;
    contactName: string;
    email: string | null;
    relationship: string | null;
    customRelationship: string | null;
    isActive: boolean;
    priorityOrder: number | null;
    createdAt: Date;
    updatedAt: Date;
}
