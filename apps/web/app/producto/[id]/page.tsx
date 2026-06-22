import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PhotoGallery } from '@/components/producto/PhotoGallery';
import { SellerReputation } from '@/components/producto/SellerReputation';
import { WhatsAppButton } from '@/components/producto/WhatsAppButton';
import { LogisticsInfo } from '@/components/producto/LogisticsInfo';

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const capitalize = (str: string) => {
  if (!str) return '';
  // Support accent on Cebú
  if (str.toUpperCase() === 'CEBU') return 'Cebú';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

function mapToProductDetail(raw: any, tipo: 'individual' | 'lote'): ProductDetailData {
  const isLote = tipo === 'lote';
  const fotos = raw.foto_url ? [raw.foto_url] : [];
  
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
  };
}

async function getProduct(id: string): Promise<ProductDetailData | null> {
  try {
    const animalRes = await fetch(`${API_BASE_URL}/marketplace/animal/${id}`, {
      cache: 'no-store'
    });
    if (animalRes.status === 200) {
      const animal = await animalRes.json();
      return mapToProductDetail(animal, 'individual');
    }
    if (animalRes.status !== 404) {
      console.error(`Error fetching animal: status ${animalRes.status}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching animal:', error);
    return null;
  }

  try {
    const lotRes = await fetch(`${API_BASE_URL}/marketplace/lot/${id}`, {
      cache: 'no-store'
    });
    if (lotRes.status === 200) {
      const lot = await lotRes.json();
      return mapToProductDetail(lot, 'lote');
    }
    if (lotRes.status !== 404) {
      console.error(`Error fetching lot: status ${lotRes.status}`);
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

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <>
      {/* Detail Header */}
      <header className="bg-surface-container-lowest sticky top-0 z-40 border-b border-outline-variant shadow-sm w-full h-[72px] flex items-center px-margin-mobile md:px-md">
        <div className="max-w-container-max mx-auto w-full flex justify-between items-center">
          <Link
            href="/marketplace"
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-label-bold text-label-bold hidden md:inline">Volver</span>
          </Link>

          <div className="text-headline-md font-headline-md font-bold text-primary truncate max-w-[200px] md:max-w-none">
            {product.nombre}
          </div>

          <div className="flex gap-sm">
            <button aria-label="Compartir" className="text-on-surface-variant hover:text-primary transition-colors p-2">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button aria-label="Guardar" className="text-on-surface-variant hover:text-primary transition-colors p-2">
              <span className="material-symbols-outlined">favorite_border</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main 12-col grid */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-md py-md md:py-lg grid grid-cols-1 lg:grid-cols-12 gap-gutter pb-32">

        {/* Left Column — Gallery, Description, Logistics */}
        <div className="lg:col-span-7 flex flex-col gap-gutter">
          <PhotoGallery photos={product.fotos} altText={product.nombre} />

          {/* Description */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
            <h2 className="font-headline-md text-headline-md font-semibold text-on-surface mb-sm">
              Descripción del Lote
            </h2>
            <div className="font-body-md text-body-md text-on-surface-variant space-y-4">
              {product.descripcion.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          <LogisticsInfo
            municipio={product.municipio}
            departamento={product.departamento}
          />
        </div>

        {/* Right Column — Price Card, Seller */}
        <div className="lg:col-span-5 flex flex-col gap-gutter">
          {/* Price & Metrics Card */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md shadow-sm">
            <div className="flex justify-between items-start mb-md">
              <div>
                <span className="inline-block bg-tertiary-fixed text-on-tertiary-fixed-variant px-sm py-xs rounded-full font-label-sm text-label-sm uppercase tracking-wide mb-sm">
                  {product.estado === 'DISPONIBLE' ? 'Disponible' : 'Vendido'}
                </span>
                <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  {product.nombre}
                </h1>
              </div>
            </div>

            <div className="mb-lg">
              <p className="font-label-bold text-label-bold text-on-surface-variant mb-xs">
                Precio por Kg (Estimado)
              </p>
              <p className="font-headline-xl text-headline-xl font-bold text-primary">
                ${formatPrice(product.precio)}{' '}
                <span className="font-body-md text-body-md font-normal text-on-surface-variant">
                  {product.precioLabel}
                </span>
              </p>
            </div>

            {/* Bento Metrics Grid */}
            <div className="grid grid-cols-2 gap-sm mb-md">
              {product.metrics.map((m, i) => (
                <div key={i} className="bg-surface-container rounded-lg p-sm border border-outline-variant/50">
                  <div className="flex items-center gap-xs mb-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">{m.icon}</span>
                    <span className="font-label-sm text-label-sm">{m.label}</span>
                  </div>
                  <p className="font-headline-md text-headline-md font-semibold text-on-surface">{m.value}</p>
                </div>
              ))}
            </div>
          </section>

          <SellerReputation
            nombre={product.vendedor.nombre}
            finca={product.vendedor.finca}
            verificado={product.vendedor.verificado}
            reputacion_promedio={product.vendedor.reputacion_promedio}
            total_ventas={product.vendedor.total_ventas}
          />
        </div>
      </main>

      {/* Floating WhatsApp CTA */}
      <WhatsAppButton
        telefono={product.vendedor.telefono}
        nombrePublicacion={product.nombre}
        municipioVendedor={product.municipio}
      />
    </>
  );
}
