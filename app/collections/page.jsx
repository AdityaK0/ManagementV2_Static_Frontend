'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CollectionListingPage from './CollectionListingPage';
import CollectionDetailPage from './CollectionDetailPage';
import { LoadingSpinner } from '@/components/shared/loading-states';

function CollectionsPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // If id query param exists, show collection detail
  // Otherwise, show collection listing
  if (id) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <CollectionDetailPage />
      </Suspense>
    );
  }

  return <CollectionListingPage />;
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<CollectionListingPage />}>
      <CollectionsPageContent />
    </Suspense>
  );
}
