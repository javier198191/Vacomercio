import React from 'react';
import Link from 'next/link';
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

// ── Mock resolver (replace with prisma fetch via route handler) ───────────────
function getMockProduct(id: string): ProductDetailData {
  return {
    id,
    nombre: '45 Novillos Brahman',
    estado: 'DISPONIBLE',
    tipo: 'lote',
    fotos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAajRiLftqtbyj2dkrU42rUcc3MDSN1GXm1uF4V0E4nT3MQ8XmzIfVSi2n2ZYI_vw64x2fukoF45zVX9iYy7OGTgmluUYIvKjfU3TU3bqDwR1TnAS8LUz8agfvGUkGb_Lk-4AqJgsRprsiDNR7A8fWmyKevOuA3onEnNuKTroq4hvusD8tphoXyqES_inp_b_qT_BUk9I9i2xXXlgcHcJpZQthhmACyGVZtHaQ-ubf6gKLEYZdUS83qCSG3cjDFLI18HCA9ngZ0cHw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtkXF5o42RRO-dDBjHYj7TBumI7ZOoN6kqpufPxqQaIKjNFT-hoZtTyxMbaNXpbxQIoI3zOoRartgtcqE3W-jiP-LXVt14JgBw6Pnm12h4YAOsOAMw1YT4Z1eZy8UkurRh8h1mEdWidif-cdUP5lcsrAYHUuMWccpNa3oEmfGZZHoM5zQ7AqKNThXADMFdmMUfWYJeKTZtRTxIXhqMRsTmLeFy370nZJlWaT9mkzvMUQ8cBNF6AXThE45PNQfZmaoB4g5HSxK2q9o',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCzpTPmLX_B43shF7VBYi0nsWLRrdWZE1qOLcoEc_P4QYI2gzcUadY2kQZOGGa3klnJqFn9hqQ1PiS6GZw7QSpTKgkhXAP0985j1FlGFOOBj5AX5SE2CfOYTrrrFHVn3QwU_J-y-joZvhA3oGedOjF8WOMsWbkABwYKIf6wk1LJkUqbaIqjekEmF3CeL6L4vm9vjiZGsG5ju9T-iAQkWBYikE9c9xeKSoNJwIvrm8vzM4Kt7O-vpDiCCNn9XiBuAbYWNw',
    ],
    descripcion:
      'Excelente lote de 45 novillos Brahman comerciales, con un peso promedio muy parejo. Animales sanos, con plan sanitario al día, ideales para ceba rápida. Han estado en pasturas de braquiaria con suplementación mineral constante.\n\nSe garantiza la trazabilidad y procedencia de la Hacienda El Porvenir. Listos para despacho inmediato tras confirmación de pago.',
    precio: 8500,
    precioLabel: 'COP/Kg',
    metrics: [
      { icon: 'scale', label: 'Peso Promedio', value: '320 Kg' },
      { icon: 'group', label: 'Cantidad', value: '45 Cabezas' },
      { icon: 'male', label: 'Sexo', value: 'Machos' },
      { icon: 'monitor_weight', label: 'Peso Total Aprox.', value: '14.400 Kg' },
    ],
    departamento: 'Atlántico',
    municipio: 'Sabanalarga',
    vendedor: {
      nombre: 'Carlos Hernández',
      finca: 'Hacienda El Porvenir',
      telefono: '+573001234567',
      verificado: true,
      reputacion_promedio: 4.8,
      total_ventas: 124,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProductoDetailPage({ params }: { params: { id: string } }) {
  const product = getMockProduct(params.id);

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
