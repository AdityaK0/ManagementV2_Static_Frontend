'use client';

import Image from 'next/image';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { setProductCache } from '@/lib/productCache';
import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// import { PRODUCT_ENCODE } from '@/lib/productEncoder';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ProductCard({ product, showStockStatus = true }) {
  const {
    name,
    images = [],
    price,
    category_name,
    is_in_stock,
    is_low_stock,
  } = product;
  const router = useRouter();

  const [current, setCurrent] = useState(0);

  const hasImages = images && images.length > 0;
  const nextImage = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  const handleClick = () => {
    // Store product in memory
    setProductCache(product.id, product);

    // Navigate using query parameters
    router.push(`/product?id=${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer block group h-full"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="relative h-full"
      >
        <Card className="overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg bg-card h-full flex flex-col">
          {/* --- Image / Carousel --- */}
          <div className="relative aspect-square w-full overflow-hidden bg-muted">
            {hasImages ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={images[current]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    {images && images[current] ? (
                      <Image
                        src={images[current]}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : null}
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls - Only visible on desktop hover */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 items-center justify-center"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-3 h-3 text-black" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 items-center justify-center"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-3 h-3 text-black" />
                    </button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                      {images.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1 w-1 rounded-full transition-all shadow-sm ${idx === current ? 'bg-white w-2' : 'bg-white/60'
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-muted text-muted-foreground text-[10px]">
                No Image
              </div>
            )}

            {/* Stock badge overlay - Ultra minimal */}
            {showStockStatus && !is_in_stock && (
              <div className="absolute top-2 right-2 z-10">
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  Out
                </span>
              </div>
            )}
            {showStockStatus && is_in_stock && is_low_stock && (
              <div className="absolute top-2 right-2 z-10">
                <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  Low
                </span>
              </div>
            )}
          </div>

          {/* --- Product Info --- */}
          <CardContent className="p-2.5 flex-1 flex flex-col gap-1.5">
            {/* Name */}
            <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2 min-h-[2.5em]">
              {name}
            </h3>

            {/* Price - Single line, bold */}
            <div className="mt-auto pt-1 flex items-center justify-between">
              {price && (
                <p className="text-sm font-bold text-foreground">
                  ₹{typeof price === 'number' ? price.toLocaleString('en-IN') : price}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}



export function CollectionCard({ collection }) {
  const { name, cover_image, product_ids } = collection;
  const router = useRouter();

  return (
    <motion.div
      onClick={() => router.push(`/collection?id=${collection.id}`)}
      className="cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative aspect-[16/9]">
            {/* <Image
              src={cover_image_url}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            /> */}

            {cover_image ? (
              <Image
                src={cover_image}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                <span>No Image Available</span>
              </div>
            )}



          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">
            {product_ids.length} {product_ids.length === 1 ? 'Product' : 'Products'}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TestimonialCard({ testimonial }) {
  const { name, image, rating, message } = testimonial;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12">
              <Image
                src={image}
                alt={name}
                fill
                className="rounded-full object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <h4 className="font-semibold">{name}</h4>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'fill-current' : 'fill-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}




// export function ProductCard({ product }) {
//   const { name, images, price, category, in_stock } = product;
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ scale: 1.02 }}
//       transition={{ duration: 0.2 }}
//     >
//       <Card className="overflow-hidden">
//         <CardHeader className="p-0">
//           <div className="relative aspect-square">
//             {images && images.length > 0 ? (
//               <Image
//                 src={images[0]}
//                 alt={name}
//                 fill
//                 className="object-cover"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//               />
//             ) : (
//               <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
//                 <span>No Image Available</span>
//               </div>
//             )}
//           </div>

//         </CardHeader>
//         <CardContent className="p-4">
//           <div className="flex justify-between items-start">
//             <div>
//               <h3 className="font-semibold">{name}</h3>
//               <p className="text-sm text-muted-foreground">{category}</p>
//             </div>
//             <Badge variant={in_stock ? 'default' : 'secondary'}>
//               {in_stock ? 'In Stock' : 'Out of Stock'}
//             </Badge>
//           </div>
//         </CardContent>
//         <CardFooter className="p-4 pt-0">
//           <p className="text-lg font-bold">${price}</p>
//         </CardFooter>
//       </Card>
//     </motion.div>
//   );
// }
