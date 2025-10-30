/**
 * Encryption utilities for FHEVM SDK
 * Provides helper functions for encrypting data before blockchain submission
 */

import { FHEVMClient } from '../core/FHEVMClient';
import type { EncryptedType, EncryptedData } from '../types';

/**
 * Encrypt a value using the FHEVM client
 * @param client - Initialized FHEVM client
 * @param value - Value to encrypt
 * @param type - Encrypted type (euint8, euint16, euint32, euint64, ebool)
 * @returns Encrypted data ready for contract submission
 */
export async function encrypt(
  client: FHEVMClient,
  value: number | boolean,
  type: EncryptedType
): Promise<EncryptedData> {
  if (!client) {
    throw new Error('FHEVM client not initialized');
  }

  return await client.encrypt(value, type);
}

/**
 * Batch encrypt multiple values
 * @param client - Initialized FHEVM client
 * @param values - Array of values to encrypt
 * @param type - Encrypted type for all values
 * @returns Array of encrypted data
 */
export async function encryptBatch(
  client: FHEVMClient,
  values: (number | boolean)[],
  type: EncryptedType
): Promise<EncryptedData[]> {
  if (!client) {
    throw new Error('FHEVM client not initialized');
  }

  return Promise.all(values.map(value => client.encrypt(value, type)));
}

/**
 * Validate encrypted data before contract submission
 * @param data - Encrypted data to validate
 * @returns true if valid, false otherwise
 */
export function validateEncryptedData(data: EncryptedData): boolean {
  if (!data || !data.data) {
    return false;
  }

  // Check if data is a valid Uint8Array or hex string
  if (!(data.data instanceof Uint8Array) && typeof data.data !== 'string') {
    return false;
  }

  // Check if data has minimum length
  const length = data.data instanceof Uint8Array ? data.data.length : data.data.length / 2;
  return length > 0;
}
