/**
 * Vue adapter for FHEVM SDK
 * Provides Vue 3 composables for FHEVM operations
 */

import { ref, computed, onMounted, type Ref } from 'vue';
import { FHEVMClient } from '../core/FHEVMClient';
import type { EncryptedType, EncryptedData, FHEVMConfig } from '../types';

let globalClient: FHEVMClient | null = null;

/**
 * Initialize FHEVM client for Vue applications
 * @param config - FHEVM configuration
 * @returns Composable with client and initialization status
 */
export function useFhevmClient(config: FHEVMConfig) {
  const client = ref<FHEVMClient | null>(null);
  const isReady = ref(false);
  const error = ref<Error | null>(null);

  onMounted(async () => {
    try {
      if (!globalClient) {
        globalClient = new FHEVMClient(config);
        await globalClient.init();
      }
      client.value = globalClient;
      isReady.value = true;
    } catch (err) {
      error.value = err as Error;
    }
  });

  return {
    client: computed(() => client.value),
    isReady: computed(() => isReady.value),
    error: computed(() => error.value),
  };
}

/**
 * Composable for encrypting values
 * @returns Encryption composable
 */
export function useFhevmEncrypt() {
  const data: Ref<EncryptedData | null> = ref(null);
  const isLoading = ref(false);
  const error: Ref<Error | null> = ref(null);

  const encrypt = async (value: number | boolean, type: EncryptedType) => {
    if (!globalClient) {
      error.value = new Error('FHEVM client not initialized');
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const encrypted = await globalClient.encrypt(value, type);
      data.value = encrypted;
    } catch (err) {
      error.value = err as Error;
    } finally {
      isLoading.value = false;
    }
  };

  const reset = () => {
    data.value = null;
    error.value = null;
  };

  return {
    data: computed(() => data.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    encrypt,
    reset,
  };
}

/**
 * Composable for interacting with FHE contracts
 * @param address - Contract address
 * @param abi - Contract ABI
 * @returns Contract composable
 */
export function useFhevmContract(address: string, abi: any[]) {
  const contract = ref<any>(null);
  const isLoading = ref(true);
  const error: Ref<Error | null> = ref(null);

  onMounted(async () => {
    try {
      if (!globalClient) {
        throw new Error('FHEVM client not initialized');
      }

      const provider = globalClient['provider'];
      const signer = await provider.getSigner();
      const ethers = await import('ethers');
      contract.value = new ethers.Contract(address, abi, signer);
      isLoading.value = false;
    } catch (err) {
      error.value = err as Error;
      isLoading.value = false;
    }
  });

  return {
    contract: computed(() => contract.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
  };
}
