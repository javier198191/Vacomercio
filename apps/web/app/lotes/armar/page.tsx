'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { CattleTable, CattleRow } from '@/components/lot-builder/CattleTable';
import { SelectionPanel } from '@/components/lot-builder/SelectionPanel';
import { LotSummaryBar } from '@/components/lot-builder/LotSummaryBar';
import { LocationDropdowns } from '@/components/listing/LocationDropdowns';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const TEMP_USER_ID = 'user-1';

export default function LotesArmarPage() {
  const [inventory, setInventory] = useState<CattleRow[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [lotName, setLotName] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchInventory = async () => {
    setLoadingInventory(true);
    try {
      const res = await fetch(`${API_BASE_URL}/animals/owner/${TEMP_USER_ID}`);
      if (!res.ok) throw new Error('Error al cargar el inventario');
      const data = await res.json();
      setInventory(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error al cargar el inventario: ' + err.message);
    } finally {
      setLoadingInventory(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Derived metrics
  const selectedAnimals = useMemo(
    () => inventory.filter((a) => selectedIds.has(a.id)),
    [selectedIds, inventory]
  );
  const pesoTotal = useMemo(
    () => selectedAnimals.reduce((s, a) => s + a.peso, 0),
    [selectedAnimals]
  );
  const pesoPromedio = useMemo(
    () => (selectedAnimals.length > 0 ? pesoTotal / selectedAnimals.length : 0),
    [selectedAnimals, pesoTotal]
  );
  const precioTotal = useMemo(
    () => selectedAnimals.reduce((s, a) => s + a.precio, 0),
    [selectedAnimals]
  );
  const hasWithdrawal = useMemo(
    () => selectedAnimals.some((a) => a.en_periodo_retiro),
    [selectedAnimals]
  );

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(inventory.map((a) => a.id)));
    else setSelectedIds(new Set());
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!lotName.trim()) { setErrorMsg('Por favor ingresa un nombre para el lote.'); return; }
    if (!departamento || !municipio) { setErrorMsg('Por favor selecciona departamento y municipio.'); return; }
    if (hasWithdrawal) {
      setErrorMsg('⚠️ No puedes crear este lote: uno o más animales tienen período de carencia activo.');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        nombre: lotName,
        animalIds: Array.from(selectedIds),
        departamento,
        municipio,
        userId: TEMP_USER_ID,
        precio: precioTotal,
      };

      const res = await fetch(`${API_BASE_URL}/lots/create-dynamic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || 'Error al crear el lote dinámico.');
      }

      setSuccessMsg(`✅ Lote "${lotName}" creado con ${selectedIds.size} animales y publicado en el marketplace.`);
      setSelectedIds(new Set());
      setLotName('');
      fetchInventory();
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* NavBar */}
      <header className="bg-surface-container-lowest dark:bg-surface-container-lowest border-b border-outline-variant shadow-sm z-50 sticky top-0">
        <div className="flex justify-between items-center w-full px-md h-[72px] max-w-container-max mx-auto">
          <div className="flex items-center gap-gutter">
            <Link href="/" className="text-headline-md font-headline-md font-bold text-primary">Vacomercio</Link>
            <nav className="hidden md:flex gap-gutter items-center h-full">
              <Link href="/marketplace" className="text-on-surface-variant font-label-bold text-label-bold hover:text-primary transition-colors h-full flex items-center">Marketplace</Link>
              <Link href="/publicar" className="text-on-surface-variant font-label-bold text-label-bold hover:text-primary transition-colors h-full flex items-center">Publicar</Link>
              <Link href="/lotes/armar" className="text-primary border-b-2 border-primary font-label-bold text-label-bold h-full flex items-center">Mis Lotes</Link>
            </nav>
          </div>
          <div className="flex items-center gap-sm">
            <button className="p-sm text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-md py-lg pb-32">
        <div className="mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs hidden md:block">Loteo Dinámico</h1>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-xs md:hidden">Loteo Dinámico</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Selecciona los animales de tu inventario para crear un nuevo lote de venta.
          </p>
        </div>

        {/* Feedback messages */}
        {successMsg && (
          <div className="mb-md bg-primary-fixed text-on-primary-fixed border border-primary rounded-lg p-md font-label-bold text-label-bold">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-md bg-error-container text-on-error-container border border-error rounded-lg p-md font-label-bold text-label-bold">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Left: Inventory Table */}
          <div className="lg:col-span-2">
            <CattleTable
              animals={inventory}
              selectedIds={selectedIds}
              onToggle={handleToggle}
              onToggleAll={handleToggleAll}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Right: Config Panel + Location */}
          <div className="flex flex-col gap-gutter">
            <SelectionPanel
              selectedCount={selectedIds.size}
              lotName={lotName}
              onNameChange={setLotName}
              hasWithdrawalAnimals={hasWithdrawal}
            />
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
              <LocationDropdowns
                departamento={departamento}
                onDepartamentoChange={setDepartamento}
                municipio={municipio}
                onMunicipioChange={setMunicipio}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Summary Bar */}
      <LotSummaryBar
        selectedCount={selectedIds.size}
        pesoPromedio={pesoPromedio}
        pesoTotal={pesoTotal}
        precioTotal={precioTotal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        disabled={selectedIds.size === 0}
      />
    </>
  );
}
