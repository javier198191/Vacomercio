import React from 'react';

interface LogisticsInfoProps {
  municipio: string;
  departamento: string;
  nota?: string;
}

export const LogisticsInfo: React.FC<LogisticsInfoProps> = ({
  municipio,
  departamento,
  nota,
}) => {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
      <div className="flex items-center gap-sm mb-md">
        <span className="material-symbols-outlined text-primary text-[28px]">local_shipping</span>
        <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
          Ubicación y Transporte
        </h2>
      </div>

      {/* Location Block */}
      <div className="bg-surface-container rounded-lg p-sm flex items-start gap-sm mb-sm">
        <span className="material-symbols-outlined text-on-surface-variant mt-1">location_on</span>
        <div>
          <p className="font-label-bold text-label-bold text-on-surface">Ubicación Actual</p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {municipio}, {departamento}
          </p>
        </div>
      </div>

      {/* Logistics Note */}
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-sm flex items-start gap-sm">
        <span className="material-symbols-outlined text-secondary mt-1">info</span>
        <div>
          <p className="font-label-bold text-label-bold text-secondary-container">Nota de Logística</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
            {nota ||
              'Costo estimado de transporte a ciudades principales: $350.000 – $600.000 COP (Referencial). El comprador asume los costos finales de flete.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default LogisticsInfo;
