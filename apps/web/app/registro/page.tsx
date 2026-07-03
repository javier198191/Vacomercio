'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';
import { MUNICIPALITIES_BY_DEPARTMENT } from '@vacomercio/shared';

export default function RegistroPage() {
  const router = useRouter();
  
  // States for form fields
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [municipio, setMunicipio] = useState('');
  
  // State for account type
  const [isEmpresa, setIsEmpresa] = useState(false);
  const [nit, setNit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const payload: any = {
        nombre,
        email,
        password,
        telefono,
        departamento,
        municipio,
        isEmpresa,
      };

      if (isEmpresa) {
        if (!nit || !razonSocial) {
          throw new Error('Debe proporcionar el NIT y la Razón Social de la empresa.');
        }
        payload.nit = nit;
        payload.razon_social = razonSocial;
      }

      const response = await apiFetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la cuenta');
      }

      router.push('/login?registered=true');
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error al intentar registrarse.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 md:px-gutter py-8">
      {/* Brand Header */}
      <div className="mb-lg text-center hidden md:block">
        <Link href="/" className="inline-flex items-center gap-base text-primary font-headline-xl font-bold tracking-tight">
          <span className="material-symbols-outlined text-[36px]">tsunami</span>
          <span>Vacomercio</span>
        </Link>
        <p className="font-body-md text-on-surface-variant mt-xs">
          Únete a la red ganadera más grande
        </p>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-lg bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-gutter shadow-sm my-4 md:my-8">
        <h2 className="font-headline-md text-on-surface mb-sm text-center">
          Crear una Cuenta
        </h2>
        <p className="font-body-sm text-on-surface-variant text-center mb-gutter">
          Regístrate para comprar, vender y administrar lotes de ganado.
        </p>

        {errorMsg && (
          <div className="mb-md bg-error-container text-on-error-container border border-error rounded-lg p-md font-label-bold text-label-bold flex items-center gap-xs">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Account Type Toggle */}
          <div className="bg-[#F9FAFB] border border-vc-gray-mid rounded-xl p-6">
            <h3 className="font-sans font-bold text-lg text-vc-black block border-b border-vc-gray-light pb-2 mb-4">👤 1. Tipo de cuenta</h3>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsEmpresa(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-sans font-bold border transition-colors ${!isEmpresa ? 'bg-vc-black text-vc-white border-vc-black' : 'bg-vc-white text-vc-black border-vc-gray-mid hover:bg-vc-gray-light'}`}
              >
                Persona Natural
              </button>
              <button
                type="button"
                onClick={() => setIsEmpresa(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-sans font-bold border transition-colors ${isEmpresa ? 'bg-vc-black text-vc-white border-vc-black' : 'bg-vc-white text-vc-black border-vc-gray-mid hover:bg-vc-gray-light'}`}
              >
                Empresa
              </button>
            </div>
          </div>

          <div className="bg-[#F9FAFB] border border-vc-gray-mid rounded-xl p-6">
            <h3 className="font-sans font-bold text-lg text-vc-black block border-b border-vc-gray-light pb-2 mb-4">📝 2. Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-sans font-bold text-vc-black mb-1" htmlFor="nombre">
                Nombre Completo
              </label>
              <input
                id="nombre"
                type="text"
                required
                disabled={loading}
                placeholder="Ej. Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-vc-gray-mid bg-vc-white text-vc-black focus:outline-none focus:border-vc-black disabled:opacity-50 font-sans"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-sans font-bold text-vc-black mb-1" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={loading}
                placeholder="juan@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-vc-gray-mid bg-vc-white text-vc-black focus:outline-none focus:border-vc-black disabled:opacity-50 font-sans"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-sans font-bold text-vc-black mb-1" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                disabled={loading}
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-vc-gray-mid bg-vc-white text-vc-black focus:outline-none focus:border-vc-black disabled:opacity-50 font-sans"
              />
            </div>
            
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
          </div>

          <div className="bg-[#F9FAFB] border border-vc-gray-mid rounded-xl p-6">
            <h3 className="font-sans font-bold text-lg text-vc-black block border-b border-vc-gray-light pb-2 mb-4">📍 3. Ubicación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="md:col-span-2">
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

          {/* Empresa Conditional Fields */}
          {isEmpresa && (
            <div className="bg-[#F9FAFB] border border-vc-gray-mid rounded-xl p-6">
              <h3 className="font-sans font-bold text-lg text-vc-black block border-b border-vc-gray-light pb-2 mb-4">🏢 4. Datos de la Empresa</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block font-sans font-bold text-vc-black mb-1" htmlFor="nit">
                    NIT
                  </label>
                  <input
                    id="nit"
                    type="text"
                    required={isEmpresa}
                    disabled={loading}
                    placeholder="Ej. 900123456-1"
                    value={nit}
                    onChange={(e) => setNit(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-vc-gray-mid bg-vc-white text-vc-black focus:outline-none focus:border-vc-black disabled:opacity-50 font-sans"
                  />
                </div>
                <div>
                  <label className="block font-sans font-bold text-vc-black mb-1" htmlFor="razonSocial">
                    Razón Social
                  </label>
                  <input
                    id="razonSocial"
                    type="text"
                    required={isEmpresa}
                    disabled={loading}
                    placeholder="Ej. Ganadería SAS"
                    value={razonSocial}
                    onChange={(e) => setRazonSocial(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-vc-gray-mid bg-vc-white text-vc-black focus:outline-none focus:border-vc-black disabled:opacity-50 font-sans"
                  />
                </div>
                </div>
              </div>
            )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-lg bg-vc-black hover:bg-vc-gray-dark text-vc-white font-sans font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4 shadow-md"
          >
            {loading ? (
              <>
                <span className="animate-spin h-6 w-6 border-2 border-vc-white border-t-transparent rounded-full" />
                <span>Creando cuenta...</span>
              </>
            ) : (
              <span>Crear Cuenta</span>
            )}
          </button>
        </form>

        <div className="mt-gutter text-center border-t border-outline-variant pt-md">
          <p className="font-body-sm text-on-surface-variant">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-primary hover:underline font-label-bold">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
