'use client';

import React from 'react';
import { useFHEVM } from '@fhevm/sdk';
import Card from '../ui/Card';

/**
 * Key Manager Component
 * Displays FHE key management information and status
 */
export default function KeyManager() {
  const { client, isReady } = useFHEVM();

  return (
    <Card title="Key Management" subtitle="FHE encryption keys">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className={`alert ${isReady ? 'alert-success' : 'alert-warning'}`}>
          <strong>Status:</strong> {isReady ? 'Keys Initialized' : 'Initializing...'}
        </div>

        <div>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
            Key Generation
          </h4>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            <li>Public keys are generated automatically when the FHE client initializes</li>
            <li>Private keys are managed securely by the Zama Gateway</li>
            <li>Keys are used for encrypting inputs and decrypting authorized outputs</li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
            Encryption Workflow
          </h4>
          <ol style={{ marginLeft: '1.5rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            <li>Client generates/fetches public key from the network</li>
            <li>Data is encrypted client-side using the public key</li>
            <li>Encrypted data is sent to the smart contract</li>
            <li>Contract performs computations on encrypted data</li>
          </ol>
        </div>

        <div>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
            Decryption Workflow
          </h4>
          <ol style={{ marginLeft: '1.5rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            <li>Request decryption permission from the contract</li>
            <li>Sign EIP-712 message to authorize decryption</li>
            <li>Gateway validates signature and decrypts using private key</li>
            <li>Decrypted value returned to authorized address only</li>
          </ol>
        </div>

        <div className="alert alert-info">
          <strong>Security:</strong> Your private keys never leave the Gateway. Only authorized
          parties can request decryption of specific values they have permission to access.
        </div>
      </div>
    </Card>
  );
}
