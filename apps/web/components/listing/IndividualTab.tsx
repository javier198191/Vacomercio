'use client';

import React from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface IndividualTabProps {
  formData: {
    nombre: string;
    arete: string;
    raza: string;
    tipo: string;
    peso: string;
    precio: string;
    foto_url: string;
  };
  onChange: (field: string, value: string) => void;
  onFileSelect: (file: File, previewUrl: string) => void;
}

const RAZAS_OPTIONS = [
  { value: 'BRAHMAN', label: 'Brahman' },
  { value: 'GYR', label: 'Gyr' },
  { value: 'ANGUS', label: 'Angus' },
  { value: 'CEBU', label: 'Cebú' },
  { value: 'CRUZADO', label: 'Cruzado' },
  { value: 'NELORE', label: 'Nelore' },
  { value: 'SIMMENTAL', label: 'Simmental' },
];

const TIPOS_OPTIONS = [
  { value: 'NOVILLO', label: 'Novillo' },
  { value: 'VACA', label: 'Vaca' },
  { value: 'TORO', label: 'Toro' },
];

export const IndividualTab: React.FC<IndividualTabProps> = ({ formData, onChange, onFileSelect }) => {
  return (
    <div className="space-y-gutter">
      {/* Photo Upload Area */}
      <label className="relative border-2 border-dashed border-outline-variant rounded-lg p-lg text-center bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px] overflow-hidden block">
        {formData.foto_url ? (
          <>
            <img 
              src={formData.foto_url} 
              alt="Vista previa del animal" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-[40px] mb-xs">photo_camera</span>
              <p className="font-label-bold text-label-bold">Cambiar Foto</p>
            </div>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[48px] text-outline mb-sm">add_a_photo</span>
            <p className="font-label-bold text-label-bold text-on-surface mb-xs">Subir foto del animal</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Formatos JPG, PNG (Max 5MB)</p>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file, URL.createObjectURL(file));
          }}
        />
      </label>

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

        <Select
          label="Raza"
          id="raza-individual"
          value={formData.raza}
          onChange={(e) => onChange('raza', e.target.value)}
          options={[
            { value: '', label: 'Seleccionar raza' },
            ...RAZAS_OPTIONS,
          ]}
        />

        <Select
          label="Tipo de Ganado"
          id="tipo-individual"
          value={formData.tipo}
          onChange={(e) => onChange('tipo', e.target.value)}
          options={[
            { value: '', label: 'Seleccionar tipo' },
            ...TIPOS_OPTIONS,
          ]}
        />

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
