/**
 * Security Utilities
 * Security-related helper functions for the application
 */

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000); // Limit length
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate contract address and optionally check if it's a contract
 */
export function validateContractAddress(address: string): { valid: boolean; error?: string } {
  if (!address) {
    return { valid: false, error: 'Address is required' };
  }

  if (!isValidAddress(address)) {
    return { valid: false, error: 'Invalid Ethereum address format' };
  }

  return { valid: true };
}

/**
 * Generate a secure nonce for requests
 */
export function generateNonce(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `${timestamp}-${random}`;
}

/**
 * Check if running in secure context (HTTPS)
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return true; // Server-side
  return window.isSecureContext || window.location.protocol === 'https:';
}

/**
 * Validate numeric input is within safe range
 */
export function isValidNumericInput(value: any, min?: number, max?: number): boolean {
  const num = Number(value);

  if (isNaN(num) || !isFinite(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;

  return true;
}

/**
 * Rate limiting helper (simple in-memory implementation)
 */
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(identifier) || [];

  // Remove old timestamps outside the window
  const validTimestamps = timestamps.filter(ts => now - ts < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  validTimestamps.push(now);
  rateLimitMap.set(identifier, validTimestamps);

  return true;
}

/**
 * Hash sensitive data (for logging without exposing actual values)
 */
export function hashForLogging(data: string): string {
  if (!data) return '';

  // Simple hash for logging purposes (not cryptographic)
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return `hash_${Math.abs(hash).toString(16)}`;
}

/**
 * Validate transaction parameters
 */
export function validateTransactionParams(params: {
  to?: string;
  value?: string;
  data?: string;
}): { valid: boolean; error?: string } {
  if (params.to && !isValidAddress(params.to)) {
    return { valid: false, error: 'Invalid recipient address' };
  }

  if (params.value) {
    try {
      const value = BigInt(params.value);
      if (value < 0n) {
        return { valid: false, error: 'Value cannot be negative' };
      }
    } catch {
      return { valid: false, error: 'Invalid value format' };
    }
  }

  return { valid: true };
}
