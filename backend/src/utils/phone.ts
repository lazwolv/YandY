/**
 * Normalizes a phone number to E.164 format (+1XXXXXXXXXX)
 * Handles various input formats:
 * - 7024269735
 * - (702) 426-9735
 * - +1-702-426-9735
 * - +17024269735
 *
 * @param phone - Phone number in any format
 * @returns Normalized phone number in E.164 format (+1XXXXXXXXXX)
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return phone;

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // If it starts with 1 and has 11 digits (US format), add +
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`;
  }

  // If it's 10 digits (US format without country code), add +1
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }

  // If it already has + at the start, return as-is
  if (phone.startsWith('+')) {
    return phone;
  }

  // Otherwise, assume it needs +1 prefix
  return `+1${digitsOnly}`;
}

/**
 * Validates if a phone number is in valid E.164 format
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export function isValidPhoneNumber(phone: string): boolean {
  // E.164 format: +[country code][number]
  // For US: +1 followed by 10 digits
  const e164Regex = /^\+1\d{10}$/;
  return e164Regex.test(phone);
}
