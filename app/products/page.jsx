'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductListingPage from './ProductListingPage';
import ProductDetailPage from './ProductDetailPage';
import { ProductDetailSkeleton } from '@/components/shared/skeleton-loaders';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // If id query param exists, show product detail
  // Otherwise, show product listing
  if (id) {
    return (
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailPage />
      </Suspense>
    );
  }

  return <ProductListingPage />;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductListingPage />}>
      <ProductsPageContent />
    </Suspense>
  );
}
