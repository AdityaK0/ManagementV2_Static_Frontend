'use client';

import { useEffect } from 'react';
import { usePortfolioContext } from '@/context/portfolioContext';

export default function SEOManager() {
    const { portfolio } = usePortfolioContext();

    useEffect(() => {
        if (!portfolio) return;

        const businessName = portfolio.name || portfolio.business_name || 'Vendor Portfolio';
        const description = portfolio.about_us || portfolio.tagline || 'Discover our products and services.';
        const bannerImage = portfolio.banner_image || '';

        // Update Title
        document.title = businessName;

        // Update Meta Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        } else {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            metaDescription.content = description;
            document.head.appendChild(metaDescription);
        }

        // Update OpenGraph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', businessName);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', description);

        if (bannerImage) {
            const ogImage = document.querySelector('meta[property="og:image"]');
            if (ogImage) ogImage.setAttribute('content', bannerImage);
        }

        // Update Favicon (Optional but recommended)
        if (portfolio.logo) {
            const favicon = document.querySelector('link[rel="icon"]');
            if (favicon) {
                favicon.href = portfolio.logo;
            }
        }

    }, [portfolio]);

    return null;
}
