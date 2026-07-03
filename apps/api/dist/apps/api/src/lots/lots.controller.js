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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const lots_service_1 = require("./lots.service");
const create_lot_dto_1 = require("./dto/create-lot.dto");
const update_lot_dto_1 = require("./dto/update-lot.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let LotsController = class LotsController {
    constructor(lotsService) {
        this.lotsService = lotsService;
    }
    create(createLotDto, files, user) {
        createLotDto.userId = user.id;
        return this.lotsService.create(createLotDto, files || []);
    }
    createDynamic(createLotDto, user) {
        createLotDto.userId = user.id;
        return this.lotsService.createDynamic(createLotDto);
    }
    findAll(user) {
        return this.lotsService.findAll(user.id);
    }
    findOne(id) {
        return this.lotsService.findOne(id);
    }
    assignAnimals(id, animalIds) {
        return this.lotsService.assignAnimals(id, animalIds);
    }
    updateMarketplaceStatus(id, en_marketplace, precio) {
        return this.lotsService.updateMarketplaceStatus(id, en_marketplace, precio);
    }
    update(id, updateLotDto) {
        return this.lotsService.update(id, updateLotDto);
    }
    remove(id) {
        return this.lotsService.remove(id);
    }
};
exports.LotsController = LotsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lot_dto_1.CreateLotDto, Array, Object]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create-dynamic'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lot_dto_1.CreateLotDto, Object]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "createDynamic", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/assign-animals'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('animalIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "assignAnimals", null);
__decorate([
    (0, common_1.Patch)(':id/marketplace'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('en_marketplace')),
    __param(2, (0, common_1.Body)('precio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Number]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "updateMarketplaceStatus", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_lot_dto_1.UpdateLotDto]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "remove", null);
exports.LotsController = LotsController = __decorate([
    (0, common_1.Controller)('lots'),
    __metadata("design:paramtypes", [lots_service_1.LotsService])
], LotsController);
//# sourceMappingURL=lots.controller.js.map