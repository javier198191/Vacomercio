'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FilterBar } from '@/components/marketplace/FilterBar';
import { FeedGrid } from '@/components/marketplace/FeedGrid';
import { LocationSelector } from '@/components/marketplace/LocationSelector';
import type { FeedItem } from '@/components/marketplace/ProductCard';

// ── Shared Nav/Footer components defined inline to avoid extra files ──────────
const NavBar: React.FC = () => (
  <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm sticky top-0 w-full z-50">
    <div className="flex justify-between items-center w-full px-margin-mobile md:px-md h-[72px] max-w-container-max mx-auto">
      <div className="flex items-center gap-sm">
        <Link href="/" className="text-headline-md font-headline-md font-bold text-primary">
          Vacomercio
        </Link>
      </div>
      <nav className="hidden md:flex gap-gutter items-center h-full">
        <Link href="/marketplace" className="text-primary border-b-2 border-primary pb-1 h-full flex items-center font-label-bold text-label-bold">
          Marketplace
        </Link>
        <Link href="/publicar" className="text-on-surface-variant hover:text-primary transition-colors h-full flex items-center font-label-bold text-label-bold">
          Publicar
        </Link>
        <Link href="/lotes/armar" className="text-on-surface-variant hover:text-primary transition-colors h-full flex items-center font-label-bold text-label-bold">
          Mis Lotes
        </Link>
      </nav>
      <div className="flex items-center gap-sm">
        <LocationSelector />
      </div>
    </div>
  </header>
);

const Footer: React.FC = () => (
  <footer className="bg-surface-container-highest mt-auto w-full">
    <div className="flex flex-col md:flex-row justify-between items-center w-full px-md py-lg gap-sm max-w-container-max mx-auto">
      <div className="font-headline-md font-bold text-primary">Vacomercio</div>
      <div className="flex gap-md">
        <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors">Términos de Servicio</a>
        <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors">Contacto</a>
        <a href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors">Soporte WhatsApp</a>
      </div>
      <div className="text-on-surface-variant font-body-sm text-body-sm">
        © 2024 Vacomercio. Todos los derechos reservados.
      </div>
    </div>
  </footer>
);

// ── Mock data — replace with real API fetch ───────────────────────────────────
const MOCK_ITEMS: FeedItem[] = [
  {
    id: 'lot-1', nombre: 'Lote: Brahman x Angus', tipo: 'lote',
    areteOrLoteNumber: 'Lote: LAB01', razaOrQuantity: '15 Cabezas',
    peso: 420, precio: 2800000,
    foto_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0gi1VEFHZU8hrtfTAf9z-ChI9oxZkk0A22KJnhSqwY8XOrgu2Ay01w9tCGnIhtHASZSZYY5uwgOmzTIgyk7wg7WadM-As40gjh7ehRqQn_PUp-W-JrIOqD9Tc0wfbIv7j6fMSidzSGO_ha2F_DpiumOXssrtGUudDXYfoK9PZWNllbslpjWkPvbiIBZ_2BMIzFGSVHbjvuP_k3guP35CIIPxIfW4OHeLy34ekN1Gur77681hzVZVOoRErYJ6mfX06DxZ_CAHFdGc',
    departamento: 'Córdoba', municipio: 'Montería',
    createdAt: new Date(),
    user: { nombre: 'Hacienda El Porvenir', verificado: true, reputacion_promedio: 4.8 },
  },
  {
    id: 'lot-2', nombre: 'Terneros Levante', tipo: 'lote',
    areteOrLoteNumber: 'Lote: TL890', razaOrQuantity: '25 Cabezas',
    peso: 180, precio: 1200000,
    foto_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_swZ1Va--qggoIZ-F_U2PXP79yXYupK4-fEBcg9J3rABDsMyOIHFtgjBJm0zSSk_nify-gKGyg4KBiyUH_1A0yBxQHv-up96auIShP9tzBdh6Lh8U3Gjv3ZJXpuZCZs6LjfHGu9-mF6y-9PMl3IZKDTijppmoG21wx0Wn1Q8BErYIdQ0kwA3j4Al77kZDtUUpVP60Ux5SC5afIgh3BbRCTd-YYfq2yDmP2Ib1BrYPqat5VhX78qMTXJXIMrHZcbG_38ys15HK3PU',
    departamento: 'Antioquia', municipio: 'Caucasia',
    createdAt: new Date(),
    user: { nombre: 'Finca Los Álamos', verificado: false, reputacion_promedio: 4.2 },
  },
  {
    id: 'animal-1', nombre: 'Toro Gyr Puro', tipo: 'individual',
    areteOrLoteNumber: 'Arete: 7731', razaOrQuantity: 'Gyr',
    peso: 650, precio: 8500000,
    foto_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtcras4IIN4WJXSjzVzJhEPGAiGJkz1GDIPx7hvxmpWZDeNeF3B9IknzDHD3JpGH18amoLJs87NY8q1lPYHuoNn_A7O9ZJsTfiLEEtKLKN1pZ7j_dQOoOeGB5PRNj7N73kKUg49Srt9WJJwihy5EHS-izRcFGHvIlU0HEt5rGq5juF6hL-FGiBUVOj1FS6VGjqGHoUf4S3gmRtDYKTgAp9VPhvJtolVvnAtboC7n-aaHZFQHrmZ3yeVJx6znmcqj8Tp5HHgvA434E',
    departamento: 'Meta', municipio: 'Villavicencio',
    createdAt: new Date(),
    user: { nombre: 'Genética El Llano', verificado: true, reputacion_promedio: 5.0 },
  },
  {
    id: 'lot-3', nombre: 'Novillas Preñadas', tipo: 'lote',
    areteOrLoteNumber: 'Lote: NP302', razaOrQuantity: '10 Cabezas',
    peso: 350, precio: 3200000,
    foto_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTtoHhfz3KF8u8Wtt1uPxo5sLvMP44T4GgloLd7ogbzknqpm_igBINSbCjxjOIBzfbCWaU6vPPm25rP55YbcPhor2mUr8zFxyLmAripBv9dLvmp-Hryd4B9kk-9fnHoIB96_9UFO3cXX2ll9V-wjuSq8AIYbatUjCoUi_uToyxPZzPjD3A3O-RXWfogAvZnuV4KEbge2i6uAJccd1QRw93odIE1hlt0ugTGfuTBpUsMx5vJzE4bzLvQ2U2uOEhLzUzVyoJK38YfNo',
    departamento: 'Córdoba', municipio: 'Planeta Rica',
    createdAt: new Date(),
    user: { nombre: 'Rancho Santa Fe', verificado: true, reputacion_promedio: 4.5 },
  },
];

