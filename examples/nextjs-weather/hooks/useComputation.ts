'use client';

import { useState } from 'react';
import { ComputationOperation } from '../lib/fhe/types';

/**
 * Custom Computation Hook
 * Provides utilities for FHE computation operations
 */
export function useComputation() {
  const [isComputing, setIsComputing] = useState(false);
  const [computationResult, setComputationResult] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  const performComputation = async (
    operation: ComputationOperation,
    operands: any[]
  ) => {
    setIsComputing(true);
    setError(null);

    try {
      // Note: Actual computation happens on-chain in smart contracts
      // This is a placeholder for demonstrating the workflow

      // In a real implementation, you would:
      // 1. Call the smart contract method with encrypted operands
      // 2. The contract performs the operation using TFHE library
      // 3. Return the encrypted result

      const result = {
        operation,
        operandCount: operands.length,
        note: 'Computation performed on-chain with encrypted data',
        timestamp: new Date().toISOString()
      };

      setComputationResult(result);
      return result;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Computation failed');
      setError(error);
      throw error;
    } finally {
      setIsComputing(false);
    }
  };

  const getSupportedOperations = (): ComputationOperation[] => {
    return ['add', 'sub', 'mul', 'div', 'min', 'max', 'eq', 'ne', 'lt', 'lte', 'gt', 'gte'];
  };

  const getOperationDescription = (operation: ComputationOperation): string => {
    const descriptions: Record<ComputationOperation, string> = {
      add: 'Add two encrypted numbers',
      sub: 'Subtract encrypted numbers',
      mul: 'Multiply encrypted numbers',
      div: 'Divide encrypted numbers',
      min: 'Find minimum of encrypted numbers',
      max: 'Find maximum of encrypted numbers',
      eq: 'Check equality of encrypted values',
      ne: 'Check inequality of encrypted values',
      lt: 'Less than comparison',
      lte: 'Less than or equal comparison',
      gt: 'Greater than comparison',
      gte: 'Greater than or equal comparison'
    };
    return descriptions[operation];
  };

  return {
    performComputation,
    isComputing,
    result: computationResult,
    error,
    getSupportedOperations,
    getOperationDescription
  };
}

export default useComputation;
