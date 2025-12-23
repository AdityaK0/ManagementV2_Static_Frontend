'use client';

import { Suspense } from 'react';
import ProductDetailPage from '../products/ProductDetailPage';
import { ProductDetailSkeleton } from '@/components/shared/skeleton-loaders';

export default function SingularProductPage() {
    return (
        <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetailPage />
        </Suspense>
    );
}
