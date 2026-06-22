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
exports.ReputationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReputationService = class ReputationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitRating(dto) {
        const { calificadorId, saleId, estrellas, criterio, comentario } = dto;
        const sale = await this.prisma.sale.findUnique({
            where: { id: saleId },
        });
        if (!sale) {
            throw new common_1.NotFoundException(`La venta con ID ${saleId} no existe.`);
        }
        if (!sale.via_plataforma) {
            throw new common_1.BadRequestException('Solo se pueden calificar transacciones cerradas por la plataforma.');
        }
        const isVendedor = sale.vendedorId === calificadorId;
        const isComprador = sale.compradorId === calificadorId;
        if (!isVendedor && !isComprador) {
            throw new common_1.BadRequestException('El calificador debe ser el comprador o el vendedor de esta transacción.');
        }
        const calificadoId = isVendedor ? sale.compradorId : sale.vendedorId;
        const existingRating = await this.prisma.rating.findFirst({
            where: {
                saleId,
                calificadorId,
            },
        });
        if (existingRating) {
            throw new common_1.BadRequestException('Ya has calificado esta transacción.');
        }
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
        const ratingsForSale = await this.prisma.rating.findMany({
            where: { saleId },
        });
        const hasBothRatings = ratingsForSale.length === 2;
        if (hasBothRatings) {
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
    async updateUserReputation(userId) {
        const aggregateResult = await this.prisma.rating.aggregate({
            where: { calificadoId: userId },
            _avg: {
                estrellas: true,
            },
        });
        const newAvg = aggregateResult._avg.estrellas || 0.0;
        const roundedAvg = Math.round(newAvg * 100) / 100;
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                reputacion_promedio: roundedAvg,
            },
        });
    }
    async getRatingsForUser(userId) {
        return this.prisma.rating.findMany({
            where: { calificadoId: userId },
            include: {
                calificador: true,
            },
        });
    }
};
exports.ReputationService = ReputationService;
exports.ReputationService = ReputationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReputationService);
//# sourceMappingURL=reputation.service.js.map