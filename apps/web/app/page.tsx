'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/marketplace');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-container-lowest text-on-surface">
      <div className="text-center max-w-md p-lg">
        <h1 className="text-headline-lg font-bold text-primary mb-md">Vacomercio</h1>
        <p className="text-body-md text-on-surface-variant mb-lg">
          Redirigiéndote al Marketplace de ganado...
        </p>
        <Link 
          href="/marketplace" 
          className="bg-primary text-on-primary font-label-bold px-lg py-md rounded-lg shadow-md hover:opacity-90 transition-opacity"
        >
          Ir al Marketplace
        </Link>
      </div>
    </div>
  );
}
