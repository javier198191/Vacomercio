import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AnimalEstado } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as ws from 'ws';

// Safely extract the WebSocket constructor whether esModuleInterop is enabled or not
const WebSocketConstructor = (ws as any).default || ws;

if (typeof global !== 'undefined' && !global.WebSocket) {
  (global as any).WebSocket = WebSocketConstructor;
}

@Injectable()
export class AnimalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAnimalDto: CreateAnimalDto, files: Express.Multer.File[]) {
    const parsedPeso = Number(createAnimalDto.peso);
    const parsedPrecio = Number(createAnimalDto.precio);

    const { fecha_limite_retiro, precio, peso, departamento, municipio, en_marketplace, userId, ...data } = createAnimalDto;
    
    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    const isMarketplace = (createAnimalDto.en_marketplace as any) === 'true' || createAnimalDto.en_marketplace === true;

    // Check if an animal with the same arete already exists for this user
    const existing = await this.prisma.animal.findFirst({
      where: { arete: data.arete, userId },
    });
    if (existing) {
      throw new ConflictException('El número de arete ya se encuentra registrado');
    }

    let foto_url = 'https://via.placeholder.com/400x300?text=Vaca+Sin+Foto';
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials are not configured. Using fallback placeholder image.');
    } else if (files && files.length > 0) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const urls: string[] = [];

        for (const file of files) {
          const uniqueName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '')}`;
          
          const { data: uploadData, error } = await supabase.storage
            .from('animales')
            .upload(uniqueName, file.buffer, {
              contentType: file.mimetype,
            });

          if (error) {
            throw new Error(error.message);
          }

          const { data: urlData } = supabase.storage
            .from('animales')
            .getPublicUrl(uniqueName);

          urls.push(urlData.publicUrl);
        }

        if (urls.length > 0) {
          foto_url = urls.join(',');
        }
      } catch (err: any) {
        console.error('Error al subir la imagen a Supabase (activando fallback):', err);
      }
    }

    // Automatically transition to EN_LOTE if loteId is provided during creation
    const estado = data.loteId ? AnimalEstado.EN_LOTE : AnimalEstado.DISPONIBLE;

    return this.prisma.animal.create({
      data: {
        ...data,
        nombre: data.nombre || '',
        userId,
        peso: parsedPeso,
        precio: parsedPrecio,
        departamento,
        municipio,
        estado,
        foto_url,
        fecha_limite_retiro: fecha_limite_retiro ? new Date(fecha_limite_retiro) : null,
        en_marketplace: isMarketplace,
      },
    });
  }

  async findAll(userId: string, loteId?: string) {
    const where: any = {
      userId,
    };
    if (loteId !== undefined) {
      if (loteId === 'null') {
        where.loteId = null;
      } else {
        where.loteId = loteId;
      }
    }
    return this.prisma.animal.findMany({
      where,
      include: {
        lot: true,
        user: true,
      },
    });
  }

  async findOne(id: string) {
    const animal = await this.prisma.animal.findUnique({
      where: { id },
      include: {
        lot: true,
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
            departamento: true,
            municipio: true,
            rol: true,
            finca_nombre: true,
            verificado: true,
            reputacion_promedio: true,
          }
        }
      },
    });

    if (!animal) {
      throw new NotFoundException(`Animal with ID ${id} not found`);
    }

    return animal;
  }

  async update(id: string, updateAnimalDto: UpdateAnimalDto) {
    // Check if animal exists
    await this.findOne(id);

    const { fecha_limite_retiro, precio, peso, ...data } = updateAnimalDto;
    const updateData: any = { ...data };

    if (precio !== undefined) {
      updateData.precio = Number(precio);
    }

    if (peso !== undefined) {
      updateData.peso = Number(peso);
    }

    if (fecha_limite_retiro !== undefined) {
      updateData.fecha_limite_retiro = fecha_limite_retiro ? new Date(fecha_limite_retiro) : null;
    }

    // Business Logic: If animal is assigned to a lot, set estado to EN_LOTE
    if (updateAnimalDto.loteId !== undefined) {
      if (updateAnimalDto.loteId) {
        updateData.estado = AnimalEstado.EN_LOTE;
      } else {
        // If removed from lot and not sold, mark as AVAILABLE
        updateData.estado = AnimalEstado.DISPONIBLE;
      }
    }

    return this.prisma.animal.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.animal.delete({
      where: { id },
    });
  }

  async updateMarketplaceStatus(id: string, en_marketplace: boolean, precio?: number) {
    await this.findOne(id);
    const updateData: any = { en_marketplace };
    if (precio !== undefined) {
      updateData.precio = precio;
    }
    return this.prisma.animal.update({
      where: { id },
      data: updateData,
    });
  }
}
