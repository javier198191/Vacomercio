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
              
              <button 
                onClick={() => {
                  const rawPhone = product.vendedor.telefono || '';
                  const cleanPhone = rawPhone.replace(/\s+/g, '');
                  let formattedPhone = cleanPhone;
                  if (cleanPhone.length === 10 && !cleanPhone.startsWith('+')) {
                    formattedPhone = '+57' + cleanPhone;
                  }
                  
                  const message = `Hola ${product.vendedor.nombre}, vi tu anuncio de ${product.nombre} en Vacomercio por $${formatPrice(product.precio)} y estoy muy interesado. ¿Podemos hablar?`;
                  const encodedMessage = encodeURIComponent(message);
                  window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, "_blank");
                }}
                className="bg-[#25D366] text-white font-sans font-bold rounded-lg py-3 px-6 w-full hover:bg-[#20bd5a] transition-colors flex justify-center items-center gap-2 mt-4"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.0157 2.01562C6.50567 2.01562 2.03662 6.48562 2.03662 11.9966C2.03662 13.7666 2.50262 15.4266 3.32262 16.8566L2.00062 21.6856L6.92462 20.3956C8.30762 21.1356 9.89462 21.5556 11.5846 21.5556C17.0946 21.5556 21.5656 17.0856 21.5656 11.5756C21.5656 6.06562 17.0946 2.01562 12.0157 2.01562ZM11.5846 19.9256C10.0526 19.9256 8.61862 19.5056 7.37762 18.7756L7.10662 18.6156L4.20862 19.3756L4.99362 16.5156L4.81562 16.2356C3.99562 14.9356 3.52462 13.3856 3.52462 11.7556C3.52462 7.30562 7.13562 3.69562 11.5846 3.69562C16.0336 3.69562 19.6456 7.30562 19.6456 11.7556C19.6456 16.2056 16.0336 19.9256 11.5846 19.9256ZM16.0026 13.9156C15.7596 13.7956 14.5676 13.2056 14.3466 13.1256C14.1266 13.0456 13.9666 13.0056 13.8066 13.2456C13.6456 13.4856 13.1856 14.0456 13.0456 14.2056C12.9056 14.3656 12.7656 14.3856 12.5256 14.2656C12.2846 14.1456 11.4926 13.8856 10.5566 13.0456C9.82762 12.3956 9.33662 11.5856 9.19662 11.3456C9.05662 11.1056 9.18262 10.9756 9.30362 10.8556C9.41262 10.7456 9.54462 10.5756 9.66462 10.4356C9.78462 10.2956 9.82462 10.1956 9.90462 10.0356C9.98562 9.87562 9.94562 9.73562 9.88562 9.61562C9.82462 9.49562 9.33662 8.29562 9.13662 7.80562C8.94662 7.33562 8.74662 7.39562 8.60662 7.39562C8.46662 7.38562 8.30662 7.38562 8.14662 7.38562C7.98662 7.38562 7.72562 7.44562 7.50562 7.68562C7.28462 7.92562 6.64362 8.52562 6.64362 9.74562C6.64362 10.9656 7.52562 12.1456 7.64562 12.3056C7.76662 12.4656 9.39562 14.9656 11.8956 16.0456C12.4956 16.3056 12.9656 16.4556 13.3256 16.5756C13.9256 16.7656 14.4756 16.7356 14.9056 16.6656C15.3856 16.5856 16.3866 16.0456 16.5866 15.4456C16.7866 14.8456 16.7866 14.3356 16.7256 14.2256C16.6656 14.1156 16.5056 14.0556 16.2656 13.9356L16.0026 13.9156Z" fill="white"/>
                </svg>
                Contactar por WhatsApp
              </button>
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
