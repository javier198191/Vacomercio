'use client';

import React from 'react';

export interface CattleRow {
  id: string;
  nombre: string;
  arete: string;
  raza: string;
  peso: number;
  precio: number;
  foto_url?: string | null;
  en_periodo_retiro?: boolean;
}

interface CattleTableProps {
  animals: CattleRow[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const CattleTable: React.FC<CattleTableProps> = ({
  animals,
  selectedIds,
  onToggle,
  onToggleAll,
  searchQuery,
  onSearchChange,
}) => {
  const allSelected = animals.length > 0 && animals.every((a) => selectedIds.has(a.id));

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(val);

  const filtered = animals.filter(
    (a) =>
      a.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.arete.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.raza.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden shadow-sm">
      {/* Table Controls */}
      <div className="p-sm md:p-md border-b border-outline-variant bg-surface-bright flex flex-col md:flex-row justify-between items-center gap-sm">
        <div className="relative w-full md:w-auto">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por arete o raza..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full md:w-64 pl-xl pr-sm py-sm rounded border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-body-sm font-body-sm outline-none"
          />
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          {selectedIds.size} animal(es) seleccionado(s)
        </p>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="p-sm text-center w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onToggleAll(e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary accent-primary"
                />
              </th>
              <th className="p-sm font-label-bold text-label-bold text-on-surface-variant">Foto</th>
              <th className="p-sm font-label-bold text-label-bold text-on-surface-variant">Nombre / Arete</th>
              <th className="p-sm font-label-bold text-label-bold text-on-surface-variant">Raza</th>
              <th className="p-sm font-label-bold text-label-bold text-on-surface-variant text-right">Peso (kg)</th>
              <th className="p-sm font-label-bold text-label-bold text-on-surface-variant text-right">Precio Base Est.</th>
              <th className="p-sm font-label-bold text-label-bold text-on-surface-variant text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-outline-variant">
            {filtered.map((animal) => {
              const isSelected = selectedIds.has(animal.id);
              return (
                <tr
                  key={animal.id}
                  onClick={() => onToggle(animal.id)}
                  className={`cursor-pointer hover:bg-surface-bright transition-colors ${
                    isSelected ? 'bg-surface-container' : ''
                  }`}
                >
                  <td className="p-sm text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggle(animal.id)}
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary accent-primary"
                    />
                  </td>
                  <td className="p-sm">
                    <div className="w-16 h-12 rounded bg-surface-variant overflow-hidden flex items-center justify-center">
                      {animal.foto_url ? (
                        <img src={animal.foto_url} alt={animal.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-outline">image</span>
                      )}
                    </div>
                  </td>
                  <td className="p-sm font-label-bold">
                    {animal.nombre} — #{animal.arete}
                  </td>
                  <td className="p-sm">{animal.raza}</td>
                  <td className="p-sm text-right">{animal.peso}</td>
                  <td className="p-sm text-right text-secondary-container font-label-bold">
                    {formatPrice(animal.precio)}
                  </td>
                  <td className="p-sm text-center">
                    {animal.en_periodo_retiro ? (
                      <span className="inline-flex items-center gap-xs bg-error-container text-on-error-container text-label-sm font-label-bold px-xs py-[2px] rounded">
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                        Retiro
                      </span>
                    ) : (
                      <span className="inline-block bg-primary text-on-primary text-label-sm font-label-bold px-xs py-[2px] rounded">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-lg text-on-surface-variant font-body-sm">
                  No se encontraron animales que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CattleTable;
