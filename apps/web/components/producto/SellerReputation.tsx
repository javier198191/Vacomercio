import React from 'react';

interface SellerReputationProps {
  nombre: string;
  finca?: string | null;
  verificado: boolean;
  reputacion_promedio: number;
  total_ventas?: number;
}

export const SellerReputation: React.FC<SellerReputationProps> = ({
  nombre,
  finca,
  verificado,
  reputacion_promedio,
  total_ventas,
}) => {
  const stars = Math.round(reputacion_promedio);

  return (
    <section className="bg-surface-container-highest rounded-xl border border-outline p-md">
      <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-sm">
        Información del Vendedor
      </h3>

      <div className="flex items-center gap-md mb-md">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-surface-container-lowest border-2 border-primary flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-primary text-[32px]">agriculture</span>
        </div>

        {/* Name + Rating */}
        <div>
          <h4 className="font-headline-md text-headline-md font-bold text-on-surface">
            {finca || nombre}
          </h4>
          {finca && (
            <p className="font-body-sm text-body-sm text-on-surface-variant">{nombre}</p>
          )}
          <div className="flex items-center gap-xs mt-xs">
            {/* Star icons */}
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`material-symbols-outlined text-[18px] ${
                  n <= stars ? 'text-secondary-container' : 'text-outline-variant'
                }`}
                style={{ fontVariationSettings: n <= stars ? "'FILL' 1" : "'FILL' 0" }}
              >
                star
              </span>
            ))}
            <span className="font-label-bold text-label-bold text-on-surface ml-xs">
              {reputacion_promedio.toFixed(1)}
            </span>
            {total_ventas !== undefined && (
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                ({total_ventas} Ventas)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Verified Badge */}
      {verificado && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-sm flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified
          </span>
          <span className="font-label-bold text-label-bold text-primary">Ganadero Verificado ✅</span>
        </div>
      )}
    </section>
  );
};

export default SellerReputation;
