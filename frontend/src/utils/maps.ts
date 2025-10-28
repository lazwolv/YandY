/**
 * Maps Utilities - Smart device detection and native maps app opening
 */

interface MapLocation {
  address: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Detects the user's device type
 */
export const getDeviceType = (): 'ios' | 'android' | 'desktop' => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return 'ios';
  }

  // Android detection
  if (/android/i.test(userAgent)) {
    return 'android';
  }

  // Everything else is desktop
  return 'desktop';
};

/**
 * Generates the appropriate maps URL based on device type
 *
 * @param location - Address or coordinates
 * @returns URL string that opens the native maps app
 *
 * @example
 * // Using address
 * const url = getMapsUrl({ address: '1820 S Rainbow Blvd, Las Vegas, NV 89146' });
 *
 * // Using coordinates (more accurate)
 * const url = getMapsUrl({
 *   address: '1820 S Rainbow Blvd, Las Vegas, NV 89146',
 *   latitude: 36.1523,
 *   longitude: -115.2437
 * });
 */
export const getMapsUrl = (location: MapLocation): string => {
  const deviceType = getDeviceType();
  const { address, latitude, longitude } = location;

  // If we have coordinates, use them (more accurate)
  if (latitude && longitude) {
    switch (deviceType) {
      case 'ios':
        // Apple Maps with coordinates
        // Format: maps://?q=36.1523,-115.2437
        return `maps://?q=${latitude},${longitude}`;

      case 'android':
        // Google Maps app with coordinates
        // Format: geo:36.1523,-115.2437?q=36.1523,-115.2437(Y&Y Beauty Salon)
        return `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent('Y&Y Beauty Salon')})`;

      case 'desktop':
      default:
        // Google Maps web with coordinates
        return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    }
  }

  // Fallback to address-based URLs
  const encodedAddress = encodeURIComponent(address);

  switch (deviceType) {
    case 'ios':
      // Apple Maps with address
      // Format: http://maps.apple.com/?address=1820+S+Rainbow+Blvd,Las+Vegas,NV+89146
      return `http://maps.apple.com/?address=${encodedAddress}`;

    case 'android':
      // Google Maps app with address
      // Format: geo:0,0?q=1820+S+Rainbow+Blvd,Las+Vegas,NV+89146
      return `geo:0,0?q=${encodedAddress}`;

    case 'desktop':
    default:
      // Google Maps web
      return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  }
};

/**
 * Opens the native maps app with the given location
 *
 * @param location - Address or coordinates
 *
 * @example
 * openMaps({ address: '1820 S Rainbow Blvd, Las Vegas, NV 89146' });
 */
export const openMaps = (location: MapLocation): void => {
  const url = getMapsUrl(location);
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Get a user-friendly description of which maps app will open
 */
export const getMapsAppName = (): string => {
  const deviceType = getDeviceType();

  switch (deviceType) {
    case 'ios':
      return 'Apple Maps';
    case 'android':
      return 'Google Maps';
    case 'desktop':
    default:
      return 'Google Maps';
  }
};
