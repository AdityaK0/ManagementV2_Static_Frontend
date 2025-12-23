'use client';

import Image from 'next/image';
import { EmptyState, LoadingSpinner } from '@/components/shared/loading-states';
import { useParams, useSearchParams } from 'next/navigation';
import { usePortfolioContext } from '@/context/portfolioContext';
import CollectionProductItem from './CollectionProductItem';
import { useCollectionDetail } from '@/hooks/api-hooks';

export default function CollectionDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { slug } = usePortfolioContext();

  const idFromQuery = searchParams.get('id');
  const idFromArray = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const id = idFromQuery || idFromArray;

  // Fetch collection details using the API
  const { data: collection, isLoading, error } = useCollectionDetail(slug, id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !collection) {
    return (
      <EmptyState
        title="Collection Not Found"
        description="The requested collection does not exist."
      />
    );
  }

  const {
    name,
    description,
    cover_image,
    product_ids = [],
  } = collection;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* --- Collection Header --- */}
      <div className="relative h-[40vh] min-h-[300px]">
        {cover_image ? (
          <Image
            src={cover_image}
            alt={name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-neutral-800 text-gray-500">
            No cover image
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <h1 className="text-4xl font-bold mb-2">{name}</h1>
            {description && <p className="text-lg text-gray-100">{description}</p>}
          </div>
        </div>
      </div>

      {/* --- Products Grid --- */}
      <div className="container mx-auto px-4 py-8">
        {product_ids.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            {product_ids.map((product_id) => (
              <CollectionProductItem
                key={product_id}
                productId={product_id}
                slug={slug}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}