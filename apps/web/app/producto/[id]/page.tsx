import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductDetailWrapper } from './ProductDetailWrapper';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Metric {
  icon: string;
  label: string;
  value: string;
}

interface ProductDetailData {
  id: string;
  nombre: string;
  estado: 'DISPONIBLE' | 'VENDIDO';
  tipo: 'individual' | 'lote';
  fotos: string[];
  descripcion: string;
  precio: number;
  precioLabel: string;
  metrics: Metric[];
  departamento: string;
  municipio: string;
  vendedor: {
    nombre: string;
    finca?: string;
    telefono: string;
    verificado: boolean;
    reputacion_promedio: number;
    total_ventas: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

const capitalize = (str: string) => {
  if (!str) return '';
  // Support accent on Cebú
  if (str.toUpperCase() === 'CEBU') return 'Cebú';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

function mapToProductDetail(raw: any, tipo: 'individual' | 'lote'): ProductDetailData {
  const isLote = tipo === 'lote';
  const fotos = raw.foto_url ? raw.foto_url.split(',') : [];
  
  const descripcion = isLote
    ? `Lote de ganado con ${raw.cantidad} animales. Ubicado en ${raw.municipio || 'N/A'}, ${raw.departamento || 'N/A'}.`
    : `Animal individual de tipo ${raw.tipo ? capitalize(raw.tipo) : 'No especificado'} y raza ${raw.raza ? capitalize(raw.raza) : 'No especificada'}. Arete: ${raw.arete || 'N/A'}.`;

  const metrics: Metric[] = isLote
    ? [
        { icon: 'scale', label: 'Peso Promedio', value: `${raw.peso_promedio} Kg` },
        { icon: 'group', label: 'Cantidad', value: `${raw.cantidad} Cabezas` },
        { icon: 'monitor_weight', label: 'Peso Total Aprox.', value: `${raw.peso_total} Kg` },
      ]
    : [
        { icon: 'scale', label: 'Peso', value: `${raw.peso} Kg` },
        { icon: 'tag', label: 'Arete', value: raw.arete || 'N/A' },
        { icon: 'pets', label: 'Raza', value: raw.raza ? capitalize(raw.raza) : 'No especificada' },
        { icon: 'info', label: 'Tipo', value: raw.tipo ? capitalize(raw.tipo) : 'No especificado' },
      ];

  const departamento = raw.departamento || raw.user?.departamento || 'N/A';
  const municipio = raw.municipio || raw.user?.municipio || 'N/A';

  return {
    id: raw.id,
    nombre: raw.nombre,
    focus: raw, // keep original object for custom components if needed
    estado: raw.estado === 'VENDIDO' ? 'VENDIDO' : 'DISPONIBLE',
    tipo,
    fotos,
    descripcion,
    precio: Number(raw.precio),
    precioLabel: isLote ? 'COP (Total)' : 'COP',
    metrics,
    departamento,
    municipio,
    vendedor: {
      nombre: raw.user?.nombre || 'Vendedor',
      finca: raw.user?.finca_nombre || undefined,
      telefono: raw.user?.telefono || '',
      verificado: raw.user?.verificado || false,
      reputacion_promedio: raw.user?.reputacion_promedio || 0,
      total_ventas: 0,
    },
  } as any;
}

async function getProduct(id: string): Promise<ProductDetailData | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  try {
    const animalRes = await fetch(`${API_BASE_URL}/animals/${id}`, {
      cache: 'no-store'
    });
    if (animalRes.status === 200) {
      const animal = await animalRes.json();
      return mapToProductDetail(animal, 'individual');
    }
  } catch (error) {
    console.error('Error fetching animal:', error);
  }

  try {
    const lotRes = await fetch(`${API_BASE_URL}/lots/${id}`, {
      cache: 'no-store'
    });
    if (lotRes.status === 200) {
      const lot = await lotRes.json();
      return mapToProductDetail(lot, 'lote');
    }
  } catch (error) {
    console.error('Error fetching lot:', error);
  }

  return null;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ProductoDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }

  return <ProductDetailWrapper product={product} />;
}
