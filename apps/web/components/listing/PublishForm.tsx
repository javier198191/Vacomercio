'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { IndividualTab } from './IndividualTab';
import { LoteTab } from './LoteTab';
import { LocationDropdowns } from './LocationDropdowns';

const individualSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  arete: z.string().min(1, 'El número de arete es requerido'),
  raza: z.enum(['BRAHMAN', 'GYR', 'ANGUS', 'CEBU', 'CRUZADO', 'NELORE', 'SIMMENTAL'], {
    message: 'Seleccione una raza válida de la lista',
  }),
  tipo: z.enum(['NOVILLO', 'VACA', 'TORO'], {
    message: 'Seleccione un tipo de ganado válido',
  }),
  peso: z.number({ message: 'El peso debe ser un número válido' })
    .positive('El peso debe ser mayor a 0')
    .lt(1500, 'El peso debe ser menor a 1500 kg (límite biológico)'),
  precio: z.number({ message: 'El precio debe ser un número válido' })
    .positive('El precio debe ser mayor a 0'),
  foto_url: z.string().optional(),
});

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
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [individualData, setIndividualData] = useState({
    nombre: '', arete: '', raza: '', tipo: '', peso: '', precio: '', foto_url: '',
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
      setErrorMsg('Por favor seleccione departamento y municipio.');
      return;
    }
    setIsSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
    const TEMP_USER_ID = 'user-1';

    try {
      if (activeTab === 'individual') {
        const parsedPeso = parseFloat(individualData.peso);
        const parsedPrecio = parseFloat(individualData.precio);

        // Pre-validate fields using zod schema
        const validationResult = individualSchema.safeParse({
          ...individualData,
          peso: isNaN(parsedPeso) ? undefined : parsedPeso,
          precio: isNaN(parsedPrecio) ? undefined : parsedPrecio,
        });

        if (!validationResult.success) {
          const errors = validationResult.error.issues.map(err => err.message).join('\n');
          throw new Error(errors);
        }

        const formData = new FormData();
        formData.append('nombre', individualData.nombre);
        formData.append('arete', individualData.arete);
        formData.append('raza', individualData.raza);
        formData.append('tipo', individualData.tipo);
        formData.append('peso', parsedPeso.toString());
        formData.append('precio', parsedPrecio.toString());
        formData.append('userId', TEMP_USER_ID);
        
        if (selectedFile) {
          formData.append('file', selectedFile);
        } else if (individualData.foto_url) {
          formData.append('foto_url', individualData.foto_url);
        }

        const res = await fetch(`${API_BASE_URL}/animals`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Error al crear la publicación individual.');
        }
      } else {
        const cantidad = parseInt(loteData.cantidad, 10);
        const pesoPromedio = parseFloat(loteData.peso_promedio);
        const pesoTotal = pesoPromedio * cantidad;
        const precioBase = parseFloat(loteData.precio);
        const precioFinal = loteData.tipo_precio === 'kilo' ? precioBase * pesoTotal : precioBase;

        const payload = {
          nombre: loteData.nombre,
          cantidad,
          peso_promedio: pesoPromedio,
          peso_total: pesoTotal,
          precio: precioFinal,
          departamento,
          municipio,
          userId: TEMP_USER_ID,
        };

        const res = await fetch(`${API_BASE_URL}/lots`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Error al crear la publicación por lote.');
        }
      }

      setSuccessMsg('✅ Tu publicación fue enviada al marketplace. ¡Éxito!');
      setIndividualData({ nombre: '', arete: '', raza: '', tipo: '', peso: '', precio: '', foto_url: '' });
      setSelectedFile(null);
      setLoteData({ nombre: '', cantidad: '', peso_promedio: '', precio: '', tipo_precio: 'kilo' });
      setDepartamento('');
      setMunicipio('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsSubmitting(false);
    }
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

      {errorMsg && (
        <div className="mb-md bg-error-container text-on-error-container border border-error rounded-lg p-md font-label-bold text-label-bold whitespace-pre-line">
          ⚠️ {errorMsg}
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
          <IndividualTab 
            formData={individualData} 
            onChange={handleIndividualChange} 
            onFileSelect={(file, previewUrl) => {
              setSelectedFile(file);
              handleIndividualChange('foto_url', previewUrl);
            }}
          />
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