export default function MarketplacePage() {
  const [activeRegion, setActiveRegion] = useState('');
  const [activeDepartamento, setActiveDepartamento] = useState('');
  const [activeMunicipio, setActiveMunicipio] = useState('');
  const [activeRaza, setActiveRaza] = useState('');
  const [activePriceCategory, setActivePriceCategory] = useState('');
  const [activeTipo, setActiveTipo] = useState('');
  const [items, setItems] = useState<FeedItem[]>(MOCK_ITEMS);
  const [loading, setLoading] = useState(false);

  const fetchFeed = useCallback(async (customFilters?: {
    region?: string;
    departamento?: string;
    municipio?: string;
    raza?: string;
    priceCategory?: string;
    tipo?: string;
  }) => {
    setLoading(true);
    try {
      const filters = customFilters || {
        region: activeRegion,
        departamento: activeDepartamento,
        municipio: activeMunicipio,
        raza: activeRaza,
        priceCategory: activePriceCategory,
        tipo: activeTipo,
      };

      const params = new URLSearchParams();
      if (filters.region) params.append('region', filters.region);
      if (filters.departamento) params.append('departamento', filters.departamento);
      if (filters.municipio) params.append('municipio', filters.municipio);
      if (filters.raza) params.append('raza', filters.raza);
      if (filters.tipo) params.append('tipo', filters.tipo.toUpperCase());
      if (filters.priceCategory) params.append('priceCategory', filters.priceCategory);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
      const res = await fetch(`${API_BASE_URL}/marketplace/feed?${params.toString()}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data: FeedItem[] = await res.json();
      
      const normalizedData = data.map((item: any) => ({
        ...item,
        tipo: item.tipo.toLowerCase() as 'individual' | 'lote'
      }));
      setItems(normalizedData);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  }, [activeRegion, activeDepartamento, activeMunicipio, activeRaza, activePriceCategory, activeTipo]);

  useEffect(() => {
    fetchFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    fetchFeed();
  };

  const handleClearFilters = () => {
    setActiveRegion('');
    setActiveDepartamento('');
    setActiveMunicipio('');
    setActiveRaza('');
    setActivePriceCategory('');
    setActiveTipo('');

    fetchFeed({
      region: '',
      departamento: '',
      municipio: '',
      raza: '',
      priceCategory: '',
      tipo: '',
    });
  };

  return (
    <>
      <NavBar />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-md py-gutter">
        {/* Page heading */}
        <div className="mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface hidden md:block">
            Marketplace de Ganado
          </h1>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:hidden">
            Marketplace
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
            Ganado en venta directa de ganaderos verificados de toda Colombia.
          </p>
        </div>

        <FilterBar
          activeRegion={activeRegion}
          onRegionChange={(region) => {
            setActiveRegion(region);
            setActiveDepartamento('');
            setActiveMunicipio('');
          }}
          activeDepartamento={activeDepartamento}
          onDepartamentoChange={(dept) => {
            setActiveDepartamento(dept);
            setActiveMunicipio('');
          }}
          activeMunicipio={activeMunicipio}
          onMunicipioChange={setActiveMunicipio}
          activeRaza={activeRaza}
          onRazaChange={setActiveRaza}
          activePriceCategory={activePriceCategory}
          onPriceCategoryChange={setActivePriceCategory}
          activeTipo={activeTipo}
          onTipoChange={setActiveTipo}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        <FeedGrid items={items} loading={loading} />
      </main>
      <Footer />
    </>
  );
}
