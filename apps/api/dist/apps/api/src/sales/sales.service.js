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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SalesService = class SalesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async markAsSold(dto) {
        const { animalId, loteId, vendedorId, compradorId, compradorTelefono, precio_final } = dto;
        if (!animalId && !loteId) {
            throw new common_1.BadRequestException('Debe especificar un animalId o un loteId para registrar la venta.');
        }
        let finalCompradorId = compradorId;
        if (!finalCompradorId) {
            if (!compradorTelefono) {
                throw new common_1.BadRequestException('Debe proporcionar el ID del comprador o su número telefónico.');
            }
            const buyer = await this.prisma.user.findFirst({
                where: { telefono: compradorTelefono },
            });
            if (!buyer) {
                throw new common_1.NotFoundException(`No se encontró un comprador registrado con el teléfono: ${compradorTelefono}`);
            }
            finalCompradorId = buyer.id;
        }
        else {
            const buyer = await this.prisma.user.findUnique({
                where: { id: finalCompradorId },
            });
            if (!buyer) {
                throw new common_1.NotFoundException(`El comprador con ID ${finalCompradorId} no existe.`);
            }
        }
        if (vendedorId === finalCompradorId) {
            throw new common_1.BadRequestException('El vendedor y el comprador no pueden ser el mismo usuario.');
        }
        return this.prisma.$transaction(async (tx) => {
            if (animalId) {
                const animal = await tx.animal.findUnique({
                    where: { id: animalId },
                });
                if (!animal) {
                    throw new common_1.NotFoundException(`El animal con ID ${animalId} no existe.`);
                }
                if (animal.userId !== vendedorId) {
                    throw new common_1.BadRequestException('Este animal no le pertenece al vendedor especificado.');
                }
                if (animal.estado === client_1.AnimalEstado.VENDIDO) {
                    throw new common_1.BadRequestException('Este animal ya ha sido vendido.');
                }
                await tx.animal.update({
                    where: { id: animalId },
                    data: { estado: client_1.AnimalEstado.VENDIDO },
                });
            }
            else if (loteId) {
                const lot = await tx.lot.findUnique({
                    where: { id: loteId },
                    include: { animals: true },
                });
                if (!lot) {
                    throw new common_1.NotFoundException(`El lote con ID ${loteId} no existe.`);
                }
                if (lot.userId !== vendedorId) {
                    throw new common_1.BadRequestException('Este lote no le pertenece al vendedor especificado.');
                }
                if (lot.estado === client_1.LotEstado.VENDIDO) {
                    throw new common_1.BadRequestException('Este lote ya ha sido vendido.');
                }
                await tx.lot.update({
                    where: { id: loteId },
                    data: { estado: client_1.LotEstado.VENDIDO },
                });
                await tx.animal.updateMany({
                    where: { loteId },
                    data: { estado: client_1.AnimalEstado.VENDIDO },
                });
            }
            return tx.sale.create({
                data: {
                    animalId: animalId || null,
                    loteId: loteId || null,
                    vendedorId,
                    compradorId: finalCompradorId,
                    precio_final,
                    via_plataforma: true,
                },
                include: {
                    animal: true,
                    lot: true,
                    vendedor: true,
                    comprador: true,
                },
            });
        });
    }
    async findAll() {
        return this.prisma.sale.findMany({
            include: {
                animal: true,
                lot: true,
                vendedor: true,
                comprador: true,
            },
        });
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalesService);
//# sourceMappingURL=sales.service.js.map