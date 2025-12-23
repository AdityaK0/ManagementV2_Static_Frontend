'use client';

import { useState, useEffect } from 'react';
import { PortfolioProvider } from '@/context/portfolioContext';
import { useTheme } from '@/context/themeContext';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { LoadingSpinner } from '@/components/shared/loading-states';
import { api_v1 } from '@/lib/api';

import { getVendorSlug } from '@/lib/vendor';
import SEOManager from '@/components/shared/SEOManager';

export default function PortfolioShell({ children }) {
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const { updatePortfolioTheme } = useTheme();

    const [slug, setSlug] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const resolvedSlug = getVendorSlug();
        setSlug(resolvedSlug);

        async function fetchPortfolio() {
            if (!resolvedSlug) {
                setLoading(false);
                setError('Could not determine vendor from subdomain.');
                return;
            }
            try {
                const response = await api_v1.get(`/portfolio/public/${resolvedSlug}/`);
                setPortfolio(response);
                updatePortfolioTheme(response);
            } catch (error) {
                console.error('Error fetching portfolio:', error);
                setError('Vendor portfolio not found or could not be loaded.');
            } finally {
                setLoading(false);
            }
        }

        fetchPortfolio();
    }, [updatePortfolioTheme]);

    if (error || (!loading && !portfolio)) {
        return (
            <div className="flex flex-col min-h-screen">
                <div className="flex-1 flex items-center justify-center p-4 text-center">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Vendor Portfolio Not Found</h1>
                        <p className="text-muted-foreground">{error || "The requested vendor does not exist."}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <PortfolioProvider portfolio={portfolio} slug={slug} isLoading={loading}>
            <SEOManager />
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
