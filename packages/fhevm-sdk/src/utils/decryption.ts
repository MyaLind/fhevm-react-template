/**
 * Decryption utilities for FHEVM SDK
 * Provides helper functions for decrypting encrypted values via the Gateway
 */

import type { DecryptionResult } from '../types';

/**
 * Request decryption via the Gateway
 * @param contractAddress - Address of the contract
 * @param encryptedValue - Encrypted value handle
 * @param userAddress - Address of the user requesting decryption
 * @returns Decryption result
 */
export async function requestDecryption(
  contractAddress: string,
  encryptedValue: bigint,
  userAddress: string
): Promise<DecryptionResult> {
  // This is a placeholder for Gateway integration
  // In production, this would interact with Zama's Gateway service

  return {
    status: 'pending',
    value: undefined,
    error: undefined,
  };
}

/**
 * Parse decrypted value from Gateway response
 * @param response - Gateway response
 * @returns Parsed value
 */
export function parseDecryptedValue(response: any): number | boolean {
  if (typeof response === 'boolean') {
    return response;
  }

  if (typeof response === 'number') {
    return response;
  }

  if (typeof response === 'string') {
    return parseInt(response, 10);
  }

  if (typeof response === 'bigint') {
    return Number(response);
  }

  throw new Error('Invalid decrypted value format');
}

/**
 * Check if decryption is complete
 * @param result - Decryption result
 * @returns true if decryption is complete
 */
export function isDecryptionComplete(result: DecryptionResult): boolean {
  return result.status === 'success' || result.status === 'error';
}
