/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @param unit 'mi' for miles, 'km' for kilometers (default: 'mi')
 * @returns Distance in the specified unit
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: "mi" | "km" = "mi"
): number {
  const R = unit === "mi" ? 3959 : 6371; // Earth's radius in miles or kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 * @param distance Distance in miles or kilometers
 * @param unit 'mi' or 'km'
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted string like "0.5 mi" or "1.2 km"
 */
export function formatDistance(
  distance: number,
  unit: "mi" | "km" = "mi",
  decimals: number = 1
): string {
  const rounded = distance.toFixed(decimals);
  return `${rounded} ${unit}`;
}

/**
 * Calculate and format distance between two coordinates
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @param unit 'mi' for miles, 'km' for kilometers (default: 'mi')
 * @returns Formatted distance string
 */
export function getFormattedDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: "mi" | "km" = "mi"
): string {
  const distance = calculateDistance(lat1, lon1, lat2, lon2, unit);
  return formatDistance(distance, unit);
}

