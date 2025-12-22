'use client';

import Image from 'next/image';
import { EmptyState, LoadingSpinner } from '@/components/shared/loading-states';
import { use } from 'react';
import { useParams } from 'next/navigation';
import CollectionProductItem from './CollectionProductItem';
import { useCollectionDetail } from '@/hooks/api-hooks';


export default function CollectionPage({ params }) {
  const { slug, collectionSlug } = use(params);

  // Fetch collection details using the API
  const { data: collection, isLoading, error } = useCollectionDetail(slug, collectionSlug);

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
          // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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



// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import { LoadingSpinner, EmptyState } from '@/components/shared/loading-states';
// import { ProductCard } from '@/components/shared/cards';
// import api from '@/lib/api';
// import Image from 'next/image';
// import {use} from 'react';

// export default function CollectionPage({ params }) {
//   const { slug, collectionSlug } = use(params);

//   const { data: collection, isLoading } = useQuery({
//     queryKey: ['collection', slug, collectionSlug],
//     queryFn: () => api.get(`/portfolio/public/${slug}/collections/${collectionSlug}/`),
//   });

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   if (!collection) {
//     return (
//       <EmptyState
//         title="Collection Not Found"
//         description="The requested collection does not exist."
//       />
//     );
//   }

//   return (
//     <div>
//       {/* Collection Header */}
//       <div className="relative h-[40vh] min-h-[300px]">
//         <Image
//           src={collection.cover_image}
//           alt={collection.name}
//           fill
//           className="object-cover"
//           priority
//         />
//         <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//           <div className="text-center text-white p-6">
//             <h1 className="text-4xl font-bold mb-4">{collection.name}</h1>
//             <p className="text-xl">{collection.description}</p>
//           </div>
//         </div>
//       </div>

//       {/* Products Grid */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {collection.products.map((product) => (
//             <ProductCard key={product.id} product={product} slug={slug} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }