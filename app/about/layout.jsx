import { generateAboutMetadata } from '@/lib/seo';

export async function generateMetadata() {
  try {
    const slug = process.env.NEXT_PUBLIC_VENDOR_SLUG;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_FASTAPI}/portfolio/public/${slug}/`
    );
    const portfolio = await response.json();

    return generateAboutMetadata(portfolio, slug);
  } catch (error) {
    console.error('Error generating about metadata:', error);
    return {
      title: 'About Us | Portfolio',
      description: 'Learn more about us',
    };
  }
}

export default function AboutLayout({ children }) {
  return children;
}

