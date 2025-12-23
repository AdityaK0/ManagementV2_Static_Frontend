import CollectionListingPage from '../CollectionListingPage';
import CollectionDetailPage from '../CollectionDetailPage';

export async function generateStaticParams() {
    return [{ id: [] }];
}

export default async function CollectionsCatchAll({ params }) {
    const resolvedParams = await params;
    const idArray = resolvedParams?.id;

    // If id is present in catch-all, it means we are on a detail page
    if (idArray && idArray.length > 0) {
        return <CollectionDetailPage />;
    }

    // Otherwise, show the listing
    return <CollectionListingPage />;
}
