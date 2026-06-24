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
exports.CreateAnimalDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
class CreateAnimalDto {
}
exports.CreateAnimalDto = CreateAnimalDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "arete", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.AnimalRaza),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "raza", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.AnimalTipo),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)({ message: 'El peso debe ser mayor a 0' }),
    (0, class_validator_1.Max)(1500, { message: 'El peso debe ser menor a 1500 kg' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateAnimalDto.prototype, "peso", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)({ message: 'El precio debe ser mayor a 0' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateAnimalDto.prototype, "precio", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "foto_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "loteId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], CreateAnimalDto.prototype, "en_periodo_retiro", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "medicamento_retiro", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "fecha_limite_retiro", void 0);
//# sourceMappingURL=create-animal.dto.js.map