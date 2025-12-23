export function getVendorSlug() {
    if (typeof window === 'undefined') return null;

    const hostname = window.location.hostname;

    // Local dev: vendor.localhost
    if (hostname.endsWith('.localhost')) {
        return hostname.split('.')[0];
    }

    // Plain localhost (no vendor)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return null;
    }

    const parts = hostname.split('.');

    // vendor.domain.com
    if (parts.length >= 3) {
        return parts[0];
    }

    // No subdomain → no vendor
    return null;
}
