// Core FHEVM SDK Types
import type { Contract, Provider, Signer } from 'ethers';

export type EncryptedType = 'ebool' | 'euint4' | 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'euint128' | 'euint256' | 'eaddress';

export interface EncryptedData {
  data: Uint8Array;
  type: EncryptedType;
  signature?: string;
}

export interface FHEVMConfig {
  provider: Provider;
  chainId?: number;
  gatewayAddress?: string;
  aclAddress?: string;
  kmsVerifierAddress?: string;
}

export interface IFHEVMClient {
  init(): Promise<void>;
  isReady(): boolean;
  encrypt(value: number | boolean, type: EncryptedType): Promise<EncryptedData>;
  createInputProof(encrypted: EncryptedData, contractAddress: string, userAddress: string): Promise<{ data: Uint8Array; signature: string }>;
  getPublicKey(): Uint8Array | null;
}

export type DecryptionStatus = 'idle' | 'pending' | 'success' | 'error';

export interface DecryptionResult {
  value: bigint | boolean | null;
  status: DecryptionStatus;
  error?: string;
}

export interface FHEVMContextValue {
  client: IFHEVMClient | null;
  isReady: boolean;
  error: string | null;
  provider: Provider | null;
  signer: Signer | null;
  chainId: number | null;
}
