'use client';

import { useFHEVM } from '@fhevm/sdk';

/**
 * Custom FHE Hook
 * Re-exports and extends the SDK's useFHEVM hook with additional functionality
 */
export function useFHE() {
  const fhevm = useFHEVM();

  return {
    ...fhevm,
    // Add any additional custom functionality here
    isInitialized: fhevm.isReady,
    clientInstance: fhevm.client
  };
}

export default useFHE;
