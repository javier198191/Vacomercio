'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMsg('¡Cuenta creada con éxito! Por favor, inicia sesión.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales incorrectas');
      }

      if (data.user) {
        login(data.user);
      }

      router.push('/mis-lotes');
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error al intentar iniciar sesión.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert('Próximamente: Login con Google');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 md:px-gutter">
      {/* Brand Header */}
      <div className="mb-lg text-center hidden md:block">
        <Link href="/" className="inline-flex items-center gap-base text-primary font-headline-xl font-bold tracking-tight">
          <span className="material-symbols-outlined text-[36px]">tsunami</span>
          <span>Vacomercio</span>
        </Link>
        <p className="font-body-md text-on-surface-variant mt-xs">
          Marketplace de Ganado B2B y Loteo Dinámico
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-gutter shadow-sm my-8">
        <h2 className="font-headline-md text-on-surface mb-sm text-center">
          Ingresar a tu Cuenta
        </h2>
        <p className="font-body-sm text-on-surface-variant text-center mb-gutter">
          Ingresa tus credenciales para administrar tus lotes y publicaciones.
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

        <form onSubmit={handleSubmit} className="space-y-4 bg-[#F9FAFB] border border-vc-gray-mid rounded-xl p-6 mt-6">
          <h3 className="font-sans font-bold text-lg text-vc-black block border-b border-vc-gray-light pb-2 mb-4">🔐 Datos de Ingreso</h3>
          <div>
            <label className="block font-sans font-bold text-vc-black mb-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="text"
              required
              disabled={loading}
              placeholder="admin@vacomercio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-vc-gray-mid bg-vc-white text-vc-black focus:outline-none focus:border-vc-black disabled:opacity-50 font-sans"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-sans font-bold text-vc-black" htmlFor="password">
                Contraseña
              </label>
            </div>
            <input
              id="password"
              type="password"
              required
              disabled={loading}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-vc-gray-mid bg-vc-white text-vc-black focus:outline-none focus:border-vc-black disabled:opacity-50 font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-vc-black hover:bg-vc-gray-dark text-vc-white font-sans font-bold transition-colors disabled:opacity-50 flex justify-center items-center gap-2 mt-6 shadow-sm"
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-vc-white border-t-transparent rounded-full" />
                <span>Ingresando...</span>
              </>
            ) : (
              <span>Iniciar Sesión</span>
            )}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-outline-variant"></div>
          <span className="px-3 text-on-surface-variant font-label-sm">o continuar con</span>
          <div className="flex-grow border-t border-outline-variant"></div>
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = 'http://localhost:8081/api/auth/google';
          }}
          className="bg-vc-white border border-vc-black text-vc-black font-sans font-bold rounded-lg py-3 w-full hover:bg-vc-gray-light transition-colors flex justify-center items-center gap-base"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Acceder con Google
        </button>

        <div className="mt-gutter text-center border-t border-outline-variant pt-md">
          <p className="font-body-sm text-on-surface-variant">
            ¿No tienes una cuenta?{' '}
            <Link href="/registro" className="text-primary hover:underline font-label-bold">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex justify-center items-center">Cargando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
