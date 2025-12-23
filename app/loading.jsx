export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-16 space-y-8 animate-pulse">
            {/* Title Placeholder */}
            <div className="h-10 md:h-12 bg-gray-100 dark:bg-gray-800 rounded-lg w-2/3 md:w-1/3" />

            {/* Content Block 1 */}
            <div className="w-full h-48 md:h-64 bg-gray-100 dark:bg-gray-800 rounded-xl" />

            {/* Content Block 2 (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                ))}
            </div>
        </div>
    );
}
