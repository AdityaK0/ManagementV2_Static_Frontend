import { generateProductsListingMetadata } from '@/lib/seo';

export async function generateMetadata() {
  try {
    const slug = process.env.NEXT_PUBLIC_VENDOR_SLUG;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/`
    );
    const portfolio = await response.json();

    return generateProductsListingMetadata(portfolio, slug);
  } catch (error) {
    console.error('Error generating products listing metadata:', error);
    return {
      title: 'Products | Portfolio',
      description: 'Browse our product catalog',
    };
  }
}

export default function ProductsLayout({ children }) {
  return children;
}

