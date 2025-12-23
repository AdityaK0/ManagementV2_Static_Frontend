'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { EmptyState, LoadingSpinner } from '@/components/shared/loading-states';
import { useSearchParams } from 'next/navigation';
import { usePortfolioContext } from '@/context/portfolioContext';
import CollectionProductItem from './CollectionProductItem';

export default function CollectionDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { slug } = usePortfolioContext();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug || !id) return;

    const fetchCollection = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL_FASTAPI || 'https://v2-api.fordgeindia.online/api';
        const response = await fetch(`${baseUrl}/portfolio/public/${slug}/collections/${id}/`);

        if (!response.ok) {
          throw new Error('Collection not found');
        }

        const data = await response.json();
        setCollection(data);
      } catch (err) {
        console.error('Error fetching collection details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [slug, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          title="Collection Not Found"
          description={error || "The requested collection does not exist."}
        />
      </div>
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