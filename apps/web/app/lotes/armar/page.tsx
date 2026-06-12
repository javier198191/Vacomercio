'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CattleTable, CattleRow } from '@/components/lot-builder/CattleTable';
import { SelectionPanel } from '@/components/lot-builder/SelectionPanel';
import { LotSummaryBar } from '@/components/lot-builder/LotSummaryBar';
import { LocationDropdowns } from '@/components/listing/LocationDropdowns';

// ── Mock inventory ────────────────────────────────────────────────────────────
const MOCK_INVENTORY: CattleRow[] = [
  { id: 'a1', nombre: 'Toro Brahman', arete: '8492', raza: 'Brahman Comercial', peso: 450, precio: 3150000, foto_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGQ6dulItVlU2ZwPp0MoXV2ewURGwAZoq4uHqbsp2zLVu1iI8BeHeMDvtOamPk2D2ZSqs_8TPp_nfG2oLMLvsY5V8pgckeprLZN42_M_Ij58fNpkcK7joTKf1loVLPO6P8J6u3nNo6yLZE6CeYYJrrFw8_Sm95fc6uJ3jCxxYklkXu1ceIpf3R31X81WxURZl5pm9ruVwKj7jh7NbD6MbnQy5jdFeBu1A_PHxouLcaFrTFUHv8ym-S4xVtepzqANG1fSUm4I299ic', en_periodo_retiro: false },
  { id: 'a2', nombre: 'Novillo F1', arete: '8495', raza: 'Cruce Brahman x Angus', peso: 420, precio: 2940000, foto_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL-4-jaYSUTN25PWqizPPO_cmma_bTW1VkhbHWNb6HCOVAD0DBpUOFGcnVh6VOJs_0QEOx8nFjXV3xcMr8wRbw13jZTCMo6Z85ctmrQ5XFxeKHRiz7mNotSHzFuiPKOJINkG0B0XgMSyJKcInHImTXWsarCqsfZVxNaav2_v9SN56q1zB2a6rLpCec3pXzrw_OiHYmtX-li9SgU7eIOCu6L5359jotjtg2-12Zl9YMBb7OavMtm1yHP_dwkIKvUh3o7BepVILF9lY', en_periodo_retiro: false },
  { id: 'a3', nombre: 'Novillo F1', arete: '8498', raza: 'Cruce Brahman x Angus', peso: 360, precio: 2310000, foto_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBulYCxyZ2HQmuRFvfRxD5o7wj4WnyjAFQgCqI-hsiFVDklHJ1hFSLanoR7VvSLBC4v7-57UnAuXRHQdH8P3aUNOaTCKjRQDRx5uE1qgGvsE-A9LRawYFuSyfo8Ld_VdxsXAsl_LvIzKf8Wa6prGJz4SZtU4OXKYbfaaJzzPOV530CYqfGDxSq5ro-RsVkGVaNuuJiy8uut2z_L5qstkrEQxG7gdOAQZlQgstZTsHNsQrdRLuZEJe_iTDnmy-Ru7EuxT1rsnHTBGJA', en_periodo_retiro: true },
  { id: 'a4', nombre: 'Ternero', arete: '8501', raza: 'Brahman Comercial', peso: 180, precio: 1100000, foto_url: null, en_periodo_retiro: false },
  { id: 'a5', nombre: 'Ternera', arete: '8502', raza: 'Gyr', peso: 165, precio: 1050000, foto_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaHwRu2K3af5xeBKJcbrwlDfCHK8b3uA67Um1OZzlvosBNcTO5icA_sfJaXbEm22ziRDCUi3QJpOENSQ2YSFPfTG0bG5eyvO0ym3_mvit_BJBH9FJsuM1KkBEADrAFv81q5oul_8FIdDV9NLYTSiagTaWLXTLYyZY5xiM2ALgltOy1WXIvWHspBa0Tfx8jiaDiiwXZW020aLrRXUQzAUgI36T1fIJ5elbrilU', en_periodo_retiro: false },
];

export default function LotesArmarPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['a1', 'a2']));
  const [searchQuery, setSearchQuery] = useState('');
  const [lotName, setLotName] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Derived metrics
  const selectedAnimals = useMemo(
    () => MOCK_INVENTORY.filter((a) => selectedIds.has(a.id)),
    [selectedIds]
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
    if (checked) setSelectedIds(new Set(MOCK_INVENTORY.map((a) => a.id)));
    else setSelectedIds(new Set());
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!lotName.trim()) { setErrorMsg('Por favor ingresa un nombre para el lote.'); return; }
    if (!departamento || !municipio) { setErrorMsg('Por favor selecciona departamento y municipio.'); return; }
    if (hasWithdrawal) {
      setErrorMsg('⚠️ No puedes crear este lote: uno o más animales tienen período de carencia activo.');
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSuccessMsg(`✅ Lote "${lotName}" creado con ${selectedIds.size} animales y publicado en el marketplace.`);
    setSelectedIds(new Set());
    setLotName('');
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
              animals={MOCK_INVENTORY}
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
