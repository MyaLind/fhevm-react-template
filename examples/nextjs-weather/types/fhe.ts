/**
 * FHE Type Definitions
 * Application-specific type definitions for FHE operations
 */

export type EncryptedType = 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool';

export interface EncryptedValue {
  data: any;
  type: EncryptedType;
  timestamp?: number;
}

export interface FHEConfig {
  provider: any;
  network?: string;
  gatewayUrl?: string;
}

export interface EncryptionResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface DecryptionResult {
  success: boolean;
  value?: number | boolean;
  error?: string;
}

export type FHEOperation =
  | 'encrypt'
  | 'decrypt'
  | 'add'
  | 'sub'
  | 'mul'
  | 'div'
  | 'min'
  | 'max'
  | 'eq'
  | 'ne'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte';
