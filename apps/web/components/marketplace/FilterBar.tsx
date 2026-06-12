'use client';

import React from 'react';
import { REGIONS_MAPPING } from '@vacomercio/shared';

interface FilterBarProps {
  activeRegion: string;
  onRegionChange: (region: string) => void;
  activePriceCategory: string;
  onPriceCategoryChange: (category: string) => void;
  activeTipo: string;
  onTipoChange: (tipo: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeRegion,
  onRegionChange,
  activePriceCategory,
  onPriceCategoryChange,
  activeTipo,
  onTipoChange,
}) => {
  return (
    <section className="mb-lg bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col gap-md">
      <div className="flex flex-col md:flex-row gap-md items-start md:items-center justify-between">
        
        {/* Region Dropdown */}
        <div className="w-full md:w-auto">
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-xs">Región</label>
          <select
            value={activeRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full md:w-auto bg-surface-bright border border-outline-variant text-on-surface text-body-md font-body-md rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none min-h-[48px]"
          >
            <option value="">Todas las regiones</option>
            {Object.keys(REGIONS_MAPPING).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* Price Categories */}
        <div className="w-full md:w-auto">
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-xs">Categoría de Precio</label>
          <div className="flex flex-wrap gap-xs">
            <button
              onClick={() => onPriceCategoryChange(activePriceCategory === 'LEVANTE' ? '' : 'LEVANTE')}
              className={`font-label-bold text-label-bold rounded-lg px-md py-sm min-h-[48px] border transition-colors ${
                activePriceCategory === 'LEVANTE'
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-bright text-on-surface border-outline-variant hover:bg-surface-container'
              }`}
            >
              Levante/Cría ($800k–$1.5M)
            </button>
            <button
              onClick={() => onPriceCategoryChange(activePriceCategory === 'COMERCIAL' ? '' : 'COMERCIAL')}
              className={`font-label-bold text-label-bold rounded-lg px-md py-sm min-h-[48px] border transition-colors ${
                activePriceCategory === 'COMERCIAL'
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-bright text-on-surface border-outline-variant hover:bg-surface-container'
              }`}
            >
              Comercial/Consumo ($1.5M–$3.5M)
            </button>
            <button
              onClick={() => onPriceCategoryChange(activePriceCategory === 'ELITE' ? '' : 'ELITE')}
              className={`font-label-bold text-label-bold rounded-lg px-md py-sm min-h-[48px] border transition-colors ${
                activePriceCategory === 'ELITE'
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-bright text-on-surface border-outline-variant hover:bg-surface-container'
              }`}
            >
              Genética/Élite (+$5M)
            </button>
          </div>
        </div>

        {/* Type Filter (Individual vs Lote) */}
        <div className="w-full md:w-auto">
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-xs">Tipo de Publicación</label>
          <div className="flex bg-surface-bright p-[3px] rounded-lg border border-outline-variant min-h-[48px] items-center">
            <button
              onClick={() => onTipoChange('')}
              className={`px-md py-xs rounded-md font-label-bold text-label-bold transition-all ${
                activeTipo === ''
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface hover:text-primary'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => onTipoChange('individual')}
              className={`px-md py-xs rounded-md font-label-bold text-label-bold transition-all ${
                activeTipo === 'individual'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface hover:text-primary'
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => onTipoChange('lote')}
              className={`px-md py-xs rounded-md font-label-bold text-label-bold transition-all ${
                activeTipo === 'lote'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface hover:text-primary'
              }`}
            >
              Lote
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
export default FilterBar;
