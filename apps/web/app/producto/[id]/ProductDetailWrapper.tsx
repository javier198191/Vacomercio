'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { PhotoGallery } from '@/components/producto/PhotoGallery';
import { SellerReputation } from '@/components/producto/SellerReputation';
import { WhatsAppButton } from '@/components/producto/WhatsAppButton';
import { LogisticsInfo } from '@/components/producto/LogisticsInfo';

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

interface ProductDetailWrapperProps {
  product: ProductDetailData;
}

export function ProductDetailWrapper({ product }: ProductDetailWrapperProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  // If auth is loading, we show a basic skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center py-20">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4" />
        <p className="text-on-surface-variant font-body-md">Verificando sesión...</p>
      </div>
    );
  }

  // If user is not authenticated (null), show the Lock CTA screen
  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 max-w-md mx-auto text-center py-16">
        <div className="w-20 h-20 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-6 shadow-sm">
          <span className="material-symbols-outlined text-[40px]">lock</span>
        </div>
        <h2 className="font-headline-md text-on-surface mb-md">Contenido Protegido</h2>
        <p className="font-body-md text-on-surface-variant mb-lg">
          Para ver los detalles completos de este animal y contactar al vendedor, debes iniciar sesión.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="w-full py-3 bg-primary hover:bg-primary-container text-on-primary font-label-bold text-label-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">login</span>
          Iniciar Sesión o Registrarse
        </button>
      </div>
    );
  }

  // Otherwise, render full details
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
