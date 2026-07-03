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
  const mainImageUrl = item.foto_url ? item.foto_url.split(',')[0] : null;

  return (
    <article className="bg-vc-white rounded-xl border border-vc-gray-light overflow-hidden flex flex-col">
      
      {/* Photo Container */}
      <div className="h-48 w-full relative bg-vc-gray-dark">
        {mainImageUrl ? (
          <img
            src={mainImageUrl}
            alt={item.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-vc-white">
            <span className="material-symbols-outlined text-[48px]">image</span>
            <span className="text-sm font-sans mt-1">Sin foto</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2 bg-vc-black text-vc-white px-2 py-1 rounded text-xs font-sans font-bold border border-vc-gray-light">
          {isLote ? 'Lote Disponible' : 'Disponible'}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 flex flex-col flex-grow">
        
        <h3 className="text-xl font-serif font-bold text-vc-black mb-1 truncate">
          {item.nombre}
        </h3>
        
        <p className="text-sm font-sans text-vc-gray-mid mb-3">
          {item.areteOrLoteNumber}
        </p>

        {/* Bento-style Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 bg-vc-white p-2 rounded border border-vc-gray-light">
          <div>
            <span className="block text-xs font-sans text-vc-gray-mid">
              {isLote ? 'Peso Prom.' : 'Peso'}
            </span>
            <span className="text-sm font-sans font-bold text-vc-black">
              {item.peso} kg
            </span>
          </div>
          <div>
            <span className="block text-xs font-sans text-vc-gray-mid">
              {isLote ? 'Cantidad' : 'Detalle'}
            </span>
            <span className="text-sm font-sans font-bold text-vc-black truncate">
              {item.razaOrQuantity}
            </span>
          </div>
        </div>

        {/* Price and Location */}
        <div className="mt-auto">
          <p className="text-2xl font-sans font-bold text-vc-green mb-1">
            {formatPrice(item.precio)}
          </p>
          <p className="text-sm font-sans text-vc-gray-mid flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-vc-black">location_on</span>
            <span>{item.municipio}, {item.departamento}</span>
          </p>
        </div>

        {/* Details CTA Link */}
        <Link
          href={`/producto/${item.id}`}
          className="w-full mt-4 bg-vc-white border border-vc-black text-vc-black font-bold font-sans rounded-lg px-4 py-2 hover:bg-vc-gray-light transition-colors flex items-center justify-center"
        >
          Ver Detalles
        </Link>
      </div>

    </article>
  );
};
export default ProductCard;
