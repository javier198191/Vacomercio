'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';

export default function VacaInternalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [animal, setAnimal] = useState<any>(null);
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
    peso: '',
    precio: '',
    departamento: '',
    municipio: ''
  });

  useEffect(() => {
    apiFetch(`/animals/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch animal details');
        return res.json();
      })
      .then(data => {
        setAnimal(data);
        setPrice(data.precio || '');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  // Pre-fill edit form when modal opens
  useEffect(() => {
    if (animal) {
      setEditForm({
        nombre: animal.nombre || '',
        peso: animal.peso || '',
        precio: animal.precio || '',
        departamento: animal.departamento || '',
        municipio: animal.municipio || ''
      });
    }
  }, [animal, isEditModalOpen]);

  const { user } = useAuth();

  const handlePublish = async () => {
    if (!user || !user.telefono || user.telefono === 'POR_DEFINIR' || user.telefono.trim() === '') {
      setErrorMessage("Debes registrar un número de teléfono en tu perfil para poder publicar animales.");
      setTimeout(() => {
        router.push(`/perfil?redirect=/mis-lotes/vaca/${params.id}`);
      }, 1500);
      return;
    }

    setPublishing(true);
    try {
      const res = await apiFetch(`/animals/${params.id}/marketplace`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ en_marketplace: true, precio: Number(price) })
      });
      if (res.ok) {
        // Redirect to Marketplace after publishing
        router.push('/marketplace');
      } else {
        setErrorMessage("Error al publicar en el Marketplace.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error de conexión al publicar.");
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    setPublishing(true);
    try {
      const res = await apiFetch(`/animals/${params.id}/marketplace`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ en_marketplace: false })
      });
      if (res.ok) {
        const updated = await res.json();
        setAnimal(updated);
      } else {
        setErrorMessage("Error al retirar del Marketplace.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error de conexión al retirar.");
    } finally {
      setPublishing(false);
    }
  };

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false);
    try {
      const res = await apiFetch(`/animals/${params.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        router.push('/mis-lotes');
      } else {
        setErrorMessage("Ocurrió un error al eliminar el registro.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error de conexión al eliminar.");
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch(`/animals/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: editForm.nombre,
          peso: Number(editForm.peso),
          precio: Number(editForm.precio),
          departamento: editForm.departamento,
          municipio: editForm.municipio
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setAnimal(updated);
        setPrice(updated.precio || '');
        setIsEditModalOpen(false);
      } else {
        const errData = await res.json();
        setErrorMessage(`Error al guardar: ${errData.message || 'Desconocido'}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Error al guardar los cambios.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!animal) return <div className="p-8 text-center text-xl">Animal no encontrado</div>;

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
                <h1 className="text-3xl font-bold text-on-surface">{animal.nombre}</h1>
                <span className="bg-surface-container text-on-surface px-sm py-xs rounded-lg text-base font-bold">
                  Arete: #{animal.arete}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-sm">
                <div className="bg-surface-container p-sm rounded-lg">
                  <p className="text-sm text-on-surface-variant font-bold">Raza</p>
                  <p className="text-xl font-bold text-on-surface">{animal.raza}</p>
                </div>
                <div className="bg-surface-container p-sm rounded-lg">
                  <p className="text-sm text-on-surface-variant font-bold">Tipo</p>
                  <p className="text-xl font-bold text-on-surface">{animal.tipo}</p>
                </div>
                <div className="bg-surface-container p-sm rounded-lg">
                  <p className="text-sm text-on-surface-variant font-bold">Peso</p>
                  <p className="text-xl font-bold text-on-surface">{animal.peso} Kg</p>
                </div>
                <div className="bg-surface-container p-sm rounded-lg">
                  <p className="text-sm text-on-surface-variant font-bold">Ubicación</p>
                  <p className="text-xl font-bold text-on-surface">{animal.municipio}, {animal.departamento}</p>
                </div>
              </div>
              {animal.foto_url && (
                <div className="mt-md">
                  <img src={animal.foto_url.split(',')[0]} alt={animal.nombre} className="w-full h-80 object-cover rounded-xl" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
              <h2 className="text-2xl font-bold mb-md text-on-surface">Estado de Publicación</h2>
              {animal.en_marketplace ? (
                <div className="bg-white p-md rounded-xl border border-vc-gray-mid shadow-sm">
                  <div className="flex items-center gap-xs mb-sm">
                    <span className="material-symbols-outlined text-[32px] text-vc-black">public</span>
                    <span className="text-xl font-bold text-vc-black">Este animal está visible en el Marketplace</span>
                  </div>
                  <p className="text-lg mb-md text-vc-black">Este animal se está ofreciendo actualmente por <strong>${Number(animal.precio).toLocaleString('es-CO')}</strong></p>
                  <Link href={`/producto/${animal.id}`} className="block w-full text-center bg-vc-gray-light text-vc-black font-bold py-sm rounded-xl border border-vc-gray-mid hover:bg-vc-gray-mid transition-colors mb-sm">
                    Ver en Marketplace
                  </Link>
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
                  <p className="text-lg mb-md text-on-surface-variant">Para publicar este animal en el Marketplace y recibir ofertas, ingresa el precio de venta esperado.</p>
                  <div className="space-y-sm mb-md">
                    <label className="block text-base font-bold text-on-surface">Precio Total (COP)</label>
                    <input 
                      type="number" 
                      value={price} 
                      onChange={e => setPrice(e.target.value)} 
                      className="w-full bg-surface-container-lowest border-2 border-outline-variant rounded-lg p-sm text-xl font-bold outline-none focus:border-primary"
                      placeholder="Ej. 2500000"
                    />
                  </div>
                  <button 
                    onClick={handlePublish} 
                    disabled={publishing || !price}
                    className="bg-vc-black text-white px-4 py-2 rounded-lg font-bold hover:bg-vc-gray-dark w-full mt-4 disabled:opacity-50"
                  >
                    {publishing ? 'Publicando...' : 'Publicar en Marketplace'}
                  </button>
                </div>
              )}
            </div>

            {/* Acciones de Gestión Interna */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
              <h2 className="text-2xl font-bold mb-md text-on-surface">Gestión de Inventario</h2>
              <p className="text-base mb-md text-on-surface-variant">Administra la ficha del animal en tu inventario interno.</p>
              <div className="grid grid-cols-2 gap-sm">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center justify-center gap-xs bg-blue-600 text-white font-bold py-sm rounded-xl hover:bg-blue-700 transition-colors text-base shadow-sm"
                >
                  <span className="material-symbols-outlined">edit</span>
                  Editar Ficha
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center justify-center gap-xs bg-red-600 text-white font-bold py-sm rounded-xl hover:bg-red-700 transition-colors text-base shadow-sm"
                >
                  <span className="material-symbols-outlined">delete</span>
                  Eliminar Animal
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Confirmación de Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-md border border-outline-variant shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
            <span className="material-symbols-outlined text-[64px] text-error mb-sm">warning</span>
            <h3 className="text-2xl font-bold text-on-surface mb-xs">¿Estás completamente seguro?</h3>
            <p className="text-base text-on-surface-variant mb-md">
              Esta acción no se puede deshacer. El animal será eliminado de forma permanente de tu inventario.
            </p>
            <div className="flex gap-sm justify-center">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-surface-container text-on-surface font-bold py-sm px-md rounded-xl hover:bg-surface-container-highest transition-colors text-base"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="bg-error text-white font-bold py-sm px-md rounded-xl hover:bg-error-container hover:text-on-error-container transition-colors text-base"
              >
                Sí, Eliminar
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

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-2xl p-6 z-50 relative max-w-lg w-full">
            <div className="flex justify-between items-center mb-md">
              <h3 className="text-2xl font-bold text-vc-black">Editar Información del Animal</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-vc-black hover:text-vc-gray-dark p-xs"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-sm">
              <div>
                <label className="block text-base font-bold mb-xs text-vc-black">Nombre</label>
                <input 
                  type="text" 
                  value={editForm.nombre}
                  onChange={e => setEditForm({ ...editForm, nombre: e.target.value })}
                  required
                  className="border border-vc-gray-mid rounded-md p-2 w-full bg-white text-vc-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="block text-base font-bold mb-xs text-vc-black">Peso (Kg)</label>
                  <input 
                    type="number" 
                    value={editForm.peso}
                    onChange={e => setEditForm({ ...editForm, peso: e.target.value })}
                    required
                    className="border border-vc-gray-mid rounded-md p-2 w-full bg-white text-vc-black"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold mb-xs text-vc-black">Precio (COP)</label>
                  <input 
                    type="number" 
                    value={editForm.precio}
                    onChange={e => setEditForm({ ...editForm, precio: e.target.value })}
                    required
                    className="border border-vc-gray-mid rounded-md p-2 w-full bg-white text-vc-black"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="block text-base font-bold mb-xs text-vc-black">Departamento</label>
                  <input 
                    type="text" 
                    value={editForm.departamento}
                    onChange={e => setEditForm({ ...editForm, departamento: e.target.value })}
                    required
                    className="border border-vc-gray-mid rounded-md p-2 w-full bg-white text-vc-black"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold mb-xs text-vc-black">Municipio</label>
                  <input 
                    type="text" 
                    value={editForm.municipio}
                    onChange={e => setEditForm({ ...editForm, municipio: e.target.value })}
                    required
                    className="border border-vc-gray-mid rounded-md p-2 w-full bg-white text-vc-black"
                  />
                </div>
              </div>
              <div className="flex gap-sm justify-end pt-md">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-vc-gray-light text-vc-black font-bold py-2 px-4 rounded-lg hover:bg-vc-gray-mid transition-colors text-base"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-vc-black text-white font-bold py-2 px-4 rounded-lg hover:bg-vc-gray-dark transition-colors text-base"
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
