'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { MUNICIPALITIES_BY_DEPARTMENT } from '@vacomercio/shared';

function PerfilForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const { user, checkAuth, loading: authLoading } = useAuth();

  // Form State
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [municipio, setMunicipio] = useState('');

  // UI States
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setFetching(true);
        const res = await apiFetch('/auth/me');
        if (res.ok) {
          const data = await res.json();
          setNombre(data.nombre || '');
          setEmail(data.email || '');
          setTelefono(data.telefono && data.telefono !== 'POR_DEFINIR' ? data.telefono : '');
          setDepartamento(data.departamento && data.departamento !== 'POR_DEFINIR' ? data.departamento : '');
          setMunicipio(data.municipio && data.municipio !== 'POR_DEFINIR' ? data.municipio : '');
        } else {
          setErrorMsg('No se pudo cargar la información del perfil.');
        }
      } catch (err: any) {
        console.error('Error al obtener perfil:', err);
        setErrorMsg('Error de conexión al cargar el perfil.');
      } finally {
        setFetching(false);
      }
    };

    loadUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!telefono.trim()) {
      setErrorMsg('El número de teléfono es obligatorio.');
      setSaving(false);
      return;
    }

    if (!departamento || !municipio) {
      setErrorMsg('Por favor selecciona tu departamento y municipio.');
      setSaving(false);
      return;
    }

    try {
      const res = await apiFetch('/auth/completar-perfil', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          telefono: telefono.trim(),
          departamento,
          municipio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al guardar el perfil.');
      }

      await checkAuth();

      if (redirectParam) {
        router.push(redirectParam);
      } else {
        setSuccessMsg('Datos actualizados');
        setIsEditing(false); // Go back to read mode
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Ocurrió un error al actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (fetching || authLoading) {
    return (
      <div className="min-h-screen bg-vc-white flex flex-col justify-center items-center py-20">
        <div className="animate-spin h-10 w-10 border-4 border-vc-black border-t-transparent rounded-full mb-4" />
        <p className="text-vc-black font-sans font-bold">Cargando información del perfil...</p>
      </div>
    );
  }

  return (
    <>
      <header className="bg-vc-white border-b border-vc-gray-light sticky top-0 z-40">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-md h-[72px] flex justify-between items-center">
          <Link href="/marketplace" className="text-vc-black hover:text-vc-gray-mid transition-colors flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Volver</span>
          </Link>
          <span className="text-xl font-bold font-serif text-vc-black">Mi Perfil</span>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="min-h-[80vh] bg-vc-white py-10 px-4">
        <div className="max-w-xl mx-auto bg-white text-vc-black shadow-lg rounded-xl border border-vc-gray-mid p-6 md:p-8">
          <div className="flex justify-between items-center mb-8 border-b border-vc-gray-light pb-6">
            <div className="text-left flex flex-col">
              <div className="w-20 h-20 bg-vc-black text-vc-white rounded-full flex items-center justify-center mb-4 text-3xl font-serif font-bold shadow-md">
                {nombre ? nombre.charAt(0).toUpperCase() : 'U'}
              </div>
              <h1 className="text-2xl font-serif font-bold text-vc-black">{isEditing ? 'Editar Mi Perfil' : 'Mi Perfil'}</h1>
              <p className="text-sm font-sans text-vc-gray-mid mt-1">
                Mantén tus datos actualizados para que los compradores puedan contactarte por WhatsApp.
              </p>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                type="button"
                className="bg-vc-gray-light hover:bg-vc-gray-mid p-3 rounded-full transition-colors flex items-center justify-center self-start"
                title="Editar perfil"
              >
                <span className="material-symbols-outlined text-vc-black">edit</span>
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="mb-6 bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 font-sans text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">warning</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 bg-green-50 text-green-800 border border-green-200 rounded-lg p-4 font-sans text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre Completo */}
            <div>
              <label className="block font-sans font-bold text-vc-black mb-1" htmlFor="nombre">
                Nombre Completo
              </label>
              {isEditing ? (
                <input
                  id="nombre"
                  type="text"
                  required
                  disabled={saving}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full px-4 py-3 rounded-lg border border-vc-gray-mid bg-white text-vc-black focus:outline-none focus:border-vc-black disabled:opacity-50 font-sans"
                />
              ) : (
                <p className="w-full px-4 py-3 rounded-lg bg-vc-gray-light text-vc-black font-sans">{nombre || 'No especificado'}</p>
              )}
            </div>

            {/* Correo Electrónico (Solo Lectura) */}
            <div>
              <label className="block font-sans font-bold text-vc-gray-mid mb-1" htmlFor="email">
                Correo Electrónico (Solo Lectura)
              </label>
              <input
                id="email"
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-3 rounded-lg border border-vc-gray-light bg-vc-gray-light text-vc-gray-mid cursor-not-allowed font-sans"
              />
              <span className="text-xs text-vc-gray-mid mt-1 block">
                El correo está vinculado a tu cuenta de acceso y no puede ser modificado.
              </span>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block font-sans font-bold text-vc-black mb-1" htmlFor="telefono">
                Teléfono de Contacto (WhatsApp)
                {!telefono && <span className="text-red-600 font-bold ml-2">(REQUERIDO)</span>}
              </label>
              {isEditing ? (
                <input
                  id="telefono"
                  type="tel"
                  required
                  disabled={saving}
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej. 3001234567"
                  className="w-full px-4 py-3 rounded-lg border border-vc-gray-mid bg-white text-vc-black focus:outline-none focus:border-vc-black disabled:opacity-50 font-sans"
                />
              ) : (
                <p className="w-full px-4 py-3 rounded-lg bg-vc-gray-light text-vc-black font-sans">{telefono || 'No especificado'}</p>
              )}
            </div>

            {/* Ubicación: Departamento */}
            <div>
              <label className="block font-sans font-bold text-vc-black mb-1" htmlFor="departamento">
                Departamento
                {!departamento && <span className="text-red-600 font-bold ml-2">(REQUERIDO)</span>}
              </label>
              {isEditing ? (
                <select
                  id="departamento"
                  required
                  disabled={saving}
                  value={departamento}
                  onChange={(e) => {
                    setDepartamento(e.target.value);
                    setMunicipio('');
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-vc-gray-mid bg-white text-vc-black focus:outline-none focus:border-vc-black disabled:opacity-50 font-sans"
                >
                  <option value="" disabled>Selecciona un departamento...</option>
                  {Object.keys(MUNICIPALITIES_BY_DEPARTMENT).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="w-full px-4 py-3 rounded-lg bg-vc-gray-light text-vc-black font-sans">{departamento || 'No especificado'}</p>
              )}
            </div>

            {/* Ubicación: Municipio */}
            <div>
              <label className="block font-sans font-bold text-vc-black mb-1" htmlFor="municipio">
                Municipio
                {!municipio && <span className="text-red-600 font-bold ml-2">(REQUERIDO)</span>}
              </label>
              {isEditing ? (
                <select
                  id="municipio"
                  required
                  disabled={saving || !departamento}
                  value={municipio}
                  onChange={(e) => setMunicipio(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-vc-gray-mid bg-white text-vc-black focus:outline-none focus:border-vc-black disabled:opacity-50 font-sans"
                >
                  <option value="" disabled>Selecciona un municipio...</option>
                  {departamento &&
                    (MUNICIPALITIES_BY_DEPARTMENT[departamento] || []).map((muni) => (
                      <option key={muni} value={muni}>
                        {muni}
                      </option>
                    ))}
                </select>
              ) : (
                <p className="w-full px-4 py-3 rounded-lg bg-vc-gray-light text-vc-black font-sans">{municipio || 'No especificado'}</p>
              )}
            </div>

            {/* Submit Button */}
            {isEditing && (
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="w-1/3 py-4 rounded-lg bg-vc-gray-light hover:bg-vc-gray-mid text-vc-black font-sans font-bold text-lg transition-colors disabled:opacity-50 flex justify-center items-center shadow-md border border-vc-gray-mid"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-2/3 py-4 rounded-lg bg-vc-black hover:bg-vc-gray-dark text-vc-white font-sans font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-md"
                >
                  {saving ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-vc-white border-t-transparent rounded-full" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Cambios</span>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
    </>
  );
}

export default function PerfilPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-vc-white flex justify-center items-center py-20">
        <div className="animate-spin h-10 w-10 border-4 border-vc-black border-t-transparent rounded-full" />
      </div>
    }>
      <PerfilForm />
    </Suspense>
  );
}
