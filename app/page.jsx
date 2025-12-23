import HomePageClient from '@/components/portfolio/HomePageClient';

const VENDOR_SLUG = process.env.NEXT_PUBLIC_VENDOR_SLUG || 'default-vendor';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_FASTAPI || 'https://v2-api.fordgeindia.online/api';

async function getPortfolioData() {
  try {
    const res = await fetch(`${API_BASE_URL}/portfolio/public/${VENDOR_SLUG}/`, {
      cache: 'force-cache', // Required for static export build-time fetching
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching portfolio for metadata:', error);
    return null;
  }
}

export async function generateMetadata() {
  const portfolio = await getPortfolioData();

  if (!portfolio) {
    return {
      title: 'Vendor Portfolio',
      description: 'Discover amazing products from our vendors.',
    };
  }

  const businessName = portfolio.name || portfolio.business_name || 'Vendor Portfolio';
  const description = portfolio.about_us || portfolio.tagline || 'Discover our products and services.';
  const bannerImage = portfolio.banner_image || '';

  return {
    title: businessName,
    description: description,
    openGraph: {
      title: businessName,
      description: description,
      images: bannerImage ? [{ url: bannerImage }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: businessName,
      description: description,
      images: bannerImage ? [bannerImage] : [],
    },
  };
}

export default function HomePage() {
  return <HomePageClient />;
}
