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
let LotsController = class LotsController {
    constructor(lotsService) {
        this.lotsService = lotsService;
    }
    create(createLotDto, files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('Debe subir al menos una foto obligatoriamente para poder publicar.');
        }
        return this.lotsService.create(createLotDto, files);
    }
    createDynamic(createLotDto) {
        return this.lotsService.createDynamic(createLotDto);
    }
    findAll() {
        return this.lotsService.findAll();
    }
    findOne(id) {
        return this.lotsService.findOne(id);
    }
};
exports.LotsController = LotsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lot_dto_1.CreateLotDto, Array]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('create-dynamic'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lot_dto_1.CreateLotDto]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "createDynamic", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LotsController.prototype, "findOne", null);
exports.LotsController = LotsController = __decorate([
    (0, common_1.Controller)('lots'),
    __metadata("design:paramtypes", [lots_service_1.LotsService])
], LotsController);
//# sourceMappingURL=lots.controller.js.map