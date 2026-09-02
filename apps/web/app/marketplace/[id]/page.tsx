'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/api';

interface AnimalDetail {
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
  user: {
    nombre: string;
    telefono: string;
  };
}

export default function MarketplaceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [animal, setAnimal] = useState<AnimalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch(`/animals/${params.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('No se pudo cargar la información del animal.');
        }
        return res.json();
      })
      .then((data) => {
        setAnimal(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('El animal solicitado no fue encontrado o está privado.');
        setLoading(false);
      });
  }, [params.id]);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-vc-white flex flex-col justify-center items-center py-20">
        <div className="animate-spin h-10 w-10 border-4 border-vc-black border-t-transparent rounded-full mb-4" />
        <p className="text-vc-black font-sans">Cargando detalles del animal...</p>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen bg-vc-white flex flex-col justify-center items-center p-4 text-center">
        <h2 className="text-2xl font-serif font-bold text-vc-black mb-4">Error al cargar</h2>
        <p className="text-vc-gray-mid mb-6">{error || 'El animal no se encuentra disponible.'}</p>
        <Link href="/marketplace" className="bg-vc-black text-vc-white px-6 py-2 rounded-lg font-bold hover:bg-vc-gray-dark transition-colors">
          Volver al Marketplace
        </Link>
      </div>
    );
  }

  const mainImageUrl = animal.foto_url ? animal.foto_url.split(',')[0] : 'https://via.placeholder.com/400x300?text=Vaca+Sin+Foto';

  const handleWhatsAppClick = () => {
    const rawPhone = animal.user?.telefono || '';
    const cleanPhone = rawPhone.replace(/\s+/g, '');
    let formattedPhone = cleanPhone;
    if (cleanPhone.length === 10 && !cleanPhone.startsWith('+')) {
      formattedPhone = '+57' + cleanPhone;
    }
    const message = `Hola ${animal.user?.nombre || 'Vendedor'}, vi tu anuncio de ${animal.nombre} (${animal.peso}kg) en Vacomercio por ${formatPrice(animal.precio)} y estoy muy interesado. ¿Podemos hablar?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
      <header className="bg-vc-white border-b border-vc-gray-light sticky top-0 z-40">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-md h-[72px] flex justify-between items-center">
          <Link href="/marketplace" className="text-vc-black hover:text-vc-gray-mid transition-colors flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Volver</span>
          </Link>
          <span className="text-xl font-bold font-serif text-vc-black">Detalle de Publicación</span>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-md py-lg grid grid-cols-1 md:grid-cols-12 gap-gutter pb-32">
        {/* Left Col - Photo */}
        <div className="md:col-span-6">
          <div className="bg-vc-gray-light rounded-xl overflow-hidden border border-vc-gray-mid aspect-video relative">
            <img src={mainImageUrl} alt={animal.nombre} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 bg-vc-black text-vc-white px-3 py-1 rounded text-sm font-bold uppercase tracking-wider">
              Disponible
            </div>
          </div>
        </div>

        {/* Right Col - Info */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-vc-white rounded-xl border border-vc-gray-mid p-6 shadow-sm space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-vc-black mb-2">{animal.nombre}</h1>
              <p className="text-lg font-sans text-vc-gray-mid">Arete: #{animal.arete}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-vc-gray-light p-3 rounded-lg border border-vc-gray-mid">
                <span className="block text-xs font-sans text-vc-gray-mid">Raza</span>
                <span className="text-lg font-sans font-bold text-vc-black">{animal.raza}</span>
              </div>
              <div className="bg-vc-gray-light p-3 rounded-lg border border-vc-gray-mid">
                <span className="block text-xs font-sans text-vc-gray-mid">Tipo</span>
                <span className="text-lg font-sans font-bold text-vc-black">{animal.tipo}</span>
              </div>
              <div className="bg-vc-gray-light p-3 rounded-lg border border-vc-gray-mid">
                <span className="block text-xs font-sans text-vc-gray-mid">Peso</span>
                <span className="text-lg font-sans font-bold text-vc-black">{animal.peso} Kg</span>
              </div>
              <div className="bg-vc-gray-light p-3 rounded-lg border border-vc-gray-mid">
                <span className="block text-xs font-sans text-vc-gray-mid">Ubicación</span>
                <span className="text-lg font-sans font-bold text-vc-black truncate">{animal.municipio}, {animal.departamento}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-vc-gray-light">
              <span className="block text-sm font-sans text-vc-gray-mid mb-1">Precio Total (COP)</span>
              <p className="text-3xl font-sans font-bold text-vc-green">{formatPrice(animal.precio)}</p>
            </div>

            <div className="pt-4 border-t border-vc-gray-light space-y-2">
              <span className="block text-sm font-sans text-vc-gray-mid">Vendedor</span>
              <p className="text-lg font-sans font-bold text-vc-black">{animal.user?.nombre || 'Ganadero Verificado'}</p>
            </div>

            <button
              onClick={handleWhatsAppClick}
              className="bg-[#25D366] text-white font-sans font-bold rounded-lg py-3 px-6 w-full hover:bg-[#20bd5a] transition-colors flex justify-center items-center gap-2 mt-6 shadow"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12.0157 2.01562C6.50567 2.01562 2.03662 6.48562 2.03662 11.9966C2.03662 13.7666 2.50262 15.4266 3.32262 16.8566L2.00062 21.6856L6.92462 20.3956C8.30762 21.1356 9.89462 21.5556 11.5846 21.5556C17.0946 21.5556 21.5656 17.0856 21.5656 11.5756C21.5656 6.06562 17.0946 2.01562 12.0157 2.01562ZM11.5846 19.9256C10.0526 19.9256 8.61862 19.5056 7.37762 18.7756L7.10662 18.6156L4.20862 19.3756L4.99362 16.5156L4.81562 16.2356C3.99562 14.9356 3.52462 13.3856 3.52462 11.7556C3.52462 7.30562 7.13562 3.69562 11.5846 3.69562C16.0336 3.69562 19.6456 7.30562 19.6456 11.7556C19.6456 16.2056 16.0336 19.9256 11.5846 19.9256ZM16.0026 13.9156C15.7596 13.7956 14.5676 13.2056 14.3466 13.1256C14.1266 13.0456 13.9666 13.0056 13.8066 13.2456C13.6456 13.4856 13.1856 14.0456 13.0456 14.2056C12.9056 14.3656 12.7656 14.3856 12.5256 14.2656C12.2846 14.1456 11.4926 13.8856 10.5566 13.0456C9.82762 12.3956 9.33662 11.5856 9.19662 11.3456C9.05662 11.1056 9.18262 10.9756 9.30362 10.8556C9.41262 10.7456 9.54462 10.5756 9.66462 10.4356C9.78462 10.2956 9.82462 10.1956 9.90462 10.0356C9.98562 9.87562 9.94562 9.73562 9.88562 9.61562C9.82462 9.49562 9.33662 8.29562 9.13662 7.80562C8.94662 7.33562 8.74662 7.39562 8.60662 7.39562C8.46662 7.38562 8.30662 7.38562 8.14662 7.38562C7.98662 7.38562 7.72562 7.44562 7.50562 7.68562C7.28462 7.92562 6.64362 8.52562 6.64362 9.74562C6.64362 10.9656 7.52562 12.1456 7.64562 12.3056C7.76662 12.4656 9.39562 14.9656 11.8956 16.0456C12.4956 16.3056 12.9656 16.4556 13.3256 16.5756C13.9256 16.7656 14.4756 16.7356 14.9056 16.6656C15.3856 16.5856 16.3866 16.0456 16.5866 15.4456C16.7866 14.8456 16.7866 14.3356 16.7256 14.2256C16.6656 14.1156 16.5056 14.0556 16.2656 13.9356L16.0026 13.9156Z" fill="white" />
              </svg>
              Contactar por WhatsApp
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
