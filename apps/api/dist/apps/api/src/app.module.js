"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const animals_module_1 = require("./animals/animals.module");
const lots_module_1 = require("./lots/lots.module");
const marketplace_module_1 = require("./marketplace/marketplace.module");
const sales_module_1 = require("./sales/sales.module");
const reputation_module_1 = require("./reputation/reputation.module");
const notifications_module_1 = require("./notifications/notifications.module");
const interests_module_1 = require("./interests/interests.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            animals_module_1.AnimalsModule,
            lots_module_1.LotsModule,
            marketplace_module_1.MarketplaceModule,
            sales_module_1.SalesModule,
            reputation_module_1.ReputationModule,
            notifications_module_1.NotificationsModule,
            interests_module_1.InterestsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map