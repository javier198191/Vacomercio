import React from 'react';

interface LotSummaryBarProps {
  selectedCount: number;
  pesoPromedio: number;
  pesoTotal: number;
  precioTotal: number;
  onSubmit: () => void;
  isSubmitting: boolean;
  disabled: boolean;
}

export const LotSummaryBar: React.FC<LotSummaryBarProps> = ({
  selectedCount,
  pesoPromedio,
  pesoTotal,
  precioTotal,
  onSubmit,
  isSubmitting,
  disabled,
}) => {
  const formatCOP = (val: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(val);

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 bg-surface-container-lowest border-t border-outline-variant shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-md">
      <div className="max-w-container-max mx-auto flex flex-col lg:flex-row justify-between items-center gap-md">
        
        {/* Metrics */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-md lg:gap-xl">
          <div className="flex flex-col items-center lg:items-start">
            <span className="text-label-sm font-label-sm text-on-surface-variant">Seleccionadas</span>
            <span className="text-headline-md font-headline-md text-primary">{selectedCount} cabezas</span>
          </div>

          <div className="hidden sm:block w-px h-10 bg-outline-variant" />

          <div className="flex flex-col items-center lg:items-start">
            <span className="text-label-sm font-label-sm text-on-surface-variant">Peso Promedio</span>
            <span className="text-headline-md font-headline-md text-on-surface">
              {selectedCount > 0 ? `${pesoPromedio.toFixed(0)} kg` : '— kg'}
            </span>
          </div>

          <div className="hidden sm:block w-px h-10 bg-outline-variant" />

          <div className="flex flex-col items-center lg:items-start">
            <span className="text-label-sm font-label-sm text-on-surface-variant">Peso Total</span>
            <span className="text-headline-md font-headline-md text-on-surface">
              {selectedCount > 0
                ? `${pesoTotal.toLocaleString('es-CO')} kg`
                : '— kg'}
            </span>
          </div>

          <div className="hidden sm:block w-px h-10 bg-outline-variant" />

          <div className="flex flex-col items-center lg:items-start">
            <span className="text-label-sm font-label-sm text-on-surface-variant">Precio Base Total</span>
            <span className="text-headline-md font-headline-md text-secondary-container">
              {selectedCount > 0 ? formatCOP(precioTotal) : '$ —'}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onSubmit}
          disabled={disabled || isSubmitting || selectedCount === 0}
          className="w-full lg:w-auto bg-primary text-on-primary font-label-bold text-label-bold py-sm px-xl rounded-lg min-h-[48px] hover:bg-primary-container transition-colors flex items-center justify-center gap-sm disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? 'Creando Lote...' : 'Convertir en Lote y Publicar'}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default LotSummaryBar;
