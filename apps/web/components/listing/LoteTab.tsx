'use client';

import React from 'react';
import { Input } from '../ui/Input';

interface LoteTabProps {
  formData: {
    nombre: string;
    cantidad: string;
    peso_promedio: string;
    precio: string;
    tipo_precio: 'total' | 'kilo';
  };
  onChange: (field: string, value: string) => void;
  selectedFiles: File[];
  onFilesChange: (files: File[]) => void;
}

export const LoteTab: React.FC<LoteTabProps> = ({ formData, onChange, selectedFiles, onFilesChange }) => {
  const pesoTotal =
    formData.cantidad && formData.peso_promedio
      ? (Number(formData.cantidad) * Number(formData.peso_promedio)).toLocaleString('es-CO')
      : '—';

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
    <div className="space-y-gutter">
      {/* Photos Section */}
      <div className="space-y-sm">
        <label className="font-label-bold text-label-bold text-on-surface">Fotos del lote (Mínimo 1, Máximo 5) *</label>
        
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
          <label className="relative border-2 border-dashed border-outline-variant rounded-lg p-lg text-center bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px] overflow-hidden block">
            <span className="material-symbols-outlined text-[48px] text-outline mb-sm">add_a_photo</span>
            <p className="font-label-bold text-label-bold text-on-surface mb-xs">Subir fotos del lote (Obligatorio)</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Formatos JPG, PNG (Mínimo 1, Máximo 5)</p>
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
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {selectedFiles.length} de 5 fotos seleccionadas.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Nombre del lote - full row */}
        <div className="md:col-span-2">
          <Input
            label="Nombre del Lote"
            id="nombre-lote"
            placeholder="Ej. Novillos levante Finca El Tesoro"
            value={formData.nombre}
            onChange={(e) => onChange('nombre', e.target.value)}
          />
        </div>

        <Input
          label="Cantidad de cabezas"
          id="cantidad-lote"
          type="number"
          placeholder="0"
          value={formData.cantidad}
          onChange={(e) => onChange('cantidad', e.target.value)}
        />

        <Input
          label="Peso promedio por animal (kg)"
          id="peso-promedio-lote"
          type="number"
          placeholder="0"
          value={formData.peso_promedio}
          onChange={(e) => onChange('peso_promedio', e.target.value)}
        />

        {/* Auto-calculated Total Weight */}
        <div className="md:col-span-2 bg-surface-container rounded-lg p-sm border border-outline-variant flex items-center gap-md">
          <span className="material-symbols-outlined text-primary text-[24px]">calculate</span>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Peso Total Estimado (calculado)</p>
            <p className="font-headline-md text-headline-md text-on-surface">{pesoTotal} kg</p>
          </div>
        </div>

        {/* Price Type Radio */}
        <div className="md:col-span-2 flex flex-col gap-xs">
          <label className="font-label-bold text-label-bold text-on-surface">Tipo de fijación de precio</label>
          <div className="flex gap-md mt-xs">
            <label className="flex items-center gap-xs cursor-pointer">
              <input
                type="radio"
                name="tipo_precio"
                value="total"
                checked={formData.tipo_precio === 'total'}
                onChange={() => onChange('tipo_precio', 'total')}
                className="text-primary focus:ring-primary h-4 w-4 border-outline-variant"
              />
              <span className="font-body-sm text-body-sm">Precio total del lote</span>
            </label>
            <label className="flex items-center gap-xs cursor-pointer">
              <input
                type="radio"
                name="tipo_precio"
                value="kilo"
                checked={formData.tipo_precio === 'kilo'}
                onChange={() => onChange('tipo_precio', 'kilo')}
                className="text-primary focus:ring-primary h-4 w-4 border-outline-variant"
              />
              <span className="font-body-sm text-body-sm">Precio por kg</span>
            </label>
          </div>
        </div>

        {/* Price Input - full row */}
        <div className="md:col-span-2">
          <Input
            label={formData.tipo_precio === 'kilo' ? 'Precio por kg (COP)' : 'Valor total a publicar (COP)'}
            id="precio-lote"
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

export default LoteTab;
