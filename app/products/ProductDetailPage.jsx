'use client';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { usePortfolioContext } from '@/context/portfolioContext';
import { useProduct } from '@/hooks/api-hooks';
import ProductDetailView from '@/components/shared/ProductDetailView';
import { setProductCache } from '@/lib/productCache';
import { EmptyState } from '@/components/shared/loading-states';
import { ProductDetailSkeleton } from '@/components/shared/skeleton-loaders';

export default function ProductPageClient({ initialProduct }) {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { slug, portfolio } = usePortfolioContext();


  const effectiveSlug = slug;

  // Validate that we have both slug and id before making the query
  const isValid = effectiveSlug && id;

  // Use React Query for proper data fetching with caching and refetching
  // This will always fetch fresh data from backend, even on refresh
  const { data: product, isLoading, isError, error, isFetching } = useProduct(
    effectiveSlug,
    id,
    {
      enabled: !!isValid,
      refetchOnMount: true,
      // Refetch when window regains focus
      refetchOnWindowFocus: true,
      // Don't use stale data - always check with backend
      staleTime: 0,
      // Use server data initially if available
      initialData: initialProduct,
    }
  );

  // Cache the product when it's fetched (for quick navigation)
  useEffect(() => {
    if (product && id) {
      setProductCache(id, product);
    }
  }, [product, id]);

  // Show loading state (including when fetching or slug/id not ready)
  if (!isValid || (!product && isLoading)) {
    return (
      <div className="min-h-screen pt-20">
        <ProductDetailSkeleton />
      </div>
    );
  }

  // Show error state
  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          title="Product Not Found"
          description={error?.message || "The requested product does not exist or could not be loaded."}
        />
      </div>
    );
  }

  return <ProductDetailView product={product} />;
}

