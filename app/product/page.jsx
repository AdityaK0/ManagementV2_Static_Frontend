'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductDetailSkeleton } from '@/components/shared/skeleton-loaders';

function RedirectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  useEffect(() => {
    // Redirect to canonical path: /products?id=X
    if (id) {
      router.replace(`/products?id=${id}`);
    } else {
      router.replace('/products');
    }
  }, [id, router]);

  // Show loading state during redirect
  return (
    <div className="min-h-screen pt-20">
      <ProductDetailSkeleton />
    </div>
  );
}

export default function SingularProductPage() {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <RedirectContent />
    </Suspense>
  );
}
