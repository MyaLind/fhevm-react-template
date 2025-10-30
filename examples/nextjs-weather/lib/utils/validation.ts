/**
 * Validation Utilities
 * Input validation and data verification functions
 */

import { EncryptedType } from '../fhe/types';

/**
 * Check if encrypted type is valid
 */
export function isValidEncryptedType(type: string): type is EncryptedType {
  const validTypes: EncryptedType[] = ['euint8', 'euint16', 'euint32', 'euint64', 'ebool'];
  return validTypes.includes(type as EncryptedType);
}

/**
 * Check if value is valid for the specified encrypted type
 */
export function isValidValueForType(value: any, type: EncryptedType): boolean {
  if (type === 'ebool') {
    return typeof value === 'boolean';
  }

  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return false;
  }

  const ranges: { [K in Exclude<EncryptedType, 'ebool'>]: { min: number; max: number } } = {
    euint8: { min: 0, max: 255 },
    euint16: { min: 0, max: 65535 },
    euint32: { min: 0, max: 4294967295 },
    euint64: { min: 0, max: Number.MAX_SAFE_INTEGER }
  };

  const range = ranges[type as Exclude<EncryptedType, 'ebool'>];
  if (!range) return false;

  return value >= range.min && value <= range.max && Number.isInteger(value);
}

/**
 * Validate FHE client configuration
 */
export function isValidConfig(config: any): boolean {
  if (!config || typeof config !== 'object') return false;
  if (!config.provider) return false;
  return true;
}

/**
 * Check if network is supported
 */
export function isSupportedNetwork(chainId: number): boolean {
  const supportedChainIds = [
    11155111, // Sepolia
    8009,     // Zama Devnet
    // Add more supported networks
  ];
  return supportedChainIds.includes(chainId);
}

/**
 * Validate encrypted data structure
 */
export function validateEncryptedData(data: any): { valid: boolean; error?: string } {
  if (!data) {
    return { valid: false, error: 'Encrypted data is required' };
  }

  if (typeof data !== 'object') {
    return { valid: false, error: 'Encrypted data must be an object' };
  }

  // Add more specific validation based on your encrypted data structure
  return { valid: true };
}

/**
 * Validate array of values
 */
export function validateValueArray(values: any[]): { valid: boolean; error?: string } {
  if (!Array.isArray(values)) {
    return { valid: false, error: 'Values must be an array' };
  }

  if (values.length === 0) {
    return { valid: false, error: 'Array cannot be empty' };
  }

  if (values.length > 100) {
    return { valid: false, error: 'Array too large (max 100 items)' };
  }

  return { valid: true };
}

/**
 * Validate method signature
 */
export function isValidMethodSignature(signature: string): boolean {
  if (!signature || typeof signature !== 'string') return false;

  // Basic validation for Solidity method signature format
  return /^[a-zA-Z_][a-zA-Z0-9_]*\(.*\)$/.test(signature);
}

/**
 * Validate ABI
 */
export function isValidABI(abi: any): boolean {
  if (!Array.isArray(abi)) return false;
  if (abi.length === 0) return false;

  // Basic ABI structure validation
  return abi.every(item =>
    item && typeof item === 'object' && typeof item.name === 'string'
  );
}

/**
 * Validate gas limit
 */
export function isValidGasLimit(gasLimit: any): boolean {
  const limit = Number(gasLimit);
  return !isNaN(limit) && isFinite(limit) && limit > 0 && limit <= 30000000;
}

/**
 * Validate timestamp
 */
export function isValidTimestamp(timestamp: any): boolean {
  const ts = Number(timestamp);
  if (isNaN(ts) || !isFinite(ts)) return false;

  const now = Date.now();
  const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);
  const oneYearFromNow = now + (365 * 24 * 60 * 60 * 1000);

  return ts >= oneYearAgo && ts <= oneYearFromNow;
}

/**
 * Validate hex string
 */
export function isValidHexString(hex: string): boolean {
  if (!hex || typeof hex !== 'string') return false;
  return /^0x[0-9a-fA-F]*$/.test(hex);
}

/**
 * Sanitize and validate numeric input
 */
export function sanitizeNumericInput(input: any): number | null {
  const num = Number(input);
  if (isNaN(num) || !isFinite(num)) return null;
  return num;
}
