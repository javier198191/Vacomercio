"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const shared_1 = require("@vacomercio/shared");
const client_1 = require("@prisma/client");
let MarketplaceService = class MarketplaceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getFeed(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        let departmentsFilter = [];
        if (query.departamento) {
            if (shared_1.REGIONS_MAPPING[query.departamento]) {
                departmentsFilter = shared_1.REGIONS_MAPPING[query.departamento];
            }
            else {
                departmentsFilter = [query.departamento];
            }
        }
        else if (query.region && shared_1.REGIONS_MAPPING[query.region]) {
            departmentsFilter = shared_1.REGIONS_MAPPING[query.region];
        }
        let priceFilter = undefined;
        if (query.priceCategory) {
            if (query.priceCategory === 'LEVANTE') {
                priceFilter = { gte: 800000, lte: 1500000 };
            }
            else if (query.priceCategory === 'COMERCIAL') {
                priceFilter = { gte: 1500000, lte: 3500000 };
            }
            else if (query.priceCategory === 'ELITE') {
                priceFilter = { gte: 5000000 };
            }
        }
        const items = [];
        const typeFilter = query.tipo;
        if (!typeFilter || typeFilter === 'individual') {
            const animalWhere = {
                estado: client_1.AnimalEstado.DISPONIBLE,
                loteId: null,
            };
            if (departmentsFilter.length > 0 || query.municipio) {
                animalWhere.user = {
                    ...(departmentsFilter.length > 0 ? { departamento: { in: departmentsFilter } } : {}),
                    ...(query.municipio ? { municipio: { equals: query.municipio, mode: 'insensitive' } } : {}),
                };
            }
            if (priceFilter) {
                animalWhere.precio = priceFilter;
            }
            if (query.raza) {
                const breedUpper = query.raza.toUpperCase();
                if (Object.values(client_1.AnimalRaza).includes(breedUpper)) {
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
                    departamento: a.user.departamento,
                    municipio: a.user.municipio,
                    createdAt: a.createdAt,
                    user: {
                        nombre: a.user.nombre,
                        verificado: a.user.verificado,
                        reputacion_promedio: a.user.reputacion_promedio,
                    },
                });
            });
        }
        if ((!typeFilter || typeFilter === 'lote') && !query.raza) {
            const lotWhere = {
                estado: client_1.LotEstado.DISPONIBLE,
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
            lots.forEach(l => {
                items.push({
                    id: l.id,
                    nombre: l.nombre,
                    tipo: 'lote',
                    areteOrLoteNumber: `Lote: ${l.id.substring(0, 5).toUpperCase()}`,
                    razaOrQuantity: `${l.cantidad} Cabezas`,
                    peso: l.peso_promedio,
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
};
exports.MarketplaceService = MarketplaceService;
exports.MarketplaceService = MarketplaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketplaceService);
//# sourceMappingURL=marketplace.service.js.map