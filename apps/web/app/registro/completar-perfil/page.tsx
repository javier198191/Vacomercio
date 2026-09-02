'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { MUNICIPALITIES_BY_DEPARTMENT } from '@vacomercio/shared';

export default function CompletarPerfilPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();

  // Form states
  const [telefono, setTelefono] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [municipio, setMunicipio] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const normalizeString = (str: string) => {
    return str
      ? str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .trim()
      : '';
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('La geolocalización no está soportada por tu navegador.');
      return;
    }

    setGeoLoading(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (!res.ok) throw new Error('Error al consultar el servicio de ubicación.');
          
          const data = await res.json();
          const address = data.address;
          if (!address) throw new Error('No se pudo determinar una dirección física.');

          const state = address.state || address.region || '';
          const city = address.city || address.town || address.village || address.suburb || address.county || '';

          const normalizedState = normalizeString(state);
          const normalizedCity = normalizeString(city);

          // Find match for Departamento
          const matchDept = Object.keys(MUNICIPALITIES_BY_DEPARTMENT).find(
            (key) => normalizeString(key) === normalizedState
          );

          if (matchDept) {
            setDepartamento(matchDept);
            
            // Find match for Municipio
            const matchMuni = MUNICIPALITIES_BY_DEPARTMENT[matchDept].find(
              (muni) => normalizeString(muni) === normalizedCity
            );

            if (matchMuni) {
              setMunicipio(matchMuni);
              setSuccessMsg(`Ubicación detectada: ${matchMuni}, ${matchDept}`);
            } else {
              setMunicipio('');
              setSuccessMsg(`Departamento detectado: ${matchDept}. Por favor selecciona tu municipio manualmente.`);
            }
          } else {
            setErrorMsg(
              `No pudimos emparejar tu ubicación automáticamente (Detectado: ${city || 'Desconocido'}, ${state || 'Desconocido'}). Por favor selecciónala manualmente.`
            );
          }
        } catch (err: any) {
          setErrorMsg('No se pudo obtener la ubicación exacta. Por favor selecciona manualmente.');
          console.error(err);
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        setGeoLoading(false);
        setErrorMsg('Permiso de ubicación denegado o error de GPS.');
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await apiFetch('/auth/completar-perfil', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telefono,
          departamento,
          municipio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al completar el perfil');
      }

      // Refresh auth status so the state update propagates
      await checkAuth();

      router.push('/marketplace');
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error al intentar guardar los datos.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 md:px-gutter py-8">
      {/* Brand Header */}
      <div className="mb-lg text-center hidden md:block">
        <div className="inline-flex items-center gap-base text-primary font-headline-xl font-bold tracking-tight">
          <span className="material-symbols-outlined text-[36px]">tsunami</span>
          <span>Vacomercio</span>
        </div>
        <p className="font-body-md text-on-surface-variant mt-xs">
          Completa tu perfil para acceder al marketplace ganadero
        </p>
      </div>

      {/* Profile Card */}
      <div className="w-full max-w-lg bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-gutter shadow-sm my-4 md:my-8">
        <h2 className="font-headline-md text-on-surface mb-sm text-center">
          ¡Casi listo!
        </h2>
        <p className="font-body-sm text-on-surface-variant text-center mb-gutter">
          Completa tu perfil para empezar a comprar y vender.
        </p>

        {errorMsg && (
          <div className="mb-md bg-error-container text-on-error-container border border-error rounded-lg p-md font-label-bold text-label-bold flex items-center gap-xs">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-md bg-primary-fixed text-on-primary-fixed border border-primary rounded-lg p-md font-label-bold text-label-bold flex items-center gap-xs">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Contact Data */}
          <div className="bg-[#F9FAFB] border border-vc-gray-mid rounded-xl p-6">
            <h3 className="font-sans font-bold text-lg text-vc-black block border-b border-vc-gray-light pb-2 mb-4">📞 Datos de Contacto</h3>
            <div>
              <label className="block font-sans font-bold text-vc-black mb-1" htmlFor="telefono">
                Teléfono
              </label>
              <input
                id="telefono"
                type="tel"
                required
                disabled={loading}
                placeholder="Ej. 3001234567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-vc-gray-mid bg-vc-white text-vc-black focus:outline-none focus:border-vc-black disabled:opacity-50 font-sans"
              />
            </div>
          </div>

          {/* Location Data */}
          <div className="bg-[#F9FAFB] border border-vc-gray-mid rounded-xl p-6">
            <div className="flex justify-between items-center border-b border-vc-gray-light pb-2 mb-4">
              <h3 className="font-sans font-bold text-lg text-vc-black">📍 Ubicación</h3>
              <button
                type="button"
                onClick={handleGeolocation}
                disabled={geoLoading || loading}
                className="text-sm font-sans font-bold text-vc-black hover:text-vc-gray-dark flex items-center gap-1 disabled:opacity-50"
              >
                {geoLoading ? 'Detectando...' : '📍 Usar ubicación actual'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block font-sans font-bold text-vc-black mb-1" htmlFor="departamento">
                  Departamento
                </label>
                <select
                  id="departamento"
                  required
                  disabled={loading}
                  value={departamento}
                  onChange={(e) => {
                    setDepartamento(e.target.value);
                    setMunicipio(''); // Reset municipio when department changes
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-vc-gray-mid bg-vc-white text-vc-black focus:outline-none focus:border-vc-black disabled:opacity-50 font-sans"
                >
                  <option value="" disabled>Selecciona un departamento...</option>
                  {Object.keys(MUNICIPALITIES_BY_DEPARTMENT).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-sans font-bold text-vc-black mb-1" htmlFor="municipio">
                  Municipio
                </label>
                <select
                  id="municipio"
                  required
                  disabled={loading || !departamento}
                  value={municipio}
                  onChange={(e) => setMunicipio(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-vc-gray-mid bg-vc-white text-vc-black focus:outline-none focus:border-vc-black disabled:opacity-50 font-sans"
                >
                  <option value="" disabled>Selecciona un municipio...</option>
                  {departamento &&
                    (MUNICIPALITIES_BY_DEPARTMENT[departamento] || []).map((muni) => (
                      <option key={muni} value={muni}>
                        {muni}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-lg bg-vc-black hover:bg-vc-gray-dark text-vc-white font-sans font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4 shadow-md"
          >
            {loading ? (
              <>
                <span className="animate-spin h-6 w-6 border-2 border-vc-white border-t-transparent rounded-full" />
                <span>Guardando datos...</span>
              </>
            ) : (
              <span>Finalizar Registro</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
