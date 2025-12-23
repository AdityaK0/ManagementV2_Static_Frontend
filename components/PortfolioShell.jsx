'use client';

import { useState, useEffect } from 'react';
import { PortfolioProvider } from '@/context/portfolioContext';
import { useTheme } from '@/context/themeContext';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { LoadingSpinner } from '@/components/shared/loading-states';
import { api_v1 } from '@/lib/api';

export default function PortfolioShell({ children }) {
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const { updatePortfolioTheme } = useTheme();

    const slug = process.env.NEXT_PUBLIC_VENDOR_SLUG || 'default-vendor';

    useEffect(() => {
        async function fetchPortfolio() {
            try {
                const response = await api_v1.get(`/portfolio/public/${slug}/`);
                setPortfolio(response);
                updatePortfolioTheme(response);
            } catch (error) {
                console.error('Error fetching portfolio:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPortfolio();
    }, [slug, updatePortfolioTheme]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <div className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <PortfolioProvider portfolio={portfolio} slug={slug}>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="relative flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </PortfolioProvider>
    );
}
