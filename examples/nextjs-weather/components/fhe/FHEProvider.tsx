'use client';

import React from 'react';
import { FHEVMProvider as SDKFHEVMProvider } from '@fhevm/sdk';
import { ethers } from 'ethers';

interface FHEProviderProps {
  children: React.ReactNode;
  provider?: ethers.BrowserProvider;
}

/**
 * FHE Provider Component
 * Wraps the application with FHEVM SDK provider
 * Re-exports the SDK provider with additional functionality if needed
 */
export default function FHEProvider({ children, provider }: FHEProviderProps) {
  if (!provider) {
    return (
      <div className="alert alert-warning">
        <strong>Provider Required:</strong> Please connect your wallet to initialize FHE.
      </div>
    );
  }

  return (
    <SDKFHEVMProvider config={{ provider }}>
      {children}
    </SDKFHEVMProvider>
  );
}
