'use client';

import { useCollections } from '@/hooks/api-hooks';
import { EmptyState } from '@/components/shared/loading-states';
import { SectionSkeleton } from '@/components/shared/skeleton-loaders';
import { CollectionCard } from '@/components/shared/cards';
import Link from 'next/link';
import { usePortfolioContext } from '@/context/portfolioContext';

export default function CollectionListingPage() {
  const { slug } = usePortfolioContext();
  const { data: collections, isLoading } = useCollections(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-8" />
        <SectionSkeleton />
      </div>
    );
  }

  if (!collections?.length) {
    return (
      <EmptyState
        title="No Collections Found"
        description="This vendor has not created any collections yet."
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.id}`}
          >
            <CollectionCard collection={collection} />
          </Link>
        ))}
      </div>
    </div>
  );
}