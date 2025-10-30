'use client';

import { useEncrypt as useSDKEncrypt } from '@fhevm/sdk';
import { EncryptedType } from '../lib/fhe/types';
import { isValidValueForType } from '../lib/utils/validation';

/**
 * Custom Encryption Hook
 * Extends the SDK's useEncrypt hook with validation and convenience features
 */
export function useEncryption() {
  const { encrypt, data, isLoading, error } = useSDKEncrypt();

  const encryptWithValidation = async (value: number | boolean, type: EncryptedType) => {
    // Validate value for type
    if (type !== 'ebool' && !isValidValueForType(value, type)) {
      throw new Error(`Invalid value for type ${type}`);
    }

    return await encrypt(value as number, type);
  };

  const encryptMultiple = async (values: number[], type: EncryptedType) => {
    const results = [];
    for (const value of values) {
      const encrypted = await encrypt(value, type);
      results.push(encrypted);
    }
    return results;
  };

  return {
    encrypt: encryptWithValidation,
    encryptMultiple,
    encryptedData: data,
    isEncrypting: isLoading,
    encryptionError: error
  };
}

export default useEncryption;
