import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { SupportContactEntity } from '../../domain/support-contact.entity';

@Injectable()
export class ContactRepository {
  constructor(private readonly prisma: PrismaService) { }

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.supportContact.count({
      where: { user_id: userId, is_active: true },
    });
  }

  async findAllByUserId(userId: string): Promise<SupportContactEntity[]> {
    const contacts = await this.prisma.supportContact.findMany({
      where: { user_id: userId, is_active: true },
      orderBy: { priority_order: 'asc' },
    });
    return contacts.map((c) => this.toEntity(c));
  }

  async findById(id: string): Promise<SupportContactEntity | null> {
    const contact = await this.prisma.supportContact.findUnique({
      where: { id },
    });
    return contact ? this.toEntity(contact) : null;
  }

  async create(data: {
    userId: string;
    contactName: string;
    phone?: string;
    email?: string;
    relationship?: string;
    customRelationship?: string;
    priorityOrder?: number;
  }): Promise<SupportContactEntity> {
    const contact = await this.prisma.supportContact.create({
      data: {
        user_id: data.userId,
        contact_name: data.contactName,
        phone: data.phone ?? undefined,
        email: data.email ?? undefined,
        relationship: data.relationship ?? undefined,
        custom_relationship: data.customRelationship ?? undefined,
        priority_order: data.priorityOrder ?? undefined,
      },
    });
    return this.toEntity(contact);
  }

  async deactivate(id: string): Promise<void> {
    await this.prisma.supportContact.update({
      where: { id },
      data: { is_active: false },
    });
  }

  private toEntity(raw: any): SupportContactEntity {
    const entity = new SupportContactEntity();
    entity.id = raw.id;
    entity.userId = raw.user_id;
    entity.contactName = raw.contact_name;
    entity.phone = raw.phone;
    entity.email = raw.email;
    entity.relationship = raw.relationship;
    entity.customRelationship = raw.custom_relationship;
    entity.isActive = raw.is_active;
    entity.priorityOrder = raw.priority_order;
    entity.createdAt = raw.created_at;
    entity.updatedAt = raw.updated_at;
    return entity;
  }
}