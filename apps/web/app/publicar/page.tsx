import React from 'react';
import Link from 'next/link';
import { PublishForm } from '@/components/listing/PublishForm';

const NavBar: React.FC = () => (
  <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm sticky top-0 w-full z-50">
    <div className="flex justify-between items-center w-full px-md h-[72px] max-w-container-max mx-auto">
      <Link href="/" className="text-headline-md font-headline-md font-bold text-primary">
        Vacomercio
      </Link>
      <nav className="hidden md:flex gap-gutter items-center">
        <Link href="/marketplace" className="font-label-bold text-label-bold text-on-surface-variant hover:text-primary transition-colors">
          Marketplace
        </Link>
        <Link href="/publicar" className="font-label-bold text-label-bold text-primary border-b-2 border-primary pb-1">
          Publicar
        </Link>
        <Link href="/lotes/armar" className="font-label-bold text-label-bold text-on-surface-variant hover:text-primary transition-colors">
          Mis Lotes
        </Link>
      </nav>
      <div className="flex gap-md text-primary items-center">
        <span className="material-symbols-outlined cursor-pointer">location_on</span>
        <span className="material-symbols-outlined cursor-pointer">settings</span>
      </div>
    </div>
  </header>
);

const Footer: React.FC = () => (
  <footer className="bg-surface-container-highest mt-auto">
    <div className="flex flex-col md:flex-row justify-between items-center w-full px-md py-lg gap-sm max-w-container-max mx-auto">
      <div className="font-bold text-primary text-headline-md">Vacomercio</div>
      <div className="flex gap-gutter items-center">
        <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Términos de Servicio</a>
        <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Contacto</a>
        <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Soporte WhatsApp</a>
      </div>
      <div className="font-body-sm text-body-sm text-on-surface-variant">
        © 2024 Vacomercio. Todos los derechos reservados.
      </div>
    </div>
  </footer>
);

export const metadata = {
  title: 'Publicar Ganado | Vacomercio',
  description: 'Publica tu ganado individual o por lote en el marketplace de Vacomercio.',
};

export default function PublicarPage() {
  return (
    <>
      <NavBar />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-md py-lg md:py-xl">
        <PublishForm />
      </main>
      <Footer />
    </>
  );
}
