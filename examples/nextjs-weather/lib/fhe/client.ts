import { FHEVMClient } from '@fhevm/sdk/core';
import { ethers } from 'ethers';

/**
 * Client-side FHE Operations
 * Utilities for encrypting data on the client side
 */

/**
 * Initialize FHE client
 */
export async function initFHEClient(provider: ethers.BrowserProvider): Promise<FHEVMClient> {
  const client = new FHEVMClient({ provider });
  await client.init();
  return client;
}

/**
 * Encrypt a value with specified type
 */
export async function encryptValue(
  client: FHEVMClient,
  value: number,
  type: 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool'
) {
  return await client.encrypt(value, type);
}

/**
 * Encrypt multiple values at once
 */
export async function encryptBatch(
  client: FHEVMClient,
  values: number[],
  type: 'euint8' | 'euint16' | 'euint32' | 'euint64'
) {
  const encrypted = await Promise.all(
    values.map(value => client.encrypt(value, type))
  );
  return encrypted;
}

/**
 * Validate encrypted data structure
 */
export function validateEncryptedData(data: any): boolean {
  if (!data) return false;
  // Add validation logic based on your encrypted data structure
  return typeof data === 'object' && data !== null;
}
