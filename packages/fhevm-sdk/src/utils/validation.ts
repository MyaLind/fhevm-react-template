/**
 * Validation utilities for FHEVM SDK
 * Provides helper functions for validating inputs and configurations
 */

import type { EncryptedType, FHEVMConfig } from '../types';

/**
 * Validate encrypted type
 * @param type - Type to validate
 * @returns true if valid encrypted type
 */
export function isValidEncryptedType(type: string): type is EncryptedType {
  const validTypes: EncryptedType[] = ['euint8', 'euint16', 'euint32', 'euint64', 'ebool'];
  return validTypes.includes(type as EncryptedType);
}

/**
 * Validate value range for encrypted type
 * @param value - Value to validate
 * @param type - Encrypted type
 * @returns true if value is within valid range
 */
export function isValidValueForType(value: number | boolean, type: EncryptedType): boolean {
  if (type === 'ebool') {
    return typeof value === 'boolean';
  }

  if (typeof value !== 'number') {
    return false;
  }

  // Check if value is an integer
  if (!Number.isInteger(value)) {
    return false;
  }

  // Check range based on type
  switch (type) {
    case 'euint8':
      return value >= 0 && value <= 255;
    case 'euint16':
      return value >= 0 && value <= 65535;
    case 'euint32':
      return value >= 0 && value <= 4294967295;
    case 'euint64':
      return value >= 0 && value <= Number.MAX_SAFE_INTEGER;
    default:
      return false;
  }
}

/**
 * Validate FHEVM configuration
 * @param config - Configuration to validate
 * @returns true if valid configuration
 */
export function isValidConfig(config: FHEVMConfig): boolean {
  if (!config) {
    return false;
  }

  if (!config.provider) {
    return false;
  }

  // Additional validation can be added here
  return true;
}

/**
 * Validate network ID
 * @param networkId - Network ID to validate
 * @returns true if supported network
 */
export function isSupportedNetwork(networkId: number): boolean {
  // Sepolia testnet
  const supportedNetworks = [11155111, 8009]; // Sepolia and Zama devnet
  return supportedNetworks.includes(networkId);
}
