/**
 * FHEVM React Provider - wagmi-style context provider
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FHEVMClient } from '../core/FHEVMClient';
import type { FHEVMContextValue, FHEVMConfig } from '../types';

const FHEVMContext = createContext<FHEVMContextValue | null>(null);

interface FHEVMProviderProps {
  config: FHEVMConfig;
  children: ReactNode;
}

export function FHEVMProvider({ config, children }: FHEVMProviderProps) {
  const [client, setClient] = useState<FHEVMClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initClient() {
      try {
        const fhevmClient = new FHEVMClient(config);
        await fhevmClient.init();
        setClient(fhevmClient);
        setIsReady(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize');
        console.error('FHEVM initialization error:', err);
      }
    }

    initClient();
  }, [config]);

  const value: FHEVMContextValue = {
    client,
    isReady,
    error,
    provider: config.provider,
    signer: null,
    chainId: config.chainId || null,
  };

  return <FHEVMContext.Provider value={value}>{children}</FHEVMContext.Provider>;
}

export function useFHEVM(): FHEVMContextValue {
  const context = useContext(FHEVMContext);
  if (!context) {
    throw new Error('useFHEVM must be used within FHEVMProvider');
  }
  return context;
}
