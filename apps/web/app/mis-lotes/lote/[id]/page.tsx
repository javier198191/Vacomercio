'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../../lib/api';

export default function LoteInternalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [lot, setLot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [price, setPrice] = useState('');

  // Custom Alerts / Modals state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: '',
    categoria: ''
  });
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>([]);
  const [tempAnimals, setTempAnimals] = useState<any[]>([]);
  const [looseAnimals, setLooseAnimals] = useState<any[]>([]);

  useEffect(() => {
    if (!params?.id) return;
    setLoading(true);
    apiFetch(`/lots/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar detalle de lote');
        return res.json();
      })
      .then(data => {
        setLot(data);
        setPrice(data.precio || '');
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params?.id]);

  // Load and pre-fill form when modal is opened
  useEffect(() => {
    if (lot && isEditModalOpen) {
      setEditForm({
        nombre: lot.nombre || '',
        categoria: lot.categoria || ''
      });
      setSelectedAnimalIds(lot.animals.map((a: any) => a.id));
      setTempAnimals([...lot.animals]);

      // Fetch loose cattle for this user
      apiFetch(`/animals?userId=${lot.userId}&loteId=null`)
        .then(res => res.json())
        .then(data => {
          setLooseAnimals(data);
        })
        .catch(err => console.error('Error al cargar ganado suelto:', err));
    }
  }, [lot, isEditModalOpen]);

  const handlePublish = async () => {
    setPublishing(true);
    await apiFetch(`/lots/${params.id}/marketplace`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ en_marketplace: true, precio: Number(price) })
    });
    setPublishing(false);
    setLot({ ...lot, en_marketplace: true, precio: Number(price) });
  };

  const handleUnpublish = async () => {
    setPublishing(true);
    await apiFetch(`/lots/${params.id}/marketplace`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ en_marketplace: false })
    });
    setPublishing(false);
    setLot({ ...lot, en_marketplace: false });
  };

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false);
    try {
      const res = await apiFetch(`/lots/${params.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        router.push('/mis-lotes');
      } else {
        setErrorMessage("Ocurrió un error al eliminar el lote.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error de conexión al eliminar.");
    }
  };

  const handleRemoveAnimal = (animalId: string) => {
    setSelectedAnimalIds(prev => prev.filter(id => id !== animalId));
  };

  const handleAddAnimal = (animal: any) => {
    if (!selectedAnimalIds.includes(animal.id)) {
      setSelectedAnimalIds(prev => [...prev, animal.id]);
      setTempAnimals(prev => prev.some(a => a.id === animal.id) ? prev : [...prev, animal]);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnimalIds.length === 0) {
      setErrorMessage("El lote debe contener al menos una vaca.");
      return;
    }

    try {
      const res = await apiFetch(`/lots/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: editForm.nombre,
          categoria: editForm.categoria,
          animalIds: selectedAnimalIds
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setLot(updated);
        setPrice(updated.precio || '');
        setIsEditModalOpen(false);
      } else {
        const errData = await res.json();
        setErrorMessage(`Error al guardar: ${errData.message || 'Desconocido'}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error al guardar los cambios.");
    }
  };

  if (loading || !lot) {
    return (
      <div className="flex justify-center items-center h-screen bg-vc-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      </div>
    );
  }

  // Filter animals that are currently added to show in the list inside the form
  const animalsInLotForm = tempAnimals.filter(a => selectedAnimalIds.includes(a.id));
  const looseAnimalsFiltered = looseAnimals.filter(a => !selectedAnimalIds.includes(a.id));

  return (
    <>
      <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm z-40 sticky top-0">
        <div className="flex justify-between items-center w-full px-md h-[72px] max-w-container-max mx-auto">
          <div className="flex items-center gap-gutter">
            <Link href="/" className="text-headline-md font-headline-md font-bold text-primary">Vacomercio</Link>
            <nav className="hidden md:flex gap-gutter items-center h-full">
              <Link href="/marketplace" className="text-on-surface-variant font-label-bold text-label-bold hover:text-primary transition-colors h-full flex items-center">Marketplace</Link>
              <Link href="/mis-lotes" className="text-primary border-b-2 border-primary font-label-bold text-label-bold h-full flex items-center">Mis Lotes</Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-md py-lg pb-40">
        <Link href="/mis-lotes" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs mb-8">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-label-bold text-lg">Volver a Inventario</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="space-y-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
              <div className="flex items-center justify-between mb-sm">
                <h1 className="text-3xl font-bold text-on-surface">{lot.nombre}</h1>
                <span className="bg-primary-fixed text-on-primary-fixed px-sm py-xs rounded-lg text-base font-bold uppercase tracking-wider">
                  {lot.categoria || 'Sin Categoría'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-sm mb-md">
                <div className="bg-surface-container p-sm rounded-lg">
                  <p className="text-sm text-on-surface-variant font-bold">Cantidad</p>
                  <p className="text-xl font-bold text-on-surface">{lot.cantidad || 0} Cabezas</p>
                </div>
                <div className="bg-surface-container p-sm rounded-lg">
                  <p className="text-sm text-on-surface-variant font-bold">Peso Promedio</p>
                  <p className="text-xl font-bold text-on-surface">{(Number(lot.peso_promedio) || 0).toFixed(1)} Kg</p>
                </div>
                <div className="bg-surface-container p-sm rounded-lg">
                  <p className="text-sm text-on-surface-variant font-bold">Peso Total</p>
                  <p className="text-xl font-bold text-on-surface">{(Number(lot.peso_total) || 0).toFixed(0)} Kg</p>
                </div>
                <div className="bg-surface-container p-sm rounded-lg">
                  <p className="text-sm text-on-surface-variant font-bold">Ubicación</p>
                  <p className="text-xl font-bold text-on-surface">{lot.municipio || ''}, {lot.departamento || ''}</p>
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-sm">Animales en este Lote:</h3>
              <div className="space-y-xs bg-surface-container p-sm rounded-xl max-h-[250px] overflow-y-auto border border-outline-variant">
                {lot.animals && lot.animals.map((an: any) => (
                  <div key={an.id} className="flex justify-between items-center text-base p-xs border-b border-outline-variant/30 last:border-0">
                    <div className="flex flex-col">
                      <span className="font-medium text-on-surface">{an.nombre}</span>
                      <span className="text-sm text-on-surface-variant">{an.peso || 0} Kg • {an.raza}</span>
                    </div>
                    <span className="text-on-surface-variant font-bold text-sm bg-surface-container-lowest px-2 py-1 rounded">#{an.arete}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
              <h2 className="text-2xl font-bold mb-md text-on-surface">Estado de Publicación</h2>
              {lot.en_marketplace ? (
                <div className="bg-primary-container text-on-primary-container p-md rounded-xl border border-primary/30">
                  <div className="flex items-center gap-xs mb-sm">
                    <span className="material-symbols-outlined text-[32px] text-primary">public</span>
                    <span className="text-xl font-bold">Visible en Marketplace</span>
                  </div>
                  <p className="text-lg mb-md">Este lote se está ofreciendo actualmente por <strong>${Number(lot.precio || 0).toLocaleString('es-CO')}</strong></p>
                  {lot?.id ? (
                    <Link href={`/marketplace/lote/${lot.id}`} className="block w-full text-center bg-surface-container text-on-surface font-bold py-sm rounded-xl border border-outline hover:bg-surface-container-highest transition-colors mb-sm">
                      Ver en Marketplace
                    </Link>
                  ) : (
                    <button disabled className="block w-full text-center bg-surface-container text-on-surface-variant font-bold py-sm rounded-xl border border-outline opacity-50 cursor-not-allowed mb-sm">
                      Ver en Marketplace
                    </button>
                  )}
                  <button 
                    onClick={handleUnpublish} 
                    disabled={publishing}
                    className="bg-white text-vc-black border border-vc-black px-4 py-2 rounded-lg font-bold hover:bg-vc-gray-light w-full mt-4"
                  >
                    {publishing ? 'Actualizando...' : 'Retirar del Marketplace'}
                  </button>
                </div>
              ) : (
                <div className="bg-surface-container p-md rounded-xl border border-outline-variant">
                  <div className="flex items-center gap-xs mb-sm">
                    <span className="material-symbols-outlined text-[32px] text-on-surface-variant">visibility_off</span>
                    <span className="text-xl font-bold text-on-surface">Privado (Solo Inventario)</span>
                  </div>
                  <p className="text-lg mb-md text-on-surface-variant">Para publicar este lote en el Marketplace y recibir ofertas, ingresa el precio de venta total esperado.</p>
                  <div className="space-y-sm mb-md">
                    <label className="block text-base font-bold text-on-surface">Precio Total (COP)</label>
                    <input 
                      type="number" 
                      value={price} 
                      onChange={e => setPrice(e.target.value)} 
                      className="w-full bg-surface-container-lowest border-2 border-outline-variant rounded-lg p-sm text-xl font-bold outline-none focus:border-primary"
                      placeholder="Ej. 25000000"
                    />
                  </div>
                  <button 
                    onClick={handlePublish} 
                    disabled={publishing || !price}
                    className="w-full bg-primary text-on-primary font-bold py-sm rounded-xl hover:bg-primary-container hover:text-primary transition-colors disabled:opacity-50 text-lg"
                  >
                    {publishing ? 'Publicando...' : 'Publicar en Marketplace'}
                  </button>
                </div>
              )}
            </div>

            {/* Acciones de Gestión de Lote */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
              <h2 className="text-2xl font-bold mb-md text-on-surface">Gestión de Lote</h2>
              <p className="text-base mb-md text-on-surface-variant">Administra el nombre, la categoría o redistribuye los animales del lote.</p>
              <div className="grid grid-cols-2 gap-sm">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center justify-center gap-xs bg-blue-600 text-white font-bold py-sm rounded-xl hover:bg-blue-700 transition-colors text-base shadow-sm"
                >
                  <span className="material-symbols-outlined">edit</span>
                  Editar Lote
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center justify-center gap-xs bg-red-600 text-white font-bold py-sm rounded-xl hover:bg-red-700 transition-colors text-base shadow-sm"
                >
                  <span className="material-symbols-outlined">delete</span>
                  Eliminar Lote
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Confirmación de Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-2xl p-6 z-50 relative max-w-sm w-full text-center text-vc-black">
            <span className="material-symbols-outlined text-[64px] text-red-600 mb-4">warning</span>
            <h3 className="text-2xl font-bold mb-2">¿Estás seguro?</h3>
            <p className="text-base mb-6">
              Esta acción no se puede deshacer. El lote se disolverá y las vacas volverán a estar sueltas en tu inventario.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Error / Notificación */}
      {errorMessage && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-md border border-outline-variant shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
            <span className="material-symbols-outlined text-[64px] text-error mb-sm">error</span>
            <h3 className="text-2xl font-bold text-on-surface mb-xs">Ocurrió un inconveniente</h3>
            <p className="text-base text-on-surface-variant mb-md">{errorMessage}</p>
            <button 
              onClick={() => setErrorMessage(null)}
              className="w-full bg-primary text-on-primary font-bold py-sm rounded-xl hover:bg-primary-container hover:text-primary transition-colors text-base"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Modal de Edición de Lote */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-2xl p-6 z-50 relative max-w-lg w-full text-vc-black flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-md flex-shrink-0">
              <h3 className="text-2xl font-bold text-on-surface">Editar Lote</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-xs"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="flex-grow flex flex-col overflow-hidden space-y-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm flex-shrink-0">
                <div>
                  <label className="block text-base font-bold mb-xs text-on-surface">Nombre del Lote</label>
                  <input 
                    type="text" 
                    value={editForm.nombre}
                    onChange={e => setEditForm({ ...editForm, nombre: e.target.value })}
                    required
                    className="w-full bg-white border border-vc-gray-light rounded-lg p-3 text-base outline-none focus:border-vc-black text-vc-black"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold mb-xs text-on-surface">Categoría</label>
                  <input 
                    type="text" 
                    value={editForm.categoria}
                    onChange={e => setEditForm({ ...editForm, categoria: e.target.value })}
                    placeholder="Ej. Novillos, Vacas de Cría"
                    className="w-full bg-white border border-vc-gray-light rounded-lg p-3 text-base outline-none focus:border-vc-black text-vc-black"
                  />
                </div>
              </div>

              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-md overflow-hidden min-h-0">
                {/* Animales actuales */}
                <div className="flex flex-col overflow-hidden">
                  <h4 className="font-bold text-base mb-xs text-on-surface flex items-center justify-between">
                    <span>Vacas en este Lote ({animalsInLotForm.length})</span>
                  </h4>
                  <div className="flex-grow bg-surface-container rounded-xl border border-outline-variant p-sm overflow-y-auto space-y-xs">
                    {animalsInLotForm.length === 0 ? (
                      <p className="text-on-surface-variant text-sm text-center py-md">El lote no tiene animales asignados.</p>
                    ) : (
                      animalsInLotForm.map((an) => (
                        <div key={an.id} className="flex justify-between items-center p-xs bg-surface-container-lowest rounded-lg border border-outline-variant/30">
                          <div className="text-sm">
                            <p className="font-bold text-on-surface">{an.nombre} <span className="text-on-surface-variant text-xs">#{an.arete}</span></p>
                            <p className="text-on-surface-variant text-xs">{an.peso} Kg • {an.raza}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAnimal(an.id)}
                            className="text-error hover:bg-error-container p-xs rounded-full transition-colors flex items-center justify-center"
                            title="Quitar del Lote"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Ganado suelto disponible */}
                <div className="flex flex-col overflow-hidden">
                  <h4 className="font-bold text-base mb-xs text-on-surface">Ganado Suelto Disponible ({looseAnimalsFiltered.length})</h4>
                  <div className="flex-grow bg-surface-container rounded-xl border border-outline-variant p-sm overflow-y-auto space-y-xs">
                    {looseAnimalsFiltered.length === 0 ? (
                      <p className="text-on-surface-variant text-sm text-center py-md">No tienes más vacas sueltas disponibles.</p>
                    ) : (
                      looseAnimalsFiltered.map((an) => (
                        <div key={an.id} className="flex justify-between items-center p-xs bg-surface-container-lowest rounded-lg border border-outline-variant/30">
                          <div className="text-sm">
                            <p className="font-bold text-on-surface">{an.nombre} <span className="text-on-surface-variant text-xs">#{an.arete}</span></p>
                            <p className="text-on-surface-variant text-xs">{an.peso} Kg • {an.raza}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddAnimal(an)}
                            className="text-primary hover:bg-primary-container p-xs rounded-full transition-colors flex items-center justify-center"
                            title="Añadir al Lote"
                          >
                            <span className="material-symbols-outlined text-xl">add_circle</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-sm justify-end pt-md border-t border-outline-variant flex-shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-surface-container text-on-surface font-bold py-sm px-md rounded-xl hover:bg-surface-container-highest transition-colors text-base"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-primary text-on-primary font-bold py-sm px-md rounded-xl hover:bg-primary-container hover:text-primary transition-colors text-base"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
