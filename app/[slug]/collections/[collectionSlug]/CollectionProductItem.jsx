'use client';

import { ProductCard } from '@/components/shared/cards';
import { ProductCardSkeleton } from '@/components/shared/skeleton-loaders';
import { useProduct } from '@/hooks/api-hooks';

function CollectionProductItem({ productId, slug }) {
  const { data: product, isLoading, isError, error, isFetching } = useProduct(
    slug,
    productId,
    {
      // Only enable query if we have valid params
      enabled: !!slug && !!productId,
      // Always refetch on mount to get fresh data from backend
      refetchOnMount: true,
      // Refetch when window regains focus
      refetchOnWindowFocus: true,
      // Don't use stale data - always check with backend
      staleTime: 0,
    }
  );

  if (isLoading) return <ProductCardSkeleton />;
  if (isError || !product) return <EmptyState
    title="Product Not Found"
    description={error?.message || "The requested product does not exist or could not be loaded."}
  />;

  return <ProductCard product={product} />;
}

export default CollectionProductItem;
