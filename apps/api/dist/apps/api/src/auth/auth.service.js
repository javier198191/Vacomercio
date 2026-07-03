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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, ...rest } = registerDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already in use');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userData = {
            id: crypto.randomUUID(),
            email,
            password: hashedPassword,
            nombre: rest.nombre,
            departamento: rest.departamento,
            municipio: rest.municipio,
            telefono: rest.telefono,
        };
        if (rest.isEmpresa && rest.nit && rest.razon_social) {
            userData.empresa = {
                create: {
                    nit: rest.nit,
                    razon_social: rest.razon_social,
                }
            };
        }
        const user = await this.prisma.user.create({
            data: userData,
        });
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { nombre: email },
                ]
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email, rol: user.rol };
        const access_token = this.jwtService.sign(payload);
        const { password: _, ...userWithoutPassword } = user;
        return {
            access_token,
            user: userWithoutPassword,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map