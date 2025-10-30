/**
 * Server-side FHE Operations
 * Note: Most FHE operations should be done client-side or in smart contracts
 * This module provides server-side utilities for validation and logging
 */

/**
 * Validate encryption parameters server-side
 */
export function validateEncryptionParams(value: any, type: string): { valid: boolean; error?: string } {
  // Validate type
  const validTypes = ['euint8', 'euint16', 'euint32', 'euint64', 'ebool'];
  if (!validTypes.includes(type)) {
    return { valid: false, error: `Invalid type. Must be one of: ${validTypes.join(', ')}` };
  }

  // Validate value
  if (typeof value !== 'number' && typeof value !== 'boolean') {
    return { valid: false, error: 'Value must be a number or boolean' };
  }

  // Validate range based on type
  if (typeof value === 'number') {
    const ranges: { [key: string]: { min: number; max: number } } = {
      euint8: { min: 0, max: 255 },
      euint16: { min: 0, max: 65535 },
      euint32: { min: 0, max: 4294967295 },
      euint64: { min: 0, max: Number.MAX_SAFE_INTEGER }
    };

    const range = ranges[type];
    if (range && (value < range.min || value > range.max)) {
      return { valid: false, error: `Value out of range for ${type}: ${range.min}-${range.max}` };
    }
  }

  return { valid: true };
}

/**
 * Log encryption event (for server-side monitoring)
 */
export function logEncryptionEvent(event: {
  type: string;
  timestamp: Date;
  success: boolean;
  error?: string;
}) {
  // In production, send to logging service
  console.log('[FHE Encryption Event]', {
    ...event,
    timestamp: event.timestamp.toISOString()
  });
}

/**
 * Validate contract interaction parameters
 */
export function validateContractParams(params: {
  contractAddress?: string;
  method?: string;
  args?: any[];
}): { valid: boolean; error?: string } {
  if (params.contractAddress && !isValidEthereumAddress(params.contractAddress)) {
    return { valid: false, error: 'Invalid contract address' };
  }

  if (params.method && typeof params.method !== 'string') {
    return { valid: false, error: 'Method must be a string' };
  }

  if (params.args && !Array.isArray(params.args)) {
    return { valid: false, error: 'Arguments must be an array' };
  }

  return { valid: true };
}

/**
 * Validate Ethereum address
 */
function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
