import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Simulates sending a WhatsApp notification to the seller.
   * Compiles the pre-filled message template containing: buyer name, animal/lot name, and seller's municipality.
   */
  async notifySellerOfInterest(interestId: string): Promise<string> {
    const interest = await this.prisma.interest.findUnique({
      where: { id: interestId },
      include: {
        comprador: true,
        animal: {
          include: { user: true },
        },
        lot: {
          include: { user: true },
        },
      },
    });

    if (!interest) {
      this.logger.error(`Interest record with ID ${interestId} not found`);
      return '';
    }

    const buyerName = interest.comprador.nombre;
    let cattleName = '';
    let sellerPhone = '';
    let sellerMunicipality = '';

    if (interest.animal) {
      cattleName = `${interest.animal.nombre} (${interest.animal.raza}, Arete: ${interest.animal.arete})`;
      sellerPhone = interest.animal.user.telefono;
      sellerMunicipality = interest.animal.user.municipio;
    } else if (interest.lot) {
      cattleName = `Lote: ${interest.lot.nombre} (${interest.lot.cantidad} Cabezas)`;
      sellerPhone = interest.lot.user.telefono;
      sellerMunicipality = interest.lot.municipio;
    } else {
      this.logger.warn(`Interest record ${interestId} has neither animal nor lot linked.`);
      return '';
    }

    // Compile WhatsApp pre-filled template message
    const messageTemplate = `Hola, soy ${buyerName}. Estoy interesado en tu publicación de ganado: "${cattleName}" ubicada en ${sellerMunicipality}. Vi tu publicación en la plataforma Vacomercio.`;

    // Perform URL encoding for wa.me links
    const encodedMessage = encodeURIComponent(messageTemplate);
    const waLink = `https://wa.me/${sellerPhone.replace(/\D/g, '')}?text=${encodedMessage}`;

    this.logger.log(`[SIMULATED WHATSAPP NOTIFICATION]`);
    this.logger.log(`To: ${sellerPhone}`);
    this.logger.log(`Message: ${messageTemplate}`);
    this.logger.log(`Direct Link: ${waLink}`);

    return waLink;
  }
}
