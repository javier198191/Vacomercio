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
exports.InterestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let InterestsService = class InterestsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(dto) {
        const { compradorId, animalId, loteId } = dto;
        if (!animalId && !loteId) {
            throw new common_1.BadRequestException('Debe vincular el interés a un animal o a un lote.');
        }
        const interest = await this.prisma.interest.create({
            data: {
                compradorId,
                animalId: animalId || null,
                loteId: loteId || null,
            },
        });
        const waLink = await this.notificationsService.notifySellerOfInterest(interest.id);
        return {
            message: 'Interés registrado con éxito.',
            interest,
            whatsappLink: waLink,
        };
    }
    async findAll() {
        return this.prisma.interest.findMany({
            include: {
                comprador: true,
                animal: true,
                lot: true,
            },
        });
    }
};
exports.InterestsService = InterestsService;
exports.InterestsService = InterestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], InterestsService);
//# sourceMappingURL=interests.service.js.map