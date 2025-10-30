/**
 * FHEVM SDK - Universal SDK for building FHE dApps
 * @packageDocumentation
 */

// Core exports
export { FHEVMClient, encryptUint32, encryptUint8, encryptBool } from './core/FHEVMClient';

// React exports
export { FHEVMProvider, useFHEVM } from './react/FHEVMProvider';
export { useEncrypt, useDecrypt, useFHEContract } from './react/hooks';

// Utility exports
export {
  encrypt,
  encryptBatch,
  validateEncryptedData,
  requestDecryption,
  parseDecryptedValue,
  isDecryptionComplete,
  sanitizeInput,
  isValidAddress,
  validateContractAddress,
  generateNonce,
  isSecureContext,
  isValidEncryptedType,
  isValidValueForType,
  isValidConfig,
  isSupportedNetwork,
} from './utils';

// Adapter exports
export { useFhevmClient, useFhevmEncrypt, useFhevmContract } from './adapters/vue';

// Type exports
export type {
  EncryptedType,
  EncryptedData,
  FHEVMConfig,
  IFHEVMClient,
  DecryptionStatus,
  DecryptionResult,
  FHEVMContextValue,
} from './types';
