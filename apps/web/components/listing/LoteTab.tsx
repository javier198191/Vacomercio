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
}

export const LoteTab: React.FC<LoteTabProps> = ({ formData, onChange }) => {
  const pesoTotal =
    formData.cantidad && formData.peso_promedio
      ? (Number(formData.cantidad) * Number(formData.peso_promedio)).toLocaleString('es-CO')
      : '—';

  return (
    <div className="space-y-gutter">
      {/* Group Photo Upload */}
      <div className="border-2 border-dashed border-outline-variant rounded-lg p-lg text-center bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px]">
        <span className="material-symbols-outlined text-outline text-[48px] mb-sm">imagesmode</span>
        <p className="font-label-bold text-label-bold text-on-surface mb-xs">Subir foto grupal del lote</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Muestra la mayoría de los animales</p>
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
