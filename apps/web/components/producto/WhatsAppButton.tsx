'use client';

import React from 'react';

interface WhatsAppButtonProps {
  telefono: string;
  nombreComprador?: string;
  nombrePublicacion: string;
  municipioVendedor: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  telefono,
  nombreComprador,
  nombrePublicacion,
  municipioVendedor,
}) => {
  const buildWaLink = (): string => {
    const buyer = nombreComprador ? `soy ${nombreComprador} y ` : '';
    const message = `Hola, ${buyer}estoy interesado en tu publicación de ganado: "${nombrePublicacion}" ubicada en ${municipioVendedor}. Vi tu publicación en la plataforma Vacomercio.`;
    const cleanPhone = telefono.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-md z-50 flex justify-center">
      <a
        href={buildWaLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-md h-[56px] bg-primary text-on-primary rounded-lg font-label-bold text-[16px] flex items-center justify-center gap-sm hover:bg-primary-container transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined">chat</span>
        Me Interesa — Negociar por WhatsApp
      </a>
    </div>
  );
};

export default WhatsAppButton;
