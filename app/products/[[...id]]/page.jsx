import ProductListingPage from '../ProductListingPage';
import ProductDetailPage from '../ProductDetailPage';

export async function generateStaticParams() {
    return [{ id: [] }];
}

export default async function ProductsCatchAll({ params }) {
    const resolvedParams = await params;
    const idArray = resolvedParams?.id;

    // If id is present in catch-all, it means we are on a detail page
    // e.g. /products/123 -> params.id = ['123']
    if (idArray && idArray.length > 0) {
        return <ProductDetailPage />;
    }

    // Otherwise, show the listing
    return <ProductListingPage />;
}
