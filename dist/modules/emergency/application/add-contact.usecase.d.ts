import { ContactRepository } from '../infrastructure/repositories/contact.repository';
import { CreateContactDto } from '../infrastructure/dtos/create-contact.dto';
export declare class AddContactUseCase {
    private readonly contactRepo;
    constructor(contactRepo: ContactRepository);
    execute(userId: string, dto: CreateContactDto): Promise<import("../domain/support-contact.entity").SupportContactEntity>;
}
