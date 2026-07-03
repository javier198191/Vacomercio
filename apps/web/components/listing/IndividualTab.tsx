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
  };
  onChange: (field: string, value: string) => void;
  selectedFiles: File[];
  onFilesChange: (files: File[]) => void;
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

export const IndividualTab: React.FC<IndividualTabProps> = ({ formData, onChange, selectedFiles, onFilesChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const updated = [...selectedFiles, ...newFiles].slice(0, 5); // max 5 files
      onFilesChange(updated);
    }
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Photos Section */}
      <div className="border border-vc-gray-mid rounded-xl p-6 bg-[#F9FAFB] space-y-4">
        <h2 className="font-sans font-bold text-lg text-vc-black block border-b border-vc-gray-light pb-2">📸 1. Fotos del animal (Mínimo 1, Máximo 5) *</h2>
        
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-sm mb-sm">
            {selectedFiles.map((file, idx) => {
              const previewUrl = URL.createObjectURL(file);
              return (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-outline-variant bg-surface-container shadow-sm">
                  <img src={previewUrl} alt={`Vista previa ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-xs right-xs bg-black/60 hover:bg-error text-white rounded-full p-[2px] flex items-center justify-center transition-colors shadow-md"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              );
            })}
            {selectedFiles.length < 5 && (
              <label className="border-2 border-dashed border-outline-variant rounded-lg aspect-square flex flex-col items-center justify-center bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[28px] text-outline">add_a_photo</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-xs">Añadir</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        )}

        {selectedFiles.length === 0 && (
          <label className="relative border-2 border-dashed border-vc-gray-mid rounded-lg p-6 text-center bg-vc-white hover:bg-vc-gray-light transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px] overflow-hidden block">
            <span className="material-symbols-outlined text-[48px] text-vc-gray-mid mb-2">add_a_photo</span>
            <p className="font-sans font-bold text-vc-black mb-1">Haz clic para subir fotos (Obligatorio)</p>
            <p className="font-sans text-sm text-vc-gray-dark">Formatos JPG, PNG (Mínimo 1, Máximo 5)</p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
        
        {selectedFiles.length > 0 && (
          <p className="font-sans text-sm text-vc-gray-dark">
            {selectedFiles.length} de 5 fotos seleccionadas.
          </p>
        )}
      </div>

      <div className="border border-vc-gray-mid rounded-xl p-6 bg-[#F9FAFB]">
        <h2 className="font-sans font-bold text-lg text-vc-black block border-b border-vc-gray-light pb-2 mb-6">📝 2. Información Básica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre"
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
    </div>
  );
};

export default IndividualTab;
