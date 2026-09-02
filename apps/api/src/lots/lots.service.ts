import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { AnimalEstado, LotEstado } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as ws from 'ws';

// Safely extract the WebSocket constructor whether esModuleInterop is enabled or not
const WebSocketConstructor = (ws as any).default || ws;

if (typeof global !== 'undefined' && !global.WebSocket) {
  (global as any).WebSocket = WebSocketConstructor;
}

@Injectable()
export class LotsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLotDto: CreateLotDto, files: Express.Multer.File[]) {
    const { nombre, cantidad, peso_promedio, peso_total, precio, departamento, municipio, userId, categoria } = createLotDto;

    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    const urls: string[] = [];

    if (files && files.length > 0) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new BadRequestException('Supabase credentials are not configured. Please set SUPABASE_URL and SUPABASE_KEY.');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      for (const file of files) {
        const uniqueName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '')}`;
        
        const { data: uploadData, error } = await supabase.storage
          .from('animales')
          .upload(uniqueName, file.buffer, {
            contentType: file.mimetype,
          });

        if (error) {
          throw new BadRequestException(`Error al subir la imagen a Supabase: ${error.message}`);
        }

        const { data: urlData } = supabase.storage
          .from('animales')
          .getPublicUrl(uniqueName);

        urls.push(urlData.publicUrl);
      }
    }

    const foto_url = urls.length > 0 ? urls.join(',') : (createLotDto.foto_url || null);

    const parsedCantidad = cantidad !== undefined ? Number(cantidad) : 0;
    const parsedPesoPromedio = peso_promedio !== undefined ? Number(peso_promedio) : 0;
    const parsedPesoTotal = peso_total !== undefined ? Number(peso_total) : 0;
    const parsedPrecio = precio !== undefined ? Number(precio) : 0;

    return this.prisma.lot.create({
      data: {
        nombre,
        cantidad: parsedCantidad,
        peso_promedio: parsedPesoPromedio,
        peso_total: parsedPesoTotal,
        precio: parsedPrecio,
        estado: LotEstado.DISPONIBLE,
        foto_url,
        categoria,
        departamento,
        municipio,
        userId,
      },
    });
  }

  async createDynamic(createLotDto: CreateLotDto) {
    const { animalIds, nombre, precio, departamento, municipio, userId, foto_url, categoria } = createLotDto;

    if (!userId) {
      throw new BadRequestException('userId is required');
    }

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
      throw new ForbiddenException({
        statusCode: 403,
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
          categoria,
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

  async findAll(userId: string) {
    const where: any = {
      userId,
    };
    return this.prisma.lot.findMany({
      where,
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

    const animals = lot.animals || [];
    const cantidad = animals.length > 0 ? animals.length : (lot.cantidad || 0);
    const peso_total = animals.length > 0
      ? animals.reduce((sum, a) => sum + (a.peso || 0), 0)
      : (lot.peso_total || 0);
    const peso_promedio = cantidad > 0 ? peso_total / cantidad : (lot.peso_promedio || 0);

    return {
      ...lot,
      cantidad,
      peso_total,
      peso_promedio,
    };
  }

  async assignAnimals(id: string, animalIds: string[]) {
    // 1. Assign selected animals to the lot
    await this.prisma.animal.updateMany({
      where: { id: { in: animalIds } },
      data: {
        loteId: id,
        estado: AnimalEstado.EN_LOTE,
      },
    });

    // 2. Fetch all animals currently in this lot to recalculate metrics
    const animals = await this.prisma.animal.findMany({
      where: { loteId: id },
    });

    const cantidad = animals.length;
    const peso_total = animals.reduce((sum, a) => sum + a.peso, 0);
    const peso_promedio = cantidad > 0 ? peso_total / cantidad : 0;

    // 3. Update the Lot with recalculated consolidated metrics
    return this.prisma.lot.update({
      where: { id },
      data: {
        cantidad,
        peso_total,
        peso_promedio,
      },
      include: { animals: true },
    });
  }

  async updateMarketplaceStatus(id: string, en_marketplace: boolean, precio?: number) {
    await this.findOne(id);
    const updateData: any = { en_marketplace };
    if (precio !== undefined) {
      updateData.precio = precio;
    }
    return this.prisma.lot.update({
      where: { id },
      data: updateData,
    });
  }

  async update(id: string, updateLotDto: UpdateLotDto) {
    // 1. Fetch current lot with its animals
    const lot = await this.findOne(id);

    const { animalIds, nombre, precio, categoria, departamento, municipio, userId } = updateLotDto;

    // 2. Perform database operations in a transaction
    return this.prisma.$transaction(async (tx) => {
      if (animalIds !== undefined) {
        const currentAnimalIds = lot.animals.map(a => a.id);
        const animalIdsToRemove = currentAnimalIds.filter(aid => !animalIds.includes(aid));
        const animalIdsToAdd = animalIds.filter(aid => !currentAnimalIds.includes(aid));

        // Validation for new animals being added
        if (animalIdsToAdd.length > 0) {
          const animalsToAdd = await tx.animal.findMany({
            where: {
              id: { in: animalIdsToAdd },
              userId: userId || lot.userId,
            },
          });

          if (animalsToAdd.length !== animalIdsToAdd.length) {
            throw new NotFoundException('Algunas vacas seleccionadas para añadir no existen o no pertenecen a este usuario.');
          }

          // Check if any is already in a lot (excluding this one) or sold
          const unavailableAnimals = animalsToAdd.filter(a => a.estado !== AnimalEstado.DISPONIBLE);
          if (unavailableAnimals.length > 0) {
            const names = unavailableAnimals.map(a => `${a.nombre} (#${a.arete})`).join(', ');
            throw new BadRequestException(`Las siguientes vacas no están disponibles para loteo: ${names}`);
          }

          // Inocuidad/Medical Withdrawal period check
          const now = new Date();
          const animalsWithWithdrawal = animalsToAdd.filter(animal => {
            if (animal.en_periodo_retiro) return true;
            if (animal.fecha_limite_retiro && new Date(animal.fecha_limite_retiro) > now) return true;
            return false;
          });

          if (animalsWithWithdrawal.length > 0) {
            const details = animalsWithWithdrawal.map(a => {
              const dateStr = a.fecha_limite_retiro ? new Date(a.fecha_limite_retiro).toLocaleDateString() : 'fecha no especificada';
              return `Animal ${a.nombre} (#${a.arete}) con medicamento ${a.medicamento_retiro || 'desconocido'} (límite: ${dateStr})`;
            }).join(', ');
            throw new ForbiddenException({
              statusCode: 403,
              error: 'SanityCheckFailed',
              message: `Advertencia de inocuidad: No se puede añadir estas vacas. Tienen periodo de carencia activo: ${details}`,
            });
          }
        }

        // Disconnect removed animals
        if (animalIdsToRemove.length > 0) {
          await tx.animal.updateMany({
            where: { id: { in: animalIdsToRemove } },
            data: {
              loteId: null,
              estado: AnimalEstado.DISPONIBLE,
            },
          });
        }

        // Connect added animals
        if (animalIdsToAdd.length > 0) {
          await tx.animal.updateMany({
            where: { id: { in: animalIdsToAdd } },
            data: {
              loteId: id,
              estado: AnimalEstado.EN_LOTE,
            },
          });
        }
      }

      // 3. Recalculate metrics based on final set of animals
      const finalAnimals = await tx.animal.findMany({
        where: { loteId: id },
      });

      const cantidad = finalAnimals.length;
      const peso_total = finalAnimals.reduce((sum, a) => sum + a.peso, 0);
      const peso_promedio = cantidad > 0 ? peso_total / cantidad : 0;

      let finalPrice = Number(lot.precio);
      if (precio !== undefined) {
        finalPrice = Number(precio);
      } else if (animalIds !== undefined) {
        finalPrice = finalAnimals.reduce((sum, a) => sum + Number(a.precio), 0);
      }

      const updateData: any = {};
      if (nombre !== undefined) updateData.nombre = nombre;
      if (categoria !== undefined) updateData.categoria = categoria;
      if (departamento !== undefined) updateData.departamento = departamento;
      if (municipio !== undefined) updateData.municipio = municipio;
      
      updateData.precio = finalPrice;
      updateData.cantidad = cantidad;
      updateData.peso_total = peso_total;
      updateData.peso_promedio = peso_promedio;

      // Update the lot
      return tx.lot.update({
        where: { id },
        data: updateData,
        include: { animals: true },
      });
    });
  }

  async remove(id: string) {
    // 1. Fetch lot to verify existence
    await this.findOne(id);

    // 2. Perform deletion and animal release in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Release all animals in this lot
      await tx.animal.updateMany({
        where: { loteId: id },
        data: {
          loteId: null,
          estado: AnimalEstado.DISPONIBLE,
        },
      });

      // Delete the lot
      return tx.lot.delete({
        where: { id },
      });
    });
  }
}
