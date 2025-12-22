'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components/shared/cards';
import { useTheme } from '@/context/themeContext';
import { cn } from '@/lib/utils';

export function ProductCarousel({ products = [], showStockStatus = true }) {
  const { portfolioTheme } = useTheme();
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  if (!products || products.length === 0) return null;

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused) return;

    const interval = setInterval(() => {
      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      const cardWidth = scrollContainer.firstElementChild?.clientWidth || 0;

      // If we are close to the end (within 10px), snap back to start
      if (scrollContainer.scrollLeft >= maxScrollLeft - 10) {
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Otherwise scroll one card width
        scrollContainer.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 1600); // 1.5s per scroll for a relaxed feel

    return () => clearInterval(interval);
  }, [isPaused, products.length]);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="grid grid-flow-col auto-cols-[45%] sm:auto-cols-[33.33%] lg:auto-cols-[25%] xl:auto-cols-[20%] gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 px-4 sm:px-0"
        style={{
          scrollBehavior: 'smooth',
          // Premium fade effect at edges
          // maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          // WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
        }}
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="snap-start pl-1 first:pl-2 last:pr-2 h-full"
            >
              <div className="h-full transform transition-transform duration-300 hover:scale-[1.02]">
                <ProductCard product={product} showStockStatus={showStockStatus} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Decorative navigation hints (optional, purely visual) */}
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background/10 to-transparent pointer-events-none md:hidden" />
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background/10 to-transparent pointer-events-none md:hidden" />
    </div>
  );
}
