import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ContactRepository } from '../infrastructure/repositories/contact.repository';
import { CreateContactDto } from '../infrastructure/dtos/create-contact.dto';

@Injectable()
export class AddContactUseCase {
  constructor(private readonly contactRepo: ContactRepository) {}

  async execute(userId: string, dto: CreateContactDto) {
    const count = await this.contactRepo.countByUserId(userId);

    if (count >= 5) {
      throw new HttpException(
        {
          code: 'MAX_CONTACTS_REACHED',
          message: 'Ya tienes el máximo de 5 contactos de apoyo registrados',
          details: { current_count: count, max_allowed: 5 },
        },
        HttpStatus.CONFLICT,
      );
    }

    if (!dto.email) {
      throw new HttpException(
        {
          code: 'CONTACT_MISSING_EMAIL',
          message: 'El contacto debe tener un correo electrónico',
          details: {},
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.contactRepo.create({
        userId,
        contactName: dto.contactName,
        email: dto.email,
        relationship: dto.relationship,
        customRelationship: dto.customRelationship,
        priorityOrder: dto.priorityOrder,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException(
          {
            code: 'DUPLICATE_CONTACT_EMAIL',
            message:
              'Ya tienes un contacto registrado con este correo electrónico',
            details: { email: dto.email },
          },
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }
}
