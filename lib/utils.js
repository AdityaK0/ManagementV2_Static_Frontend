import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function extractLatLngFromGoogleMapsUrl(url) {
  if (!url) return null;

  // Matches @lat,lng pattern
  const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (!match) return null;

  return {
    lat: match[1],
    lng: match[2],
  };
}
