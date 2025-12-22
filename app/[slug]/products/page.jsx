'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCategories } from '@/hooks/api-hooks';
import { api_v1 } from '@/lib/api';
import { usePortfolioContext } from '@/context/portfolioContext';
import { LoadingSpinner, EmptyState } from '@/components/shared/loading-states';
import { ProductCardSkeleton } from '@/components/shared/skeleton-loaders';
import { ProductCard } from '@/components/shared/cards';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function ProductsPage() {
  const { slug, portfolio } = usePortfolioContext();
  const topRef = useRef(null);
  
  // Sentinel ref for infinite scroll
  const observerElem = useRef(null);

  const { data: categories = [], isLoading: categoriesLoading } = useCategories(slug);
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    min_price: '',
    max_price: '',
    category: '',
  });

  // Temp filters (UI state)
  const [tempFilters, setTempFilters] = useState(appliedFilters);
  const [showFilters, setShowFilters] = useState(true);

  // Infinite Query for Products
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['products', slug, appliedFilters],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api_v1.get(`/portfolio/public/${slug}/products/`, {
        params: {
          page: pageParam,
          page_size: 10,
          ...appliedFilters
        },
      });
      return res;
    },
    getNextPageParam: (lastPage, allPages) => {
      // Assuming lastPage has 'total_pages'
      // If we have loaded fewer pages than total_pages, the next page is current count + 1
      const loadedPages = allPages.length;
      if (lastPage?.total_pages && loadedPages < lastPage.total_pages) {
        return loadedPages + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!slug,
    refetchOnWindowFocus: false, // Prevent refetching on scroll up/window focus as per "scrolling back up should NOT refetch" preference
    staleTime: 5 * 60 * 1000, // Keep data fresh
  });

  // Intersection Observer for Infinite Scroll
  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = observerElem.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1, // Trigger when 10% visible
    });

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [handleObserver]);

  // Scroll to top only when FILTERS change (new search context)
  useEffect(() => {
    if (topRef.current) {
        // Only scroll if we really changed filters. 
        // Note: appliedFilters change triggers this.
        topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [appliedFilters]);

  // Flatten pages into a single list of products
  const products = data?.pages?.flatMap((page) => page.results) || [];
  const showEmptyState = !isLoading && products.length === 0;

  const handleApplyFilters = (e) => {
    e?.preventDefault();
    setAppliedFilters(tempFilters);
  };

  const handleClearFilters = () => {
    const cleared = { search: '', min_price: '', max_price: '', category: '' };
    setTempFilters(cleared);
    setAppliedFilters(cleared);
  };

  const handleInputChange = (field, value) => {
    setTempFilters((prev) => ({ ...prev, [field]: value }));
  };

  const removeFilter = (field) => {
    const updated = { ...appliedFilters, [field]: '' };
    setAppliedFilters(updated);
    setTempFilters(updated);
  };

  const hasActiveFilters =
    appliedFilters.search ||
    appliedFilters.min_price ||
    appliedFilters.max_price ||
    appliedFilters.category;

  const hasUnappliedChanges =
    JSON.stringify(tempFilters) !== JSON.stringify(appliedFilters);

  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8" ref={topRef}>
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && !showFilters && (
              <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* ================= FILTER PANEL ================= */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-muted/40 backdrop-blur rounded-xl p-5 space-y-5 border mb-6">
                {/* SEARCH */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Search Products
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, description, or SKU…"
                      value={tempFilters.search}
                      onChange={(e) =>
                        handleInputChange('search', e.target.value)
                      }
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* CATEGORIES */}
                {!categoriesLoading && categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Categories
                    </label>
                    <div className="flex gap-2 overflow-x-auto ">
                      {categories.map((cat) => {
                        const active = tempFilters.category === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() =>
                              handleInputChange(
                                'category',
                                active ? '' : cat
                              )
                            }
                          className={`
                            whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium
                            transition-all duration-200 border
                            ${
                              active
                                ? "bg-primary text-primary-foreground border-primary shadow-sm scale-[1.03]"
                                : "bg-background text-foreground border-border hover:bg-muted"
                            }
                          `}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* PRICE */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Min Price
                    </label>
                    <Input
                      type="number"
                      placeholder="₹ 0"
                      value={tempFilters.min_price}
                      onChange={(e) =>
                        handleInputChange('min_price', e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Max Price
                    </label>
                    <Input
                      type="number"
                      placeholder="₹ 10000"
                      value={tempFilters.max_price}
                      onChange={(e) =>
                        handleInputChange('max_price', e.target.value)
                      }
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <Button
                      className="flex-1"
                      onClick={handleApplyFilters}
                      disabled={!hasUnappliedChanges}
                    >
                      Apply Filters
                    </Button>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        onClick={handleClearFilters}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACTIVE FILTER CHIPS */}
        {hasActiveFilters && !showFilters && (
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(appliedFilters).map(
              ([key, value]) =>
                value && (
                  <span
                    key={key}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {key}: {value}
                    <button onClick={() => removeFilter(key)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )
            )}
          </div>
        )}
      </div>

      {/* ================= PRODUCTS GRID AREA ================= */}
      <div className="min-h-[400px]">
        {isLoading ? (
            // LOADING SKELETON GRID - Avoids layout shift and unmounting header
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
               {[...Array(10)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
        ) : (
            <>
                <AnimatePresence mode="wait">
                    {showEmptyState ? (
                        <div className="col-span-full py-20">
                            <EmptyState
                                title="No Products Found"
                                description={
                                    hasActiveFilters
                                    ? 'Try adjusting your filters.'
                                    : 'No products available yet.'
                                }
                            />
                        </div>
                    ) : (
                        <motion.div
                            key={JSON.stringify(appliedFilters)} // Transition when filters change
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4"
                        >
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    showStockStatus={
                                        portfolio?.show_stock_status !== false
                                    }
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Sentinel for Infinite Scroll */}
                <div ref={observerElem} className="h-4 w-full" />

                {/* Loading More State */}
                {isFetchingNextPage && (
                    <div className="w-full py-8 text-center">
                        <LoadingSpinner />
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}



// 'use client';
// import { useState, useEffect } from 'react';
// import { useProducts } from '@/hooks/api-hooks';
// import { usePortfolioContext } from '@/context/portfolioContext';
// import { LoadingSpinner, EmptyState } from '@/components/shared/loading-states';
// import { ProductCard } from '@/components/shared/cards';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { motion, AnimatePresence } from 'framer-motion';
// import Pagination from '@/components/shared/Pagination';
// import { Search, SlidersHorizontal, X } from 'lucide-react';
// import { useCategories } from '@/hooks/api-hooks';

// export default function ProductsPage() {
//   const { slug, portfolio } = usePortfolioContext();

//   const { data: categories, isLoading: categoriesLoading } = useCategories(slug);

//   // Simplified state - single source of truth
//   const [appliedFilters, setAppliedFilters] = useState({
//     search: '',
//     min_price: '',
//     max_price: '',
//     category: ''
//   });
  
//   const [tempFilters, setTempFilters] = useState({
//     search: '',
//     min_price: '',
//     max_price: '',
//     category: ''
//   });
  
//   const [page, setPage] = useState(1);
//   const [showFilters, setShowFilters] = useState(true);

//   // Single API call with all params - much simpler!
//   const { data, isLoading, isFetching } = useProducts(slug, {
//     page,
//     search: appliedFilters.search,
//     min_price: appliedFilters.min_price,
//     max_price: appliedFilters.max_price,
//     category: appliedFilters.category,

//   });

//   // Reset page when filters change
//   useEffect(() => {
//     setPage(1);
//   }, [appliedFilters]);

//   const handleApplyFilters = (e) => {
//     e?.preventDefault();
//     setAppliedFilters(tempFilters);
//   };

//   const handleClearFilters = () => {
//     const cleared = { search: '', min_price: '', max_price: '', category: '' };
//     setTempFilters(cleared);
//     setAppliedFilters(cleared);
//   };

//   const handleInputChange = (field, value) => {
//     setTempFilters(prev => ({ ...prev, [field]: value }));
//   };

//   const removeFilter = (field) => {
//     const updated = { ...appliedFilters, [field]: '' };
//     setAppliedFilters(updated);
//     setTempFilters(updated);
//   };

//   const hasActiveFilters = appliedFilters.search || appliedFilters.min_price || appliedFilters.max_price || appliedFilters.category;
//   const hasUnappliedChanges = JSON.stringify(tempFilters) !== JSON.stringify(appliedFilters);
//   const activeFilterCount = [appliedFilters.search, appliedFilters.min_price, appliedFilters.max_price, appliedFilters.category]
//     .filter(Boolean).length;

//   if (isLoading) return <LoadingSpinner />;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header Section */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-3xl font-bold">Products</h1>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center gap-2"
//           >
//             <SlidersHorizontal className="w-4 h-4" />
//             {showFilters ? 'Hide Filters' : 'Show Filters'}
//             {hasActiveFilters && !showFilters && (
//               <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
//                 {activeFilterCount}
//               </span>
//             )}
//           </Button>
//         </div>

//         {/* Filter Panel */}
//         {showFilters && (
//           <div className="bg-muted/50 rounded-lg p-4 space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {/* Search */}
//               <div className="md:col-span-3">
//                 <label className="block text-sm font-medium mb-2">Search Products</label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search by name, description, or SKU..."
//                     value={tempFilters.search}
//                     onChange={(e) => handleInputChange('search', e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
//                     className="pl-10"
//                   />
//                 </div>
//               </div>

//               {/* Categories */}
//               {!categoriesLoading && categories?.length > 0 && (
//                 <div className="md:col-span-3">
//                   <label className="block text-sm font-medium mb-2">Categories</label>

//                   <div className="flex flex-wrap gap-2">
//                     {categories.map((cat) => {
//                       const isActive = tempFilters.category === cat;

//                       return (
//                         <button
//                           key={cat}
//                           type="button"
//                           onClick={() =>
//                             handleInputChange(
//                               'category',
//                               isActive ? '' : cat
//                             )
//                           }
//                           className={`
//                             px-3 py-1.5 rounded-full text-sm font-medium
//                             transition-all duration-200
//                             border
//                             ${
//                               isActive
//                                 ? 'bg-primary text-primary-foreground border-primary shadow-sm'
//                                 : 'bg-background text-foreground border-muted hover:bg-muted'
//                             }
//                           `}
//                         >
//                           {cat}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}




//               {/* Min Price */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">Min Price</label>
//                 <Input
//                   type="number"
//                   placeholder="₹ 0"
//                   value={tempFilters.min_price}
//                   onChange={(e) => handleInputChange('min_price', e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
//                   min="0"
//                   step="0.01"
//                 />
//               </div>

//               {/* Max Price */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">Max Price</label>
//                 <Input
//                   type="number"
//                   placeholder="₹ 10000"
//                   value={tempFilters.max_price}
//                   onChange={(e) => handleInputChange('max_price', e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
//                   min="0"
//                   step="0.01"
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div className="flex items-end gap-2">
//                 <Button 
//                   onClick={handleApplyFilters}
//                   className="flex-1"
//                   disabled={!hasUnappliedChanges}
//                 >
//                   Apply Filters
//                 </Button>
//                 {hasActiveFilters && (
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={handleClearFilters}
//                     className="flex items-center gap-2"
//                   >
//                     <X className="w-4 h-4" />
//                     Clear
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Active Filters Display */}
//         {hasActiveFilters && !showFilters && (
//           <div className="flex flex-wrap gap-2 mt-4">
//             <span className="text-sm text-muted-foreground">Active filters:</span>
//             {appliedFilters.search && (
//               <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
//                 Search: "{appliedFilters.search}"
//                 <button
//                   onClick={() => removeFilter('search')}
//                   className="hover:bg-primary/20 rounded-full p-0.5"
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </span>
//             )}
//             {appliedFilters.min_price && (
//               <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
//                 Min: ₹{appliedFilters.min_price}
//                 <button
//                   onClick={() => removeFilter('min_price')}
//                   className="hover:bg-primary/20 rounded-full p-0.5"
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </span>
//             )}
//             {appliedFilters.max_price && (
//               <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
//                 Max: ₹{appliedFilters.max_price}
//                 <button
//                   onClick={() => removeFilter('max_price')}
//                   className="hover:bg-primary/20 rounded-full p-0.5"
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </span>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Loading State */}
//       {isFetching && (
//         <div className="flex justify-center py-4">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//         </div>
//       )}

//   {/* Products Grid: responsive grid (2 cols mobile, 3 tablet, 4 desktop) */}
//   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
//         {!data?.results?.length ? (
//           <div className="col-span-full flex flex-col items-center justify-center py-20">
//             <EmptyState
//               title="No Products Found"
//               description={hasActiveFilters 
//                 ? "Try adjusting your filters to see more results." 
//                 : "No products available at the moment."}
//               className="text-center max-w-md"
//             />
//           </div>
//         ) : (
//           <AnimatePresence mode="popLayout">
//             {data.results.map((product) => (
//               <motion.div
//                 key={product.id}
//                 layout
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <ProductCard 
//                   product={product} 
//                   showStockStatus={portfolio?.show_stock_status !== false}
//                 />
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         )}
//       </div>

//       {/* Pagination */}
//       {data?.results?.length > 0 && (
//         <div className="mt-8">
//           <Pagination
//             currentPage={page}
//             totalPages={data?.total_pages || 1}
//             onPageChange={setPage}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

