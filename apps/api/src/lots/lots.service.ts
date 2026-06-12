import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { AnimalEstado, LotEstado } from '@prisma/client';

@Injectable()
export class LotsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDynamic(createLotDto: CreateLotDto) {
    const { animalIds, nombre, precio, departamento, municipio, userId, foto_url } = createLotDto;

    if (!animalIds || animalIds.length === 0) {
      throw new BadRequestException('Debe seleccionar al menos un animal para armar el lote.');
    }

    // 1. Fetch selected animals
    const animals = await this.prisma.animal.findMany({
      where: {
        id: { in: animalIds },
        userId,
      },
    });

    if (animals.length !== animalIds.length) {
      throw new NotFoundException('Algunos animales seleccionados no existen o no pertenecen a este usuario.');
    }

    // Check if any animal is already in a lot or sold
    const unavailableAnimals = animals.filter(a => a.estado !== AnimalEstado.DISPONIBLE);
    if (unavailableAnimals.length > 0) {
      const names = unavailableAnimals.map(a => `${a.nombre} (#${a.arete})`).join(', ');
      throw new BadRequestException(`Los siguientes animales no están disponibles para loteo: ${names}`);
    }

    // 2. Sanity Check: Medical Withdrawal Period
    const now = new Date();
    const animalsWithWithdrawal = animals.filter(animal => {
      if (animal.en_periodo_retiro) return true;
      if (animal.fecha_limite_retiro && new Date(animal.fecha_limite_retiro) > now) return true;
      return false;
    });

    if (animalsWithWithdrawal.length > 0) {
      const details = animalsWithWithdrawal.map(a => {
        const dateStr = a.fecha_limite_retiro ? new Date(a.fecha_limite_retiro).toLocaleDateString() : 'fecha no especificada';
        return `Animal ${a.nombre} (#${a.arete}) con medicamento ${a.medicamento_retiro || 'desconocido'} (límite: ${dateStr})`;
      }).join(', ');
      throw new BadRequestException({
        statusCode: 400,
        error: 'SanityCheckFailed',
        message: `Advertencia de inocuidad: La creación de este lote ha sido bloqueada. Los siguientes animales tienen un periodo de carencia (retiro de medicamentos veterinarios) activo para consumo humano directo: ${details}`,
      });
    }

    // 3. Calculations
    const cantidad = animals.length;
    const peso_total = animals.reduce((sum, a) => sum + a.peso, 0);
    const peso_promedio = peso_total / cantidad;

    // Sum of animal prices
    const calculatedPriceSum = animals.reduce((sum, a) => sum + Number(a.precio), 0);
    const finalPrice = precio !== undefined ? precio : calculatedPriceSum;

    // 4. Run database updates in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Create the Lot
      const lot = await tx.lot.create({
        data: {
          nombre,
          cantidad,
          peso_total,
          peso_promedio,
          precio: finalPrice,
          estado: LotEstado.DISPONIBLE,
          foto_url,
          departamento,
          municipio,
          userId,
        },
      });

      // Update all associated animals: set state to EN_LOTE and assign loteId
      await tx.animal.updateMany({
        where: {
          id: { in: animalIds },
        },
        data: {
          loteId: lot.id,
          estado: AnimalEstado.EN_LOTE,
        },
      });

      return tx.lot.findUnique({
        where: { id: lot.id },
        include: { animals: true },
      });
    });
  }

  async findAll() {
    return this.prisma.lot.findMany({
      include: {
        animals: true,
        user: true,
      },
    });
  }

  async findOne(id: string) {
    const lot = await this.prisma.lot.findUnique({
      where: { id },
      include: {
        animals: true,
        user: true,
      },
    });

    if (!lot) {
      throw new NotFoundException(`Lote con ID ${id} no encontrado.`);
    }

    return lot;
  }
}
