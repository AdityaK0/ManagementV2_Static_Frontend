'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-gray-100 shadow-sm rounded-2xl bg-white">
      <div className="relative aspect-square w-full bg-gray-200 animate-pulse" />
      <CardContent className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
      </CardFooter>
    </Card>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] min-h-[500px] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-16 bg-gray-300 rounded w-64 mx-auto animate-pulse" />
          <div className="h-6 bg-gray-300 rounded w-96 mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full bg-gray-200 rounded-2xl" />
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="h-8 sm:h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
          </div>

          <div className="h-12 sm:h-16 bg-gray-200 rounded w-1/4" />

          {/* Size Selector Skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/5" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-16 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-6">
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
