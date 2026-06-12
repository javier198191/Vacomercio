'use client';

import React, { useState } from 'react';
import { Input } from '../ui/Input';

interface SelectionPanelProps {
  selectedCount: number;
  onNameChange: (name: string) => void;
  lotName: string;
  hasWithdrawalAnimals: boolean;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({
  selectedCount,
  onNameChange,
  lotName,
  hasWithdrawalAnimals,
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md shadow-sm space-y-md">
      <h2 className="font-headline-md text-headline-md text-on-surface">Configurar Lote</h2>

      <Input
        label="Nombre del Lote"
        id="lot-name"
        placeholder="Ej. Novillos Finca El Paraíso"
        value={lotName}
        onChange={(e) => onNameChange(e.target.value)}
      />

      <div className="bg-surface-container rounded-lg p-sm border border-outline-variant">
        <p className="font-label-sm text-label-sm text-on-surface-variant">Animales seleccionados</p>
        <p className="font-headline-md text-headline-md text-primary mt-xs">{selectedCount} cabezas</p>
      </div>

      {hasWithdrawalAnimals && (
        <div className="bg-error-container border border-error rounded-lg p-sm flex items-start gap-sm">
          <span className="material-symbols-outlined text-on-error-container mt-[2px]">warning</span>
          <div>
            <p className="font-label-bold text-label-bold text-on-error-container">
              ⚠️ Advertencia de Inocuidad
            </p>
            <p className="font-body-sm text-body-sm text-on-error-container mt-xs">
              Uno o más animales seleccionados tienen un período de carencia (retiro de medicamentos) activo. El servidor bloqueará la creación de este lote para venta inmediata de consumo humano.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectionPanel;
