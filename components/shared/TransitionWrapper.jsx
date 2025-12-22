'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useContext, useRef } from 'react';

// Specialized wrapper to handle App Router transitions smoothing
// We key the motion div by pathname to trigger AnimatePresence
export default function TransitionWrapper({ children }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                    duration: 0.25,
                    ease: "easeInOut"
                }}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
