import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { REGIONS_MAPPING } from '@vacomercio/shared';
import { AnimalEstado, LotEstado, Prisma, AnimalRaza } from '@prisma/client';

export interface FeedQueryDto {
  departamento?: string;
  municipio?: string;
  raza?: string;
  region?: string;
  priceCategory?: 'LEVANTE' | 'COMERCIAL' | 'ELITE';
  tipo?: 'individual' | 'lote';
  page?: number;
  limit?: number;
}

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async getFeed(query: FeedQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    // 1. Resolve Location (region / department) filter
    let departmentsFilter: string[] = [];
    if (query.departamento) {
      if (REGIONS_MAPPING[query.departamento]) {
        departmentsFilter = REGIONS_MAPPING[query.departamento];
      } else {
        departmentsFilter = [query.departamento];
      }
    } else if (query.region && REGIONS_MAPPING[query.region]) {
      departmentsFilter = REGIONS_MAPPING[query.region];
    }

    // 2. Resolve Price range filters
    let priceFilter: Prisma.DecimalFilter | undefined = undefined;
    if (query.priceCategory) {
      if (query.priceCategory === 'LEVANTE') {
        priceFilter = { gte: 800000, lte: 1500000 };
      } else if (query.priceCategory === 'COMERCIAL') {
        priceFilter = { gte: 1500000, lte: 3500000 };
      } else if (query.priceCategory === 'ELITE') {
        priceFilter = { gte: 5000000 };
      }
    }

    const items: any[] = [];
    const typeFilter = query.tipo;

    // 3. Query Individual Animals if 'individual' or not specified
    if (!typeFilter || typeFilter === 'individual') {
      const animalWhere: Prisma.AnimalWhereInput = {
        estado: AnimalEstado.DISPONIBLE,
        loteId: null, // Only individual ones
      };

      if (departmentsFilter.length > 0) {
        animalWhere.departamento = { in: departmentsFilter };
      }
      if (query.municipio) {
        animalWhere.municipio = { equals: query.municipio, mode: 'insensitive' };
      }
      if (priceFilter) {
        animalWhere.precio = priceFilter;
      }
      if (query.raza) {
        const breedUpper = query.raza.toUpperCase() as AnimalRaza;
        if (Object.values(AnimalRaza).includes(breedUpper)) {
          animalWhere.raza = breedUpper;
        }
      }

      const animals = await this.prisma.animal.findMany({
        where: animalWhere,
        include: {
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      // Map to common feed format
      animals.forEach(a => {
        items.push({
          id: a.id,
          nombre: a.nombre,
          tipo: 'individual',
          areteOrLoteNumber: `Arete: ${a.arete}`,
          razaOrQuantity: a.raza,
          peso: a.peso,
          precio: Number(a.precio),
          foto_url: a.foto_url,
          departamento: a.departamento,
          municipio: a.municipio,
          createdAt: a.createdAt,
          user: {
            nombre: a.user.nombre,
            verificado: a.user.verificado,
            reputacion_promedio: a.user.reputacion_promedio,
          },
        });
      });
    }

    // 4. Query Lots if 'lote' or not specified (and no raza filter is active, since lots don't have a single breed)
    if ((!typeFilter || typeFilter === 'lote') && !query.raza) {
      const lotWhere: Prisma.LotWhereInput = {
        estado: LotEstado.DISPONIBLE,
      };

      if (departmentsFilter.length > 0) {
        lotWhere.departamento = { in: departmentsFilter };
      }
      if (query.municipio) {
        lotWhere.municipio = { equals: query.municipio, mode: 'insensitive' };
      }
      if (priceFilter) {
        lotWhere.precio = priceFilter;
      }

      const lots = await this.prisma.lot.findMany({
        where: lotWhere,
        include: {
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      // Map to common feed format
      lots.forEach(l => {
        items.push({
          id: l.id,
          nombre: l.nombre,
          tipo: 'lote',
          areteOrLoteNumber: `Lote: ${l.id.substring(0, 5).toUpperCase()}`,
          razaOrQuantity: `${l.cantidad} Cabezas`,
          peso: l.peso_promedio, // Show average weight for lot
          precio: Number(l.precio),
          foto_url: l.foto_url,
          departamento: l.departamento,
          municipio: l.municipio,
          createdAt: l.createdAt,
          user: {
            nombre: l.user.nombre,
            verificado: l.user.verificado,
            reputacion_promedio: l.user.reputacion_promedio,
          },
        });
      });
    }

    // 5. Sort combined feed by date and apply pagination
    items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = items.length;
    const paginatedItems = items.slice(skip, skip + limit);

    return {
      items: paginatedItems,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
