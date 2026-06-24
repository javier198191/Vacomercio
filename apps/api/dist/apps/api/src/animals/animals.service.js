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
exports.AnimalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const supabase_js_1 = require("@supabase/supabase-js");
const ws_1 = require("ws");
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    realtime: { transport: ws_1.default }
}) : null;
let AnimalsService = class AnimalsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createAnimalDto, file) {
        const { fecha_limite_retiro, precio, ...data } = createAnimalDto;
        const existing = await this.prisma.animal.findFirst({
            where: { arete: data.arete },
        });
        if (existing) {
            throw new common_1.ConflictException('El número de arete ya se encuentra registrado');
        }
        let foto_url = createAnimalDto.foto_url;
        if (file) {
            if (!supabase) {
                throw new common_1.BadRequestException('Supabase credentials are not configured. Please set SUPABASE_URL and SUPABASE_KEY.');
            }
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const { data: uploadData, error } = await supabase.storage
                .from('animales')
                .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });
            if (error) {
                throw new common_1.BadRequestException(`Error al subir la imagen a Supabase: ${error.message}`);
            }
            const { data: urlData } = supabase.storage
                .from('animales')
                .getPublicUrl(fileName);
            foto_url = urlData.publicUrl;
        }
        const estado = data.loteId ? client_1.AnimalEstado.EN_LOTE : client_1.AnimalEstado.DISPONIBLE;
        return this.prisma.animal.create({
            data: {
                ...data,
                precio,
                estado,
                foto_url,
                fecha_limite_retiro: fecha_limite_retiro ? new Date(fecha_limite_retiro) : null,
            },
        });
    }
    async findAll() {
        return this.prisma.animal.findMany({
            include: {
                lot: true,
                user: true,
            },
        });
    }
    async findOne(id) {
        const animal = await this.prisma.animal.findUnique({
            where: { id },
            include: {
                lot: true,
                user: true,
            },
        });
        if (!animal) {
            throw new common_1.NotFoundException(`Animal with ID ${id} not found`);
        }
        return animal;
    }
    async update(id, updateAnimalDto) {
        await this.findOne(id);
        const { fecha_limite_retiro, precio, ...data } = updateAnimalDto;
        const updateData = { ...data };
        if (precio !== undefined) {
            updateData.precio = precio;
        }
        if (fecha_limite_retiro !== undefined) {
            updateData.fecha_limite_retiro = fecha_limite_retiro ? new Date(fecha_limite_retiro) : null;
        }
        if (updateAnimalDto.loteId !== undefined) {
            if (updateAnimalDto.loteId) {
                updateData.estado = client_1.AnimalEstado.EN_LOTE;
            }
            else {
                updateData.estado = client_1.AnimalEstado.DISPONIBLE;
            }
        }
        return this.prisma.animal.update({
            where: { id },
            data: updateData,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.animal.delete({
            where: { id },
        });
    }
};
exports.AnimalsService = AnimalsService;
exports.AnimalsService = AnimalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnimalsService);
//# sourceMappingURL=animals.service.js.map