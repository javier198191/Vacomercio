'use client';

import React, { useState } from 'react';
import { MUNICIPALITIES_BY_DEPARTMENT } from '@vacomercio/shared';

interface LocationSelectorProps {
  onLocationChange?: (location: { departamento?: string; municipio?: string }) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationChange }) => {
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedMuni, setSelectedMuni] = useState('');

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    setSelectedMuni('');
    if (onLocationChange) {
      onLocationChange({ departamento: dept || undefined, municipio: undefined });
    }
  };

  const handleMuniChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const muni = e.target.value;
    setSelectedMuni(muni);
    if (onLocationChange) {
      onLocationChange({ departamento: selectedDept || undefined, municipio: muni || undefined });
    }
  };

  const municipalities = selectedDept ? MUNICIPALITIES_BY_DEPARTMENT[selectedDept] || [] : [];

  return (
    <div className="flex items-center gap-xs">
      <select
        value={selectedDept}
        onChange={handleDeptChange}
        className="bg-surface-bright border border-outline-variant text-on-surface text-body-sm font-body-sm rounded px-sm py-xs focus:ring-2 focus:ring-primary focus:border-primary outline-none"
      >
        <option value="">Departamento</option>
        {Object.keys(MUNICIPALITIES_BY_DEPARTMENT).map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <select
        value={selectedMuni}
        onChange={handleMuniChange}
        disabled={!selectedDept}
        className="bg-surface-bright border border-outline-variant text-on-surface text-body-sm font-body-sm rounded px-sm py-xs focus:ring-2 focus:ring-primary focus:border-primary outline-none disabled:opacity-50"
      >
        <option value="">Municipio</option>
        {municipalities.map((muni) => (
          <option key={muni} value={muni}>
            {muni}
          </option>
        ))}
      </select>
    </div>
  );
};
export default LocationSelector;
