'use client';

import { Suspense } from 'react';
import CollectionDetailPage from '../collections/CollectionDetailPage';
import { LoadingSpinner } from '@/components/shared/loading-states';

export default function SingularCollectionPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <CollectionDetailPage />
        </Suspense>
    );
}
