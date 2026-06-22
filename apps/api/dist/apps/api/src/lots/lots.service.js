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
let LotsService = class LotsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createDynamic(createLotDto) {
        const { animalIds, nombre, precio, departamento, municipio, userId, foto_url } = createLotDto;
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
            throw new common_1.BadRequestException({
                statusCode: 400,
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
    async findAll() {
        return this.prisma.lot.findMany({
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
        return lot;
    }
};
exports.LotsService = LotsService;
exports.LotsService = LotsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LotsService);
//# sourceMappingURL=lots.service.js.map