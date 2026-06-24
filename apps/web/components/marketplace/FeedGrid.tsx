'use client';

import React from 'react';
import { ProductCard, FeedItem } from './ProductCard';

interface FeedGridProps {
  items: FeedItem[];
  loading?: boolean;
}

export const FeedGrid: React.FC<FeedGridProps> = ({ items, loading = false }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-xl w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-md font-body-md text-on-surface-variant">Cargando ganado disponible...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-xl bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
        <span className="material-symbols-outlined text-[64px] text-outline mb-sm">agriculture</span>
        <h3 className="text-headline-md font-headline-md text-on-surface mb-xs">No se encontraron resultados</h3>
        <p className="text-body-md font-body-md text-on-surface-variant max-w-md mx-auto">
          No se encontraron resultados para tu búsqueda. Intenta cambiando los filtros o la ubicación.
        </p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
      {items.map((item) => (
        <ProductCard key={`${item.tipo}-${item.id}`} item={item} />
      ))}
    </section>
  );
};
export default FeedGrid;
