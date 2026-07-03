import React from 'react';
import Link from 'next/link';
import { PublishForm } from '@/components/listing/PublishForm';



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
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-md py-lg md:py-xl">
        <PublishForm />
      </main>
      <Footer />
    </>
  );
}
