/**
 * Security utilities for FHEVM SDK
 * Provides helper functions for secure operations
 */

/**
 * Sanitize user input to prevent injection attacks
 * @param input - User input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '');
}

/**
 * Validate Ethereum address format
 * @param address - Address to validate
 * @returns true if valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate contract address before interaction
 * @param address - Contract address
 * @returns true if valid
 */
export function validateContractAddress(address: string): boolean {
  if (!isValidAddress(address)) {
    return false;
  }

  // Additional checks can be added here
  return true;
}

/**
 * Generate random nonce for transactions
 * @returns Random nonce
 */
export function generateNonce(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if running in secure context (HTTPS)
 * @returns true if secure context
 */
export function isSecureContext(): boolean {
  return window?.isSecureContext ?? false;
}
