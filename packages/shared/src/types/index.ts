export type UserTipo = 'GANADERO' | 'COMPRADOR';
export type AnimalEstado = 'DISPONIBLE' | 'EN_LOTE' | 'VENDIDO';
export type LotEstado = 'DISPONIBLE' | 'VENDIDO';

export interface User {
  id: string;
  nombre: string;
  tipo: UserTipo;
  finca_nombre?: string | null;
  departamento: string;
  municipio: string;
  telefono: string;
  verificado: boolean;
  reputacion_promedio: number;
  createdAt: Date;
}

export interface Animal {
  id: string;
  nombre: string;
  arete: string;
  raza: string;
  peso: number;
  precio: number; // Will be mapped from Decimal representation as number/string
  estado: AnimalEstado;
  foto_url?: string | null;
  userId: string;
  loteId?: string | null;
  createdAt: Date;
  
  // Medical withdrawal info
  en_periodo_retiro: boolean;
  medicamento_retiro?: string | null;
  fecha_limite_retiro?: Date | null;
}

export interface Lot {
  id: string;
  nombre: string;
  cantidad: number;
  peso_total: number;
  peso_promedio: number;
  precio: number; // Will be mapped from Decimal
  estado: LotEstado;
  foto_url?: string | null;
  departamento: string;
  municipio: string;
  userId: string;
  createdAt: Date;
  animals?: Animal[];
}

export interface Interest {
  id: string;
  compradorId: string;
  animalId?: string | null;
  loteId?: string | null;
  timestamp: Date;
}

export interface Sale {
  id: string;
  animalId?: string | null;
  loteId?: string | null;
  vendedorId: string;
  compradorId: string;
  precio_final: number; // Mapped from Decimal
  via_plataforma: boolean;
  createdAt: Date;
}

export interface Rating {
  id: string;
  calificadorId: string;
  calificadoId: string;
  saleId: string;
  estrellas: number;
  criterio: string;
  comentario?: string | null;
  createdAt: Date;
}
