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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async notifySellerOfInterest(interestId) {
        const interest = await this.prisma.interest.findUnique({
            where: { id: interestId },
            include: {
                comprador: true,
                animal: {
                    include: { user: true },
                },
                lot: {
                    include: { user: true },
                },
            },
        });
        if (!interest) {
            this.logger.error(`Interest record with ID ${interestId} not found`);
            return '';
        }
        const buyerName = interest.comprador.nombre;
        let cattleName = '';
        let sellerPhone = '';
        let sellerMunicipality = '';
        if (interest.animal) {
            cattleName = `${interest.animal.nombre} (${interest.animal.raza}, Arete: ${interest.animal.arete})`;
            sellerPhone = interest.animal.user.telefono;
            sellerMunicipality = interest.animal.user.municipio;
        }
        else if (interest.lot) {
            cattleName = `Lote: ${interest.lot.nombre} (${interest.lot.cantidad} Cabezas)`;
            sellerPhone = interest.lot.user.telefono;
            sellerMunicipality = interest.lot.municipio;
        }
        else {
            this.logger.warn(`Interest record ${interestId} has neither animal nor lot linked.`);
            return '';
        }
        const messageTemplate = `Hola, soy ${buyerName}. Estoy interesado en tu publicación de ganado: "${cattleName}" ubicada en ${sellerMunicipality}. Vi tu publicación en la plataforma Vacomercio.`;
        const encodedMessage = encodeURIComponent(messageTemplate);
        const waLink = `https://wa.me/${sellerPhone.replace(/\D/g, '')}?text=${encodedMessage}`;
        this.logger.log(`[SIMULATED WHATSAPP NOTIFICATION]`);
        this.logger.log(`To: ${sellerPhone}`);
        this.logger.log(`Message: ${messageTemplate}`);
        this.logger.log(`Direct Link: ${waLink}`);
        return waLink;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map