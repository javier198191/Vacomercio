import React from 'react';
import { REGIONS_MAPPING, DEPARTMENTS_LIST, MUNICIPALITIES_BY_DEPARTMENT } from '@vacomercio/shared';

interface FilterBarProps {
  activeRegion: string;
  onRegionChange: (region: string) => void;
  activeDepartamento: string;
  onDepartamentoChange: (dept: string) => void;
  activeMunicipio: string;
  onMunicipioChange: (muni: string) => void;
  activeRaza: string;
  onRazaChange: (raza: string) => void;
  activePriceCategory: string;
  onPriceCategoryChange: (category: string) => void;
  activeTipo: string;
  onTipoChange: (tipo: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const RAZAS = ['BRAHMAN', 'GYR', 'ANGUS', 'CEBU', 'CRUZADO', 'NELORE', 'SIMMENTAL'];

export const FilterBar: React.FC<FilterBarProps> = ({
  activeRegion,
  onRegionChange,
  activeDepartamento,
  onDepartamentoChange,
  activeMunicipio,
  onMunicipioChange,
  activeRaza,
  onRazaChange,
  activePriceCategory,
  onPriceCategoryChange,
  activeTipo,
  onTipoChange,
  onApplyFilters,
  onClearFilters,
}) => {
  // Determine list of departments to display
  const departments = activeRegion 
    ? REGIONS_MAPPING[activeRegion] || []
    : DEPARTMENTS_LIST;

  // Determine list of municipalities to display
  const municipalities = activeDepartamento
    ? MUNICIPALITIES_BY_DEPARTMENT[activeDepartamento] || []
    : [];

  return (
    <section className="mb-lg bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col gap-md">
      
      {/* Row 1: Location Hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {/* Region Select */}
        <div className="flex flex-col">
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-xs">Región</label>
          <select
            value={activeRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full bg-surface-bright border border-outline-variant text-on-surface text-body-md font-body-md rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none min-h-[48px]"
          >
            <option value="">Todas las regiones</option>
            {Object.keys(REGIONS_MAPPING).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* Departamento Select */}
        <div className="flex flex-col">
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-xs">Departamento</label>
          <select
            value={activeDepartamento}
            onChange={(e) => onDepartamentoChange(e.target.value)}
            className="w-full bg-surface-bright border border-outline-variant text-on-surface text-body-md font-body-md rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none min-h-[48px]"
          >
            <option value="">Todos los departamentos</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Municipio Select */}
        <div className="flex flex-col">
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-xs">Municipio</label>
          <select
            value={activeMunicipio}
            onChange={(e) => onMunicipioChange(e.target.value)}
            disabled={!activeDepartamento}
            className={`w-full bg-surface-bright border border-outline-variant text-on-surface text-body-md font-body-md rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none min-h-[48px] ${
              !activeDepartamento ? 'opacity-50 cursor-not-allowed bg-surface-container' : ''
            }`}
          >
            <option value="">
              {activeDepartamento ? 'Todos los municipios' : 'Seleccione departamento primero'}
            </option>
            {municipalities.map((muni) => (
              <option key={muni} value={muni}>
                {muni}
              </option>
            ))}
          </select>
        </div>
      </div>

      <hr className="border-outline-variant" />

      {/* Row 2: Animal specific filters */}
      <div className="flex flex-col lg:flex-row gap-md items-start lg:items-center justify-between">
        
        {/* Breed (Raza) Select */}
        <div className="w-full lg:w-auto min-w-[200px]">
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-xs">Raza (Solo Individuales)</label>
          <select
            value={activeRaza}
            onChange={(e) => onRazaChange(e.target.value)}
            className="w-full bg-surface-bright border border-outline-variant text-on-surface text-body-md font-body-md rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none min-h-[48px]"
          >
            <option value="">Todas las razas</option>
            {RAZAS.map((raza) => (
              <option key={raza} value={raza}>
                {raza.charAt(0) + raza.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Price Categories */}
        <div className="w-full lg:w-auto">
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
        <div className="w-full lg:w-auto">
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-xs">Tipo de Publicación</label>
          <div className="flex bg-surface-bright p-[3px] rounded-lg border border-outline-variant min-h-[48px] items-center w-max">
            <button
              type="button"
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
              type="button"
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
              type="button"
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

      {/* Row 3: Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-md sm:justify-end mt-xs pt-md border-t border-outline-variant">
        <button
          type="button"
          onClick={onClearFilters}
          className="flex items-center justify-center gap-xs px-lg py-md rounded-lg font-label-bold text-label-bold border border-outline-variant bg-surface-bright text-on-surface hover:bg-surface-container transition-all min-h-[48px]"
        >
          <span className="material-symbols-outlined text-[20px]">restart_alt</span>
          Limpiar Filtros
        </button>
        <button
          type="button"
          onClick={onApplyFilters}
          className="flex items-center justify-center gap-xs px-xl py-md rounded-lg font-label-bold text-label-bold bg-primary text-on-primary hover:opacity-90 shadow-md hover:shadow-lg transition-all min-h-[48px]"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
          Buscar / Aplicar Filtros
        </button>
      </div>
    </section>
  );
};

export default FilterBar;
