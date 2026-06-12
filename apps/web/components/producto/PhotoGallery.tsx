'use client';

import React, { useState } from 'react';

interface PhotoGalleryProps {
  photos: string[];
  altText?: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, altText = 'Foto del ganado' }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
        <div className="aspect-video bg-surface-container flex flex-col items-center justify-center text-outline">
          <span className="material-symbols-outlined text-[64px]">image</span>
          <p className="font-body-sm text-body-sm mt-sm">Sin fotos disponibles</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
      {/* Main Image */}
      <div className="aspect-video bg-surface-container relative">
        <img
          src={photos[activeIndex]}
          alt={`${altText} ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />
        {/* Photo counter */}
        <div className="absolute bottom-4 right-4 bg-inverse-surface/80 text-inverse-on-surface px-sm py-xs rounded-lg backdrop-blur-sm font-label-bold text-label-bold flex items-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">photo_library</span>
          {activeIndex + 1}/{photos.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {photos.length > 1 && (
        <div className="flex gap-sm p-sm overflow-x-auto gallery-scroll bg-surface-bright">
          {photos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`flex-shrink-0 w-24 aspect-video rounded-lg overflow-hidden transition-all ${
                idx === activeIndex
                  ? 'border-2 border-primary'
                  : 'border border-outline-variant hover:border-primary opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={photo}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default PhotoGallery;
