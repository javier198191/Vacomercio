import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class ReputationService {
  constructor(private readonly prisma: PrismaService) {}

  async submitRating(dto: CreateRatingDto) {
    const { calificadorId, saleId, estrellas, criterio, comentario } = dto;

    // 1. Verify that the sale exists
    const sale = await this.prisma.sale.findUnique({
      where: { id: saleId },
    });

    if (!sale) {
      throw new NotFoundException(`La venta con ID ${saleId} no existe.`);
    }

    if (!sale.via_plataforma) {
      throw new BadRequestException('Solo se pueden calificar transacciones cerradas por la plataforma.');
    }

    // 2. Verify that the calificador is a party to the sale
    const isVendedor = sale.vendedorId === calificadorId;
    const isComprador = sale.compradorId === calificadorId;

    if (!isVendedor && !isComprador) {
      throw new BadRequestException('El calificador debe ser el comprador o el vendedor de esta transacción.');
    }

    // Determine who is being rated
    const calificadoId = isVendedor ? sale.compradorId : sale.vendedorId;

    // 3. Prevent duplicate ratings from same user for same sale
    const existingRating = await this.prisma.rating.findFirst({
      where: {
        saleId,
        calificadorId,
      },
    });

    if (existingRating) {
      throw new BadRequestException('Ya has calificado esta transacción.');
    }

    // 4. Save the rating
    const rating = await this.prisma.rating.create({
      data: {
        calificadorId,
        calificadoId,
        saleId,
        estrellas,
        criterio,
        comentario,
      },
    });

    // 5. Check if both ratings have been submitted for this sale
    const ratingsForSale = await this.prisma.rating.findMany({
      where: { saleId },
    });

    const hasBothRatings = ratingsForSale.length === 2;

    if (hasBothRatings) {
      // 6. Recalculate average reputation for both users
      await this.updateUserReputation(sale.vendedorId);
      await this.updateUserReputation(sale.compradorId);

      return {
        message: 'Calificación registrada con éxito. Ambas partes han calificado. Reputaciones promedio actualizadas.',
        rating,
        completedMutualRating: true,
      };
    }

    return {
      message: 'Calificación registrada con éxito. Esperando la calificación de la contraparte.',
      rating,
      completedMutualRating: false,
    };
  }

  // Helper method to recalculate and update a user's average reputation
  private async updateUserReputation(userId: string) {
    const aggregateResult = await this.prisma.rating.aggregate({
      where: { calificadoId: userId },
      _avg: {
        estrellas: true,
      },
    });

    const newAvg = aggregateResult._avg.estrellas || 0.0;

    // Round to 2 decimals
    const roundedAvg = Math.round(newAvg * 100) / 100;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        reputacion_promedio: roundedAvg,
      },
    });
  }

  async getRatingsForUser(userId: string) {
    return this.prisma.rating.findMany({
      where: { calificadoId: userId },
      include: {
        calificador: true,
      },
    });
  }
}
