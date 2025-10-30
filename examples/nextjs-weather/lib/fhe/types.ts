/**
 * FHE Type Definitions
 * Type definitions specific to FHE operations in this application
 */

/**
 * Supported encrypted types
 */
export type EncryptedType = 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool';

/**
 * Encrypted data structure
 */
export interface EncryptedData {
  data: any;
  type: EncryptedType;
  timestamp?: Date;
}

/**
 * FHE operation result
 */
export interface FHEOperationResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: Date;
}

/**
 * Decryption request
 */
export interface DecryptionRequest {
  encryptedData: any;
  contractAddress: string;
  account: string;
  signature?: string;
}

/**
 * Contract interaction parameters
 */
export interface ContractInteraction {
  address: string;
  method: string;
  args: any[];
  encryptedArgs?: EncryptedData[];
}

/**
 * FHE client configuration
 */
export interface FHEClientConfig {
  provider: any;
  network?: string;
  gatewayUrl?: string;
}

/**
 * Computation operation types
 */
export type ComputationOperation =
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

/**
 * Computation request
 */
export interface ComputationRequest {
  operation: ComputationOperation;
  operands: EncryptedData[];
  contractAddress?: string;
}
