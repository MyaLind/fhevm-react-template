'use client';

import React from 'react';
import Card from '../ui/Card';

/**
 * Computation Demo Component
 * Explains FHE computation capabilities
 */
export default function ComputationDemo() {
  const operations = [
    { name: 'Addition', solidity: 'TFHE.add(a, b)', description: 'Add encrypted numbers' },
    { name: 'Subtraction', solidity: 'TFHE.sub(a, b)', description: 'Subtract encrypted numbers' },
    { name: 'Multiplication', solidity: 'TFHE.mul(a, b)', description: 'Multiply encrypted numbers' },
    { name: 'Division', solidity: 'TFHE.div(a, b)', description: 'Divide encrypted numbers' },
    { name: 'Minimum', solidity: 'TFHE.min(a, b)', description: 'Find minimum of encrypted numbers' },
    { name: 'Maximum', solidity: 'TFHE.max(a, b)', description: 'Find maximum of encrypted numbers' },
    { name: 'Equal', solidity: 'TFHE.eq(a, b)', description: 'Check if encrypted values are equal' },
    { name: 'Less Than', solidity: 'TFHE.lt(a, b)', description: 'Compare encrypted values' },
  ];

  return (
    <Card title="FHE Computation" subtitle="Operations on encrypted data">
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          Fully Homomorphic Encryption allows computations on encrypted data without decryption.
          All operations happen on-chain in your smart contracts.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {operations.map((op, index) => (
          <div
            key={index}
            style={{
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: 'var(--primary-color)' }}>{op.name}</strong>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {op.description}
                </p>
              </div>
            </div>
            <code style={{
              display: 'block',
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontFamily: 'monospace'
            }}>
              {op.solidity}
            </code>
          </div>
        ))}
      </div>

      <div className="alert alert-info" style={{ marginTop: '1rem' }}>
        <strong>Note:</strong> These operations are performed in your Solidity smart contracts
        using the TFHE library. The data remains encrypted throughout the computation.
      </div>
    </Card>
  );
}
