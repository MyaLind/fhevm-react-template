/**
 * API Type Definitions
 * Type definitions for API requests and responses
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptAPIRequest {
  value: number | boolean;
  type: string;
}

export interface DecryptAPIRequest {
  encryptedData: any;
  contractAddress: string;
  account: string;
}

export interface ComputeAPIRequest {
  operation: string;
  operands: any[];
  contractAddress?: string;
}

export interface KeyAPIRequest {
  action: 'info' | 'status';
}

export interface FHEStatusResponse {
  status: string;
  message: string;
  timestamp?: string;
}

export interface ErrorResponse {
  error: string;
  details?: any;
}
