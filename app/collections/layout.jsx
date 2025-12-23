import { generateCollectionsListingMetadata } from '@/lib/seo';

export async function generateMetadata() {
  try {
    const slug = process.env.NEXT_PUBLIC_VENDOR_SLUG;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/`
    );
    const portfolio = await response.json();

    return generateCollectionsListingMetadata(portfolio, slug);
  } catch (error) {
    console.error('Error generating collections listing metadata:', error);
    return {
      title: 'Collections | Portfolio',
      description: 'Browse our collections',
    };
  }
}

export default function CollectionsLayout({ children }) {
  return children;
}

