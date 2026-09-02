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
exports.LotsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const supabase_js_1 = require("@supabase/supabase-js");
const ws = require("ws");
const WebSocketConstructor = ws.default || ws;
if (typeof global !== 'undefined' && !global.WebSocket) {
    global.WebSocket = WebSocketConstructor;
}
let LotsService = class LotsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createLotDto, files) {
        const { nombre, cantidad, peso_promedio, peso_total, precio, departamento, municipio, userId, categoria } = createLotDto;
        if (!userId) {
            throw new common_1.BadRequestException('userId is required');
        }
        const urls = [];
        if (files && files.length > 0) {
            const supabaseUrl = process.env.SUPABASE_URL;
            const supabaseKey = process.env.SUPABASE_KEY;
            if (!supabaseUrl || !supabaseKey) {
                throw new common_1.BadRequestException('Supabase credentials are not configured. Please set SUPABASE_URL and SUPABASE_KEY.');
            }
            const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
            for (const file of files) {
                const uniqueName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '')}`;
                const { data: uploadData, error } = await supabase.storage
                    .from('animales')
                    .upload(uniqueName, file.buffer, {
                    contentType: file.mimetype,
                });
                if (error) {
                    throw new common_1.BadRequestException(`Error al subir la imagen a Supabase: ${error.message}`);
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
                estado: client_1.LotEstado.DISPONIBLE,
                foto_url,
                categoria,
                departamento,
                municipio,
                userId,
            },
        });
    }
    async createDynamic(createLotDto) {
        const { animalIds, nombre, precio, departamento, municipio, userId, foto_url, categoria } = createLotDto;
        if (!userId) {
            throw new common_1.BadRequestException('userId is required');
        }
        if (!animalIds || animalIds.length === 0) {
            throw new common_1.BadRequestException('Debe seleccionar al menos un animal para armar el lote.');
        }
        const animals = await this.prisma.animal.findMany({
            where: {
                id: { in: animalIds },
                userId,
            },
        });
        if (animals.length !== animalIds.length) {
            throw new common_1.NotFoundException('Algunos animales seleccionados no existen o no pertenecen a este usuario.');
        }
        const unavailableAnimals = animals.filter(a => a.estado !== client_1.AnimalEstado.DISPONIBLE);
        if (unavailableAnimals.length > 0) {
            const names = unavailableAnimals.map(a => `${a.nombre} (#${a.arete})`).join(', ');
            throw new common_1.BadRequestException(`Los siguientes animales no están disponibles para loteo: ${names}`);
        }
        const now = new Date();
        const animalsWithWithdrawal = animals.filter(animal => {
            if (animal.en_periodo_retiro)
                return true;
            if (animal.fecha_limite_retiro && new Date(animal.fecha_limite_retiro) > now)
                return true;
            return false;
        });
        if (animalsWithWithdrawal.length > 0) {
            const details = animalsWithWithdrawal.map(a => {
                const dateStr = a.fecha_limite_retiro ? new Date(a.fecha_limite_retiro).toLocaleDateString() : 'fecha no especificada';
                return `Animal ${a.nombre} (#${a.arete}) con medicamento ${a.medicamento_retiro || 'desconocido'} (límite: ${dateStr})`;
            }).join(', ');
            throw new common_1.ForbiddenException({
                statusCode: 403,
                error: 'SanityCheckFailed',
                message: `Advertencia de inocuidad: La creación de este lote ha sido bloqueada. Los siguientes animales tienen un periodo de carencia (retiro de medicamentos veterinarios) activo para consumo humano directo: ${details}`,
            });
        }
        const cantidad = animals.length;
        const peso_total = animals.reduce((sum, a) => sum + a.peso, 0);
        const peso_promedio = peso_total / cantidad;
        const calculatedPriceSum = animals.reduce((sum, a) => sum + Number(a.precio), 0);
        const finalPrice = precio !== undefined ? precio : calculatedPriceSum;
        return this.prisma.$transaction(async (tx) => {
            const lot = await tx.lot.create({
                data: {
                    nombre,
                    cantidad,
                    peso_total,
                    peso_promedio,
                    precio: finalPrice,
                    estado: client_1.LotEstado.DISPONIBLE,
                    foto_url,
                    categoria,
                    departamento,
                    municipio,
                    userId,
                },
            });
            await tx.animal.updateMany({
                where: {
                    id: { in: animalIds },
                },
                data: {
                    loteId: lot.id,
                    estado: client_1.AnimalEstado.EN_LOTE,
                },
            });
            return tx.lot.findUnique({
                where: { id: lot.id },
                include: { animals: true },
            });
        });
    }
    async findAll(userId) {
        const where = {
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
    async findOne(id) {
        const lot = await this.prisma.lot.findUnique({
            where: { id },
            include: {
                animals: true,
                user: true,
            },
        });
        if (!lot) {
            throw new common_1.NotFoundException(`Lote con ID ${id} no encontrado.`);
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
    async assignAnimals(id, animalIds) {
        await this.prisma.animal.updateMany({
            where: { id: { in: animalIds } },
            data: {
                loteId: id,
                estado: client_1.AnimalEstado.EN_LOTE,
            },
        });
        const animals = await this.prisma.animal.findMany({
            where: { loteId: id },
        });
        const cantidad = animals.length;
        const peso_total = animals.reduce((sum, a) => sum + a.peso, 0);
        const peso_promedio = cantidad > 0 ? peso_total / cantidad : 0;
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
    async updateMarketplaceStatus(id, en_marketplace, precio) {
        await this.findOne(id);
        const updateData = { en_marketplace };
        if (precio !== undefined) {
            updateData.precio = precio;
        }
        return this.prisma.lot.update({
            where: { id },
            data: updateData,
        });
    }
    async update(id, updateLotDto) {
        const lot = await this.findOne(id);
        const { animalIds, nombre, precio, categoria, departamento, municipio, userId } = updateLotDto;
        return this.prisma.$transaction(async (tx) => {
            if (animalIds !== undefined) {
                const currentAnimalIds = lot.animals.map(a => a.id);
                const animalIdsToRemove = currentAnimalIds.filter(aid => !animalIds.includes(aid));
                const animalIdsToAdd = animalIds.filter(aid => !currentAnimalIds.includes(aid));
                if (animalIdsToAdd.length > 0) {
                    const animalsToAdd = await tx.animal.findMany({
                        where: {
                            id: { in: animalIdsToAdd },
                            userId: userId || lot.userId,
                        },
                    });
                    if (animalsToAdd.length !== animalIdsToAdd.length) {
                        throw new common_1.NotFoundException('Algunas vacas seleccionadas para añadir no existen o no pertenecen a este usuario.');
                    }
                    const unavailableAnimals = animalsToAdd.filter(a => a.estado !== client_1.AnimalEstado.DISPONIBLE);
                    if (unavailableAnimals.length > 0) {
                        const names = unavailableAnimals.map(a => `${a.nombre} (#${a.arete})`).join(', ');
                        throw new common_1.BadRequestException(`Las siguientes vacas no están disponibles para loteo: ${names}`);
                    }
                    const now = new Date();
                    const animalsWithWithdrawal = animalsToAdd.filter(animal => {
                        if (animal.en_periodo_retiro)
                            return true;
                        if (animal.fecha_limite_retiro && new Date(animal.fecha_limite_retiro) > now)
                            return true;
                        return false;
                    });
                    if (animalsWithWithdrawal.length > 0) {
                        const details = animalsWithWithdrawal.map(a => {
                            const dateStr = a.fecha_limite_retiro ? new Date(a.fecha_limite_retiro).toLocaleDateString() : 'fecha no especificada';
                            return `Animal ${a.nombre} (#${a.arete}) con medicamento ${a.medicamento_retiro || 'desconocido'} (límite: ${dateStr})`;
                        }).join(', ');
                        throw new common_1.ForbiddenException({
                            statusCode: 403,
                            error: 'SanityCheckFailed',
                            message: `Advertencia de inocuidad: No se puede añadir estas vacas. Tienen periodo de carencia activo: ${details}`,
                        });
                    }
                }
                if (animalIdsToRemove.length > 0) {
                    await tx.animal.updateMany({
                        where: { id: { in: animalIdsToRemove } },
                        data: {
                            loteId: null,
                            estado: client_1.AnimalEstado.DISPONIBLE,
                        },
                    });
                }
                if (animalIdsToAdd.length > 0) {
                    await tx.animal.updateMany({
                        where: { id: { in: animalIdsToAdd } },
                        data: {
                            loteId: id,
                            estado: client_1.AnimalEstado.EN_LOTE,
                        },
                    });
                }
            }
            const finalAnimals = await tx.animal.findMany({
                where: { loteId: id },
            });
            const cantidad = finalAnimals.length;
            const peso_total = finalAnimals.reduce((sum, a) => sum + a.peso, 0);
            const peso_promedio = cantidad > 0 ? peso_total / cantidad : 0;
            let finalPrice = Number(lot.precio);
            if (precio !== undefined) {
                finalPrice = Number(precio);
            }
            else if (animalIds !== undefined) {
                finalPrice = finalAnimals.reduce((sum, a) => sum + Number(a.precio), 0);
            }
            const updateData = {};
            if (nombre !== undefined)
                updateData.nombre = nombre;
            if (categoria !== undefined)
                updateData.categoria = categoria;
            if (departamento !== undefined)
                updateData.departamento = departamento;
            if (municipio !== undefined)
                updateData.municipio = municipio;
            updateData.precio = finalPrice;
            updateData.cantidad = cantidad;
            updateData.peso_total = peso_total;
            updateData.peso_promedio = peso_promedio;
            return tx.lot.update({
                where: { id },
                data: updateData,
                include: { animals: true },
            });
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.$transaction(async (tx) => {
            await tx.animal.updateMany({
                where: { loteId: id },
                data: {
                    loteId: null,
                    estado: client_1.AnimalEstado.DISPONIBLE,
                },
            });
            return tx.lot.delete({
                where: { id },
            });
        });
    }
};
exports.LotsService = LotsService;
exports.LotsService = LotsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LotsService);
//# sourceMappingURL=lots.service.js.map