'use client';

import React, { useState } from 'react';
import { useEncrypt, useFHEVM } from '@fhevm/sdk';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

/**
 * Encryption Demo Component
 * Demonstrates how to encrypt data using the FHEVM SDK
 */
export default function EncryptionDemo() {
  const [value, setValue] = useState<string>('');
  const [encryptType, setEncryptType] = useState<'euint8' | 'euint16' | 'euint32' | 'euint64'>('euint32');
  const { isReady } = useFHEVM();
  const { encrypt, data, isLoading, error } = useEncrypt();

  const handleEncrypt = async () => {
    if (!value) return;

    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      alert('Please enter a valid number');
      return;
    }

    await encrypt(numValue, encryptType);
  };

  return (
    <Card title="Encryption Demo" subtitle="Encrypt data using FHE">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          type="number"
          label="Value to Encrypt"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a number"
          disabled={!isReady}
        />

        <div className="input-group">
          <label htmlFor="encrypt-type" className="input-label">
            Encryption Type
          </label>
          <select
            id="encrypt-type"
            className="input"
            value={encryptType}
            onChange={(e) => setEncryptType(e.target.value as any)}
            disabled={!isReady}
          >
            <option value="euint8">euint8 (0-255)</option>
            <option value="euint16">euint16 (0-65535)</option>
            <option value="euint32">euint32 (0-4294967295)</option>
            <option value="euint64">euint64 (large numbers)</option>
          </select>
        </div>

        <Button
          variant="primary"
          onClick={handleEncrypt}
          disabled={!isReady || !value || isLoading}
          isLoading={isLoading}
        >
          Encrypt
        </Button>

        {error && (
          <div className="alert alert-danger">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {data && (
          <div className="alert alert-success">
            <strong>Encrypted Successfully!</strong>
            <details style={{ marginTop: '0.5rem' }}>
              <summary style={{ cursor: 'pointer' }}>View Encrypted Data</summary>
              <pre style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                background: '#f5f5f5',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.75rem'
              }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {!isReady && (
          <div className="alert alert-info">
            Initializing FHE client...
          </div>
        )}
      </div>
    </Card>
  );
}
