import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class InterestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateInterestDto) {
    const { compradorId, animalId, loteId } = dto;

    if (!animalId && !loteId) {
      throw new BadRequestException('Debe vincular el interés a un animal o a un lote.');
    }

    // Create Interest record
    const interest = await this.prisma.interest.create({
      data: {
        compradorId,
        animalId: animalId || null,
        loteId: loteId || null,
      },
    });

    // Trigger WhatsApp notification simulation
    const waLink = await this.notificationsService.notifySellerOfInterest(interest.id);

    return {
      message: 'Interés registrado con éxito.',
      interest,
      whatsappLink: waLink,
    };
  }

  async findAll() {
    return this.prisma.interest.findMany({
      include: {
        comprador: true,
        animal: true,
        lot: true,
      },
    });
  }
}
