'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/loading-states';

function RedirectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  useEffect(() => {
    // Redirect to canonical path: /collections?id=X
    if (id) {
      router.replace(`/collections?id=${id}`);
    } else {
      router.replace('/collections');
    }
  }, [id, router]);

  // Show loading state during redirect
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

export default function SingularCollectionPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RedirectContent />
    </Suspense>
  );
}
