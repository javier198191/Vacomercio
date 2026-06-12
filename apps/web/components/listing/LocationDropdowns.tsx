'use client';

import React from 'react';
import { MUNICIPALITIES_BY_DEPARTMENT } from '@vacomercio/shared';

interface LocationDropdownsProps {
  departamento: string;
  onDepartamentoChange: (val: string) => void;
  municipio: string;
  onMunicipioChange: (val: string) => void;
}

export const LocationDropdowns: React.FC<LocationDropdownsProps> = ({
  departamento,
  onDepartamentoChange,
  municipio,
  onMunicipioChange,
}) => {
  const municipalities = departamento ? MUNICIPALITIES_BY_DEPARTMENT[departamento] || [] : [];

  return (
    <div className="pt-gutter border-t border-outline-variant">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Ubicación del Ganado</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        
        {/* Department select */}
        <div className="flex flex-col gap-xs">
          <label className="font-label-bold text-label-bold text-on-surface" htmlFor="pub-departamento">
            Departamento *
          </label>
          <select
            id="pub-departamento"
            required
            value={departamento}
            onChange={(e) => onDepartamentoChange(e.target.value)}
            className="border border-outline-variant bg-surface-bright rounded px-sm py-sm text-body-md focus:border-2 focus:border-primary focus:outline-none transition-colors"
          >
            <option value="">Seleccione departamento</option>
            {Object.keys(MUNICIPALITIES_BY_DEPARTMENT).map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Municipality select */}
        <div className="flex flex-col gap-xs">
          <label className="font-label-bold text-label-bold text-on-surface" htmlFor="pub-municipio">
            Municipio *
          </label>
          <select
            id="pub-municipio"
            required
            disabled={!departamento}
            value={municipio}
            onChange={(e) => onMunicipioChange(e.target.value)}
            className="border border-outline-variant bg-surface-bright rounded px-sm py-sm text-body-md focus:border-2 focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
          >
            <option value="">Seleccione municipio</option>
            {municipalities.map((muni) => (
              <option key={muni} value={muni}>
                {muni}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};
export default LocationDropdowns;
