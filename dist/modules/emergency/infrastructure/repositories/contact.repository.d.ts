import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { SupportContactEntity } from '../../domain/support-contact.entity';
export declare class ContactRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    countByUserId(userId: string): Promise<number>;
    findAllByUserId(userId: string): Promise<SupportContactEntity[]>;
    findById(id: string): Promise<SupportContactEntity | null>;
    create(data: {
        userId: string;
        contactName: string;
        phone?: string;
        email?: string;
        relationship?: string;
        customRelationship?: string;
        priorityOrder?: number;
    }): Promise<SupportContactEntity>;
    deactivate(id: string): Promise<void>;
    private toEntity;
}
