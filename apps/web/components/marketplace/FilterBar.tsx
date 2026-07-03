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
    <section className="mb-8 bg-vc-white p-6 rounded-xl border border-vc-gray-light flex flex-col gap-6">
      
      {/* Row 1: Location Hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {/* Region Select */}
        <div className="flex flex-col">
          <label className="block text-sm font-sans font-bold text-vc-black mb-1">Región</label>
          <select
            value={activeRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full bg-vc-black border border-vc-black text-vc-white font-sans rounded-lg px-4 py-2 outline-none min-h-[48px]"
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
          <label className="block text-sm font-sans font-bold text-vc-black mb-1">Departamento</label>
          <select
            value={activeDepartamento}
            onChange={(e) => onDepartamentoChange(e.target.value)}
            className="w-full bg-vc-black border border-vc-black text-vc-white font-sans rounded-lg px-4 py-2 outline-none min-h-[48px]"
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
          <label className="block text-sm font-sans font-bold text-vc-black mb-1">Municipio</label>
          <select
            value={activeMunicipio}
            onChange={(e) => onMunicipioChange(e.target.value)}
            disabled={!activeDepartamento}
            className={`w-full bg-vc-black border border-vc-black text-vc-white font-sans rounded-lg px-4 py-2 outline-none min-h-[48px] ${
              !activeDepartamento ? 'opacity-50 cursor-not-allowed' : ''
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

      <hr className="border-vc-gray-light" />

      {/* Row 2: Animal specific filters */}
      <div className="flex flex-col lg:flex-row gap-md items-start lg:items-center justify-between">
        
        {/* Breed (Raza) Select */}
        <div className="w-full lg:w-auto min-w-[200px]">
          <label className="block text-sm font-sans font-bold text-vc-black mb-1">Raza (Solo Individuales)</label>
          <select
            value={activeRaza}
            onChange={(e) => onRazaChange(e.target.value)}
            className="w-full bg-vc-black border border-vc-black text-vc-white font-sans rounded-lg px-4 py-2 outline-none min-h-[48px]"
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
          <label className="block text-sm font-sans font-bold text-vc-black mb-1">Categoría de Precio</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onPriceCategoryChange(activePriceCategory === 'LEVANTE' ? '' : 'LEVANTE')}
              className={`font-sans font-bold rounded-lg px-4 py-2 min-h-[48px] border transition-colors ${
                activePriceCategory === 'LEVANTE'
                  ? 'bg-vc-white text-vc-black border-vc-black'
                  : 'bg-vc-black text-vc-white border-vc-black hover:bg-vc-gray-dark'
              }`}
            >
              Levante/Cría ($800k–$1.5M)
            </button>
            <button
              onClick={() => onPriceCategoryChange(activePriceCategory === 'COMERCIAL' ? '' : 'COMERCIAL')}
              className={`font-sans font-bold rounded-lg px-4 py-2 min-h-[48px] border transition-colors ${
                activePriceCategory === 'COMERCIAL'
                  ? 'bg-vc-white text-vc-black border-vc-black'
                  : 'bg-vc-black text-vc-white border-vc-black hover:bg-vc-gray-dark'
              }`}
            >
              Comercial/Consumo ($1.5M–$3.5M)
            </button>
            <button
              onClick={() => onPriceCategoryChange(activePriceCategory === 'ELITE' ? '' : 'ELITE')}
              className={`font-sans font-bold rounded-lg px-4 py-2 min-h-[48px] border transition-colors ${
                activePriceCategory === 'ELITE'
                  ? 'bg-vc-white text-vc-black border-vc-black'
                  : 'bg-vc-black text-vc-white border-vc-black hover:bg-vc-gray-dark'
              }`}
            >
              Genética/Élite (+$5M)
            </button>
          </div>
        </div>

        {/* Type Filter (Individual vs Lote) */}
        <div className="w-full lg:w-auto">
          <label className="block text-sm font-sans font-bold text-vc-black mb-1">Tipo de Publicación</label>
          <div className="flex bg-vc-black p-[3px] rounded-lg border border-vc-black min-h-[48px] items-center w-max">
            <button
              type="button"
              onClick={() => onTipoChange('')}
              className={`px-4 py-1 rounded-md font-sans font-bold transition-all ${
                activeTipo === ''
                  ? 'bg-vc-white text-vc-black'
                  : 'text-[#CCCCCC] hover:text-vc-white'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => onTipoChange('individual')}
              className={`px-4 py-1 rounded-md font-sans font-bold transition-all ${
                activeTipo === 'individual'
                  ? 'bg-vc-white text-vc-black'
                  : 'text-[#CCCCCC] hover:text-vc-white'
              }`}
            >
              Individual
            </button>
            <button
              type="button"
              onClick={() => onTipoChange('lote')}
              className={`px-4 py-1 rounded-md font-sans font-bold transition-all ${
                activeTipo === 'lote'
                  ? 'bg-vc-white text-vc-black'
                  : 'text-[#CCCCCC] hover:text-vc-white'
              }`}
            >
              Lote
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-end mt-2 pt-6 border-t border-vc-gray-light">
        <button
          type="button"
          onClick={onClearFilters}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-sans font-bold border border-vc-black bg-vc-white text-vc-black hover:bg-vc-gray-light transition-all min-h-[48px]"
        >
          <span className="material-symbols-outlined text-[20px]">restart_alt</span>
          Limpiar Filtros
        </button>
        <button
          type="button"
          onClick={onApplyFilters}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-sans font-bold bg-vc-black text-vc-white hover:bg-vc-gray-dark transition-all min-h-[48px]"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
          Buscar / Aplicar Filtros
        </button>
      </div>
    </section>
  );
};

export default FilterBar;
