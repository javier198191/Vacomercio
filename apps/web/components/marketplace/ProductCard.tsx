'use client';

import React from 'react';
import Link from 'next/link';

export interface FeedItem {
  id: string;
  nombre: string;
  tipo: 'individual' | 'lote';
  areteOrLoteNumber: string;
  razaOrQuantity: string;
  peso: number;
  precio: number;
  foto_url?: string | null;
  departamento: string;
  municipio: string;
  createdAt: string | Date;
  user: {
    nombre: string;
    verificado: boolean;
    reputacion_promedio: number;
  };
}

interface ProductCardProps {
  item: FeedItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const isLote = item.tipo === 'lote';

  return (
    <article className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-shadow duration-200">
      
      {/* Photo Container */}
      <div className="h-48 w-full relative bg-surface-container">
        {item.foto_url ? (
          <img
            src={item.foto_url}
            alt={item.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-outline">
            <span className="material-symbols-outlined text-[48px]">image</span>
            <span className="text-body-sm font-body-sm mt-xs">Sin foto</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-sm right-sm bg-primary text-on-primary px-sm py-xs rounded text-label-sm font-label-bold">
          {isLote ? 'Lote Disponible' : 'Disponible'}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-md flex flex-col flex-grow">
        
        <h3 className="text-headline-md font-headline-md text-on-surface mb-xs truncate">
          {item.nombre}
        </h3>
        
        <p className="text-body-sm font-body-sm text-on-surface-variant mb-sm">
          {item.areteOrLoteNumber}
        </p>

        {/* Bento-style Metrics Grid */}
        <div className="grid grid-cols-2 gap-sm mb-md bg-surface p-sm rounded border border-surface-variant">
          <div>
            <span className="block text-label-sm font-label-sm text-on-surface-variant">
              {isLote ? 'Peso Prom.' : 'Peso'}
            </span>
            <span className="text-body-md font-label-bold text-on-surface">
              {item.peso} kg
            </span>
          </div>
          <div>
            <span className="block text-label-sm font-label-sm text-on-surface-variant">
              {isLote ? 'Cantidad' : 'Detalle'}
            </span>
            <span className="text-body-md font-label-bold text-on-surface truncate">
              {item.razaOrQuantity}
            </span>
          </div>
        </div>

        {/* Price and Location */}
        <div className="mt-auto">
          <p className="text-headline-md font-headline-md text-primary mb-xs font-bold">
            {formatPrice(item.precio)}
          </p>
          <p className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
            <span>{item.municipio}, {item.departamento}</span>
          </p>
        </div>

        {/* Details CTA Link */}
        <Link
          href={`/producto/${item.id}`}
          className="w-full mt-md bg-secondary text-on-primary font-label-bold text-label-bold rounded-lg px-md py-sm min-h-[48px] hover:bg-secondary-container transition-colors flex items-center justify-center"
        >
          Ver Detalles
        </Link>
      </div>

    </article>
  );
};
export default ProductCard;
