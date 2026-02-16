import { Suspense } from 'react';
import Catalog from '@/components/CatalogPage';
import { CatalogPageLoader } from '@/components/ui/loaders';

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogPageLoader />}>
      <Catalog />
    </Suspense>
  );
}
