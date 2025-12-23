'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePortfolioContext } from '@/context/portfolioContext';
import ProductDetailView from '@/components/shared/ProductDetailView';
import { setProductCache } from '@/lib/productCache';
import { EmptyState } from '@/components/shared/loading-states';
import { ProductDetailSkeleton } from '@/components/shared/skeleton-loaders';

export default function ProductDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { slug } = usePortfolioContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug || !id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL_FASTAPI || 'https://v2-api.fordgeindia.online/api';
        const response = await fetch(`${baseUrl}/portfolio/public/${slug}/products/${id}/`);

        if (!response.ok) {
          throw new Error('Product not found');
        }

        const data = await response.json();
        setProduct(data);
        setProductCache(id, data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          title="Product Not Found"
          description={error || "The requested product does not exist or could not be loaded."}
        />
      </div>
    );
  }

  return <ProductDetailView product={product} />;
}
