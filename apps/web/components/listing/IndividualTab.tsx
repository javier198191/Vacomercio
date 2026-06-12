'use client';

import React from 'react';
import { Input } from '../ui/Input';

interface IndividualTabProps {
  formData: {
    nombre: string;
    arete: string;
    raza: string;
    peso: string;
    precio: string;
    foto_url: string;
  };
  onChange: (field: string, value: string) => void;
}

const RAZAS = ['Brahman', 'Cebú', 'Angus', 'Cruzado', 'Gyr', 'Nelore', 'Simmental'];

export const IndividualTab: React.FC<IndividualTabProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-gutter">
      {/* Photo Upload Area */}
      <div className="border-2 border-dashed border-outline-variant rounded-lg p-lg text-center bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px]">
        <span className="material-symbols-outlined text-outline text-[48px] mb-sm">add_a_photo</span>
        <p className="font-label-bold text-label-bold text-on-surface mb-xs">Subir foto del animal</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Formatos JPG, PNG (Max 5MB)</p>
        <input
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange('foto_url', URL.createObjectURL(file));
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <Input
          label="Nombre / Arete"
          id="nombre-individual"
          placeholder="Ej. Vaca Lola 001"
          value={formData.nombre}
          onChange={(e) => onChange('nombre', e.target.value)}
        />
        <Input
          label="Número de Arete"
          id="arete-individual"
          placeholder="Ej. 8492"
          value={formData.arete}
          onChange={(e) => onChange('arete', e.target.value)}
        />

        {/* Raza Select */}
        <div className="flex flex-col gap-xs">
          <label className="font-label-bold text-label-bold text-on-surface" htmlFor="raza-individual">
            Raza
          </label>
          <select
            id="raza-individual"
            value={formData.raza}
            onChange={(e) => onChange('raza', e.target.value)}
            className="border border-outline-variant bg-surface-bright rounded px-sm py-sm text-body-md focus:border-2 focus:border-primary focus:outline-none transition-colors"
          >
            <option value="">Seleccionar raza</option>
            {RAZAS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <Input
          label="Peso actual (kg)"
          id="peso-individual"
          type="number"
          placeholder="0"
          value={formData.peso}
          onChange={(e) => onChange('peso', e.target.value)}
        />

        <div className="md:col-span-2">
          <Input
            label="Precio base (COP)"
            id="precio-individual"
            type="number"
            placeholder="0"
            prefixSymbol="$"
            value={formData.precio}
            onChange={(e) => onChange('precio', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default IndividualTab;
