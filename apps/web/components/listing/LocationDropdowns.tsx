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
    <div className="border border-vc-gray-mid rounded-xl p-6 bg-[#F9FAFB] mt-6">
      <h2 className="font-sans font-bold text-lg text-vc-black block border-b border-vc-gray-light pb-2 mb-6">📍 3. Ubicación del Ganado</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Department select */}
        <div className="flex flex-col gap-1">
          <label className="font-sans font-bold text-vc-black" htmlFor="pub-departamento">
            Departamento *
          </label>
          <select
            id="pub-departamento"
            required
            value={departamento}
            onChange={(e) => onDepartamentoChange(e.target.value)}
            className="w-full border border-vc-gray-mid bg-vc-white rounded-lg px-4 py-2 font-sans text-vc-black focus:border-vc-black focus:outline-none transition-colors"
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
        <div className="flex flex-col gap-1">
          <label className="font-sans font-bold text-vc-black" htmlFor="pub-municipio">
            Municipio *
          </label>
          <select
            id="pub-municipio"
            required
            disabled={!departamento}
            value={municipio}
            onChange={(e) => onMunicipioChange(e.target.value)}
            className="w-full border border-vc-gray-mid bg-vc-white rounded-lg px-4 py-2 font-sans text-vc-black focus:border-vc-black focus:outline-none transition-colors disabled:opacity-50"
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
