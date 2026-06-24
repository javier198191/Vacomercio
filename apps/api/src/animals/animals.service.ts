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

  async create(createAnimalDto: CreateAnimalDto, file?: Express.Multer.File) {
    const parsedPeso = Number(createAnimalDto.peso);
    const parsedPrecio = Number(createAnimalDto.precio);

    const { fecha_limite_retiro, precio, peso, ...data } = createAnimalDto;
    
    // Check if an animal with the same arete already exists
    const existing = await this.prisma.animal.findFirst({
      where: { arete: data.arete },
    });
    if (existing) {
      throw new ConflictException('El número de arete ya se encuentra registrado');
    }

    let foto_url = createAnimalDto.foto_url;

    if (file) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new BadRequestException('Supabase credentials are not configured. Please set SUPABASE_URL and SUPABASE_KEY.');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

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

      foto_url = urlData.publicUrl;
    }

    // Automatically transition to EN_LOTE if loteId is provided during creation
    const estado = data.loteId ? AnimalEstado.EN_LOTE : AnimalEstado.DISPONIBLE;

    return this.prisma.animal.create({
      data: {
        ...data,
        peso: parsedPeso,
        precio: parsedPrecio,
        estado,
        foto_url,
        fecha_limite_retiro: fecha_limite_retiro ? new Date(fecha_limite_retiro) : null,
      },
    });
  }

  async findAll() {
    return this.prisma.animal.findMany({
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
        user: true,
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

    const { fecha_limite_retiro, precio, ...data } = updateAnimalDto;
    const updateData: any = { ...data };

    if (precio !== undefined) {
      updateData.precio = precio;
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
}
