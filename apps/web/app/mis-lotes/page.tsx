'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';

interface Animal {
  id: string;
  nombre: string;
  arete: string;
  raza: string;
  tipo: string;
  peso: number;
  precio: number;
  foto_url?: string | null;
  departamento: string;
  municipio: string;
  createdAt: string;
}

interface Lot {
  id: string;
  nombre: string;
  cantidad: number;
  peso_promedio: number;
  peso_total: number;
  precio: number;
  categoria?: string | null;
  animals: Animal[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
const TEMP_USER_ID = 'user-1';

export default function MisLotesPage() {
  const [activeTab, setActiveTab] = useState<'suelto' | 'lote'>('suelto');
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtering & Sorting States
  const [sortBy, setSortBy] = useState<'reciente' | 'antiguo' | 'nombre'>('reciente');
  const [filterRaza, setFilterRaza] = useState<string>('TODAS');
  const [filterTipo, setFilterTipo] = useState<string>('TODOS');

  // Multi-step Creation States
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>([]);
  const [newLotName, setNewLotName] = useState('');
  const [newLotCategory, setNewLotCategory] = useState('');

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const animalsRes = await apiFetch(`/animals?userId=${TEMP_USER_ID}&loteId=null`, { cache: 'no-store' });
      if (!animalsRes.ok) throw new Error('Error al cargar ganado suelto');
      const animalsData = await animalsRes.json();
      setAnimals(animalsData);

      const lotsRes = await apiFetch(`/lots?userId=${TEMP_USER_ID}`, { cache: 'no-store' });
      if (!lotsRes.ok) throw new Error('Error al cargar lotes');
      const lotsData = await lotsRes.json();
      setLots(lotsData);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Ocurrió un error al cargar la información.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAnimalClick = (id: string) => {
    if (!isSelectionMode) return;
    setSelectedAnimalIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const startSelectionMode = () => {
    setIsSelectionMode(true);
    setSelectedAnimalIds([]);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const cancelSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedAnimalIds([]);
  };

  const handleCreateLot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLotName.trim()) {
      setErrorMsg('Por favor ingresa un nombre para el lote.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Create the empty Lot
      const createRes = await apiFetch(`/lots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: newLotName.trim(),
          categoria: newLotCategory.trim() || 'General',
          departamento: 'Antioquia', // Default user location values
          municipio: 'Medellín',
          userId: TEMP_USER_ID,
          precio: 0,
        }),
      });

      if (!createRes.ok) {
        const errData = await createRes.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al crear el lote en el servidor.');
      }

      const createdLot = await createRes.json();

      // 2. Assign selected animals to the newly created lot
      const assignRes = await apiFetch(`/lots/${createdLot.id}/assign-animals`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animalIds: selectedAnimalIds,
        }),
      });

      if (!assignRes.ok) {
        const errData = await assignRes.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al asociar los animales al lote.');
      }

      setSuccessMsg(`✅ Lote "${newLotName}" creado con éxito con ${selectedAnimalIds.length} animales.`);
      setIsModalOpen(false);
      setIsSelectionMode(false);
      
      // Clear form
      setNewLotName('');
      setNewLotCategory('');
      setSelectedAnimalIds([]);

      // Reload
      await loadData();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Ocurrió un error durante la creación del lote.');
    } finally {
      setIsSaving(false);
    }
  };

  const capitalize = (str: string) => {
    if (!str) return '';
    if (str.toUpperCase() === 'CEBU') return 'Cebú';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Get list of existing categories for quick selection
  const existingCategories = Array.from(
    new Set(lots.map((l) => l.categoria).filter(Boolean))
  ) as string[];

  // Filter animals list
  const filteredAnimals = animals
    .filter((a) => {
      if (filterRaza !== 'TODAS' && a.raza !== filterRaza) return false;
      if (filterTipo !== 'TODOS' && a.tipo !== filterTipo) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'nombre') {
        return a.nombre.localeCompare(b.nombre);
      }
      const dateA = new Date(a.createdAt || a.id).getTime();
      const dateB = new Date(b.createdAt || b.id).getTime();
      if (sortBy === 'antiguo') {
        return dateA - dateB;
      }
      return dateB - dateA; // default: reciente
    });

  // Common breeds list for visual pills
  const BREEDS = ['TODAS', 'BRAHMAN', 'GYR', 'CEBU', 'CRUZADO', 'NELORE', 'SIMMENTAL', 'ANGUS'];
  const TYPES = ['TODOS', 'NOVILLO', 'VACA', 'TORO'];

  return (
    <>


      {/* Main Container */}
      <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-md py-lg pb-40">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-md mb-lg">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs font-bold text-3xl md:text-4xl">Inventario de Ganado</h1>
            <p className="font-body-md text-body-md text-on-surface-variant text-lg">
              Organiza y agrupa tus animales de forma interna para llevar un control claro.
            </p>
          </div>
          <div className="flex gap-sm w-full md:w-auto flex-col sm:flex-row mt-4 md:mt-0">
            {!isSelectionMode && (
              <Link
                href="/publicar"
                className="bg-vc-black text-vc-white font-bold font-sans rounded-lg px-6 py-3 flex items-center justify-center gap-2 hover:bg-vc-gray-dark transition-all self-start md:self-auto min-h-[56px] w-full sm:w-auto"
              >
                <span className="material-symbols-outlined text-[24px]">add</span>
                Agregar Vacas
              </Link>
            )}
            {activeTab === 'suelto' && !isSelectionMode && animals.length > 0 && (
              <button
                onClick={startSelectionMode}
                className="bg-vc-white text-vc-black border border-vc-black font-sans font-bold text-lg rounded-xl px-6 py-3 flex items-center justify-center gap-2 hover:bg-vc-gray-light transition-all self-start md:self-auto min-h-[56px] w-full sm:w-auto"
              >
                <span className="material-symbols-outlined text-[24px]">layers</span>
                Agrupar en Lote
              </button>
            )}
          </div>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="mb-md bg-primary-fixed text-on-primary-fixed border-2 border-primary rounded-xl p-md font-label-bold text-lg">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-md bg-error-container text-on-error-container border-2 border-error rounded-xl p-md font-label-bold text-lg">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex border-b border-vc-gray-light mb-8 text-lg">
          <button
            onClick={() => {
              if (isSelectionMode) cancelSelectionMode();
              setActiveTab('suelto');
            }}
            className={`px-8 py-4 font-sans font-bold text-xl transition-all border-b-4 ${
              activeTab === 'suelto'
                ? 'border-vc-black text-vc-black'
                : 'border-transparent text-vc-gray-mid hover:text-vc-black'
            }`}
          >
            Ganado Suelto ({animals.length})
          </button>
          <button
            onClick={() => {
              if (isSelectionMode) cancelSelectionMode();
              setActiveTab('lote');
            }}
            className={`px-8 py-4 font-sans font-bold text-xl transition-all border-b-4 ${
              activeTab === 'lote'
                ? 'border-vc-black text-vc-black'
                : 'border-transparent text-vc-gray-mid hover:text-vc-black'
            }`}
          >
            Mis Lotes Armados ({lots.length})
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-outline">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-md"></div>
            <p className="font-body-md text-lg">Cargando inventario...</p>
          </div>
        ) : (
          <>
            {/* Tab: Ganado Suelto */}
            {activeTab === 'suelto' && (
              <div className="space-y-lg">
                
                {/* TOOLBAR: Filters & Sorting (Accessible sizes) */}
                {animals.length > 0 && (
                  <div className="bg-vc-white rounded-xl border border-vc-gray-light p-6 space-y-4">
                    {/* Breed filters */}
                    <div className="space-y-2">
                      <span className="block font-sans text-vc-black text-base font-bold">Filtrar por Raza:</span>
                      <div className="flex flex-wrap gap-2">
                        {BREEDS.map((raza) => (
                          <button
                            key={raza}
                            onClick={() => setFilterRaza(raza)}
                            className={`px-4 py-2 rounded-full font-sans font-bold text-sm transition-colors min-h-[44px] ${
                              filterRaza === raza
                                ? 'bg-vc-black text-vc-white'
                                : 'bg-vc-white text-vc-black border border-vc-gray-mid hover:bg-vc-gray-light'
                            }`}
                          >
                            {capitalize(raza === 'TODAS' ? 'Todas' : raza)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Type filters & Sorting */}
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 pt-4 border-t border-vc-gray-light">
                      {/* Type Pills */}
                      <div className="space-y-2">
                        <span className="block font-sans text-vc-black text-base font-bold">Filtrar por Tipo:</span>
                        <div className="flex flex-wrap gap-2">
                          {TYPES.map((tipo) => (
                            <button
                              key={tipo}
                              onClick={() => setFilterTipo(tipo)}
                              className={`px-4 py-2 rounded-full font-sans font-bold text-sm transition-colors min-h-[40px] ${
                                filterTipo === tipo
                                  ? 'bg-vc-black text-vc-white'
                                  : 'bg-vc-white text-vc-black border border-vc-gray-mid hover:bg-vc-gray-light'
                              }`}
                            >
                              {capitalize(tipo === 'TODOS' ? 'Todos' : tipo)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sort Selector */}
                      <div className="flex items-center gap-2 min-h-[48px]">
                        <label htmlFor="sortBy" className="font-sans text-vc-black text-base font-bold shrink-0">Ordenar por:</label>
                        <select
                          id="sortBy"
                          value={sortBy}
                          onChange={(e: any) => setSortBy(e.target.value)}
                          className="bg-vc-white border border-vc-gray-mid focus:border-vc-black rounded-lg px-4 py-2 font-sans outline-none text-vc-black text-base cursor-pointer min-h-[48px]"
                        >
                          <option value="reciente">Más recientes primero</option>
                          <option value="antiguo">Más antiguos primero</option>
                          <option value="nombre">Nombre (A-Z)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grid */}
                {filteredAnimals.length === 0 ? (
                  <div className="bg-surface-container rounded-xl border border-outline-variant p-lg text-center text-on-surface-variant py-20">
                    <span className="material-symbols-outlined text-[64px] mb-xs">pets</span>
                    <h3 className="font-headline-md text-2xl font-bold mb-xs">No se encontraron animales</h3>
                    <p className="font-body-sm text-lg max-w-sm mx-auto">
                      Intenta cambiar los filtros o el criterio de búsqueda para ver tu ganado suelto.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
                    {filteredAnimals.map((a) => {
                      const isSelected = selectedAnimalIds.includes(a.id);
                      return (
                        <div
                          key={a.id}
                          onClick={() => isSelectionMode && handleAnimalClick(a.id)}
                          className={`relative rounded-2xl p-4 flex flex-col justify-between transition-all select-none ${
                            isSelectionMode
                              ? isSelected
                                ? 'border-4 border-vc-green bg-[#F0FAF3] shadow-md scale-[1.02] cursor-pointer'
                                : 'border-2 border-vc-gray-light hover:border-vc-gray-mid cursor-pointer bg-vc-white'
                              : 'bg-vc-white border-vc-gray-light border-2 hover:border-vc-gray-mid'
                          }`}
                        >
                          {/* Wrap the content in a Link if not in selection mode */}
                          {isSelectionMode ? null : <Link href={`/mis-lotes/vaca/${a.id}`} className="absolute inset-0" aria-label={`Ver detalles de ${a.nombre}`} />}
                          
                          <div className={isSelectionMode ? '' : 'pointer-events-none'}>
                            <div className="flex justify-between items-start mb-2">
                              <span className="bg-vc-gray-light text-vc-black px-2 py-1 rounded-lg text-sm font-bold font-sans">
                                Arete: {a.arete}
                              </span>
                              {isSelectionMode && (
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                  isSelected ? 'bg-vc-green border-vc-green text-vc-white' : 'border-vc-gray-mid bg-vc-white'
                                }`}>
                                  {isSelected && <span className="material-symbols-outlined text-[20px] font-bold">check</span>}
                                </div>
                              )}
                            </div>
                            <h3 className="font-serif text-xl font-bold mb-1 text-vc-black truncate">{a.nombre}</h3>
                            <div className="space-y-1 text-sm text-vc-gray-dark font-sans font-medium">
                              <p>Raza: {capitalize(a.raza)}</p>
                              <p>Tipo: {capitalize(a.tipo)}</p>
                            </div>
                          </div>
                          <div className="border-t border-vc-gray-light pt-2 mt-4 flex justify-between items-center">
                            <span className="font-sans text-sm text-vc-gray-dark font-bold">Peso</span>
                            <span className="font-sans text-2xl font-bold text-vc-green">{a.peso} Kg</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Mis Lotes Armados */}
            {activeTab === 'lote' && (
              <>
                {lots.length === 0 ? (
                  <div className="bg-surface-container rounded-xl border border-outline-variant p-lg text-center text-on-surface-variant py-20">
                    <span className="material-symbols-outlined text-[64px] mb-xs">layers</span>
                    <h3 className="font-headline-md text-2xl font-bold mb-xs">No tienes lotes creados</h3>
                    <p className="font-body-sm text-lg max-w-sm mx-auto">
                      Agrupa tus vacas sueltas desde la primera pestaña para armar lotes de control interno.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                    {lots.map((l) => (
                      <Link href={`/mis-lotes/lote/${l.id}`} key={l.id} className="bg-surface-container-lowest rounded-2xl border-2 border-outline-variant p-md flex flex-col justify-between hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                        <div>
                          <div className="flex justify-between items-center mb-md">
                            <span className="bg-primary-fixed text-on-primary-fixed px-sm py-xs rounded-lg text-base font-bold uppercase tracking-wider">
                              {l.categoria || 'Sin Categoría'}
                            </span>
                            <span className="text-base font-bold text-on-surface-variant flex items-center gap-xs">
                              <span className="material-symbols-outlined text-[20px]">group</span>
                              {l.cantidad} Cabezas
                            </span>
                          </div>
                          <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-md">{l.nombre}</h3>
                          
                          {/* Inside animals preview */}
                          <div className="space-y-xs bg-surface-container p-sm rounded-xl border border-outline-variant/40 mb-md max-h-[140px] overflow-y-auto">
                            <p className="font-label-sm text-base text-on-surface-variant border-b border-outline-variant/30 pb-xs mb-xs font-bold">Ganado en el lote:</p>
                            {l.animals && l.animals.map((an) => (
                              <div key={an.id} className="flex justify-between text-base text-on-surface">
                                <span>{an.nombre}</span>
                                <span className="text-on-surface-variant font-bold">#{an.arete}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-outline-variant/50 pt-sm flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-on-surface-variant">Peso Promedio</p>
                            <p className="text-xl font-bold text-on-surface">{l.peso_promedio.toFixed(1)} Kg</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-on-surface-variant">Peso Total</p>
                            <p className="text-xl font-bold text-primary">{l.peso_total.toFixed(0)} Kg</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Floating Bottom Action Bar (Modo Selección) */}
      {isSelectionMode && activeTab === 'suelto' && (
        <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t-4 border-primary shadow-2xl p-md z-40 flex items-center justify-center animate-slide-up">
          <div className="max-w-container-max w-full flex flex-col sm:flex-row justify-between items-center gap-md">
            <span className="text-xl md:text-2xl font-bold text-on-surface">
              🐄 {selectedAnimalIds.length} vacas seleccionadas
            </span>
            <div className="flex gap-sm w-full sm:w-auto">
              <button
                type="button"
                onClick={cancelSelectionMode}
                className="w-full sm:w-auto px-lg py-md border-2 border-outline rounded-xl text-lg font-bold hover:bg-surface-container transition-colors min-h-[56px]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={selectedAnimalIds.length === 0}
                className="w-full sm:w-auto px-lg py-md bg-primary text-on-primary rounded-xl text-lg font-bold hover:bg-primary-container disabled:opacity-50 transition-colors min-h-[56px]"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simplified Step 3: Nombrar y Crear Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-sm">
          <div className="bg-surface-container-lowest rounded-2xl border-2 border-outline shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
            <header className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <h2 className="font-headline-md text-2xl font-bold text-on-surface">Confirmar y Crear Grupo</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors p-2">
                <span className="material-symbols-outlined text-[28px]">close</span>
              </button>
            </header>

            <form onSubmit={handleCreateLot} className="p-md space-y-lg flex-grow overflow-y-auto">
              
              {/* Question 1: Name */}
              <div className="space-y-sm">
                <label htmlFor="lotName" className="block text-lg font-bold text-on-surface">
                  Pregunta 1: ¿Qué nombre le pondrás a este grupo? *
                </label>
                <input
                  id="lotName"
                  type="text"
                  placeholder="Ej. Vacas lecheras El Rodeo"
                  value={newLotName}
                  onChange={(e) => setNewLotName(e.target.value)}
                  className="w-full bg-surface-container border-2 border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-md py-md text-lg outline-none text-on-surface min-h-[56px]"
                  required
                />
              </div>

              {/* Question 2: Category (with quick select) */}
              <div className="space-y-sm">
                <label htmlFor="lotCategory" className="block text-lg font-bold text-on-surface">
                  Pregunta 2: Categoría del Lote (Ej. Lecheras, Levante)
                </label>
                <input
                  id="lotCategory"
                  type="text"
                  placeholder="Escribe una categoría..."
                  value={newLotCategory}
                  onChange={(e) => setNewLotCategory(e.target.value)}
                  className="w-full bg-surface-container border-2 border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-md py-md text-lg outline-none text-on-surface min-h-[56px] mb-xs"
                />

                {/* Quick Selection Category Pills */}
                {existingCategories.length > 0 && (
                  <div className="space-y-xs">
                    <span className="block text-sm text-on-surface-variant font-bold">O selecciona una existente:</span>
                    <div className="flex flex-wrap gap-xs">
                      {existingCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setNewLotCategory(cat)}
                          className="bg-surface-container hover:bg-surface-container-highest border border-outline-variant rounded-full px-sm py-xs text-base font-semibold min-h-[38px] transition-colors"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Actions */}
              <footer className="pt-lg border-t border-outline-variant/30 flex gap-md justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-lg py-md border-2 border-outline rounded-xl text-lg font-bold hover:bg-surface-container transition-colors min-h-[56px] w-full sm:w-auto"
                >
                  Regresar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-lg py-md bg-primary text-on-primary rounded-xl text-lg font-bold hover:bg-primary-container disabled:opacity-50 transition-colors min-h-[56px] w-full sm:w-auto flex items-center justify-center"
                >
                  {isSaving ? 'Guardando...' : 'Crear Lote'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
