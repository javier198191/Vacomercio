'use client';

import React, { useState } from 'react';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { IndividualTab } from './IndividualTab';
import { LoteTab } from './LoteTab';
import { LocationDropdowns } from './LocationDropdowns';

const PUBLISH_TABS = [
  { id: 'individual', label: 'Publicar Individual' },
  { id: 'lote', label: 'Publicar por Lote' },
];

export const PublishForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'individual' | 'lote'>('individual');
  const [departamento, setDepartamento] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [individualData, setIndividualData] = useState({
    nombre: '', arete: '', raza: '', peso: '', precio: '', foto_url: '',
  });

  const [loteData, setLoteData] = useState({
    nombre: '', cantidad: '', peso_promedio: '', precio: '', tipo_precio: 'kilo' as 'total' | 'kilo',
  });

  const handleIndividualChange = (field: string, value: string) => {
    setIndividualData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLoteChange = (field: string, value: string) => {
    setLoteData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departamento || !municipio) {
      alert('Por favor seleccione departamento y municipio.');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setSuccessMsg('✅ Tu publicación fue enviada al marketplace. ¡Éxito!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-md text-on-surface">
        Crear Publicación
      </h1>

      {successMsg && (
        <div className="mb-md bg-primary-fixed text-on-primary-fixed border border-primary rounded-lg p-md font-label-bold text-label-bold">
          {successMsg}
        </div>
      )}

      {/* Segmented Tab Control */}
      <Tabs
        tabs={PUBLISH_TABS}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as 'individual' | 'lote')}
        className="mb-lg"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest border border-outline-variant rounded-lg p-margin-mobile md:p-gutter shadow-sm space-y-gutter"
      >
        {/* Dynamic Tab Content */}
        {activeTab === 'individual' ? (
          <IndividualTab formData={individualData} onChange={handleIndividualChange} />
        ) : (
          <LoteTab formData={loteData} onChange={handleLoteChange} />
        )}

        {/* Shared Location Section */}
        <LocationDropdowns
          departamento={departamento}
          onDepartamentoChange={setDepartamento}
          municipio={municipio}
          onMunicipioChange={setMunicipio}
        />

        {/* Submit CTA */}
        <div className="pt-lg">
          <Button
            variant="secondary"
            fullWidth
            type="submit"
            disabled={isSubmitting}
            className="uppercase tracking-wide text-[15px]"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar en el Marketplace'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PublishForm;
