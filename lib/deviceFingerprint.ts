import crypto from 'crypto';

/**
 * Generates an anonymous device fingerprint from request headers
 * Combines IP address and User-Agent to create a unique identifier
 * The fingerprint is hashed to maintain anonymity
 */
export function generateDeviceFingerprint(
  ipAddress: string | null,
  userAgent: string | null
): string {
  // Combine IP and User-Agent to create a unique identifier
  const rawFingerprint = `${ipAddress || 'unknown'}_${userAgent || 'unknown'}`;

  // Hash the fingerprint using SHA-256 to maintain anonymity
  const hash = crypto.createHash('sha256');
  hash.update(rawFingerprint);

  return hash.digest('hex');
}

/**
 * Extracts IP address from Next.js request headers
 * Checks common headers used by proxies and load balancers
 */
export function getClientIp(headers: Headers): string | null {
  // Check various headers that might contain the client IP
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get('cf-connecting-ip'); // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return null;
}
