'use client';

import React, { useState } from 'react';
import { useEncrypt, useFHEVM } from '@fhevm/sdk';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

/**
 * Banking Example Component
 * Demonstrates confidential banking operations using FHE
 */
export default function BankingExample() {
  const [balance, setBalance] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const { isReady } = useFHEVM();
  const { encrypt, data: encryptedBalance, isLoading: encryptingBalance } = useEncrypt();
  const { encrypt: encryptTransfer, data: encryptedTransfer, isLoading: encryptingTransfer } = useEncrypt();

  const handleEncryptBalance = async () => {
    if (!balance) return;
    const amount = parseInt(balance, 10);
    if (isNaN(amount) || amount < 0) {
      alert('Please enter a valid balance');
      return;
    }
    await encrypt(amount, 'euint32');
  };

  const handleEncryptTransfer = async () => {
    if (!transferAmount) return;
    const amount = parseInt(transferAmount, 10);
    if (isNaN(amount) || amount < 0) {
      alert('Please enter a valid transfer amount');
      return;
    }
    await encryptTransfer(amount, 'euint32');
  };

  return (
    <Card
      title="🏦 Confidential Banking"
      subtitle="Private balance and transfer operations"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="alert alert-info">
          <strong>Use Case:</strong> Banks can process transactions and maintain balances
          in encrypted form, ensuring customer privacy while enabling regulatory compliance.
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
            Set Private Balance
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Input
              type="number"
              label="Account Balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="Enter initial balance"
              disabled={!isReady}
              helperText="This will be encrypted before storing"
            />
            <Button
              variant="primary"
              onClick={handleEncryptBalance}
              disabled={!isReady || !balance || encryptingBalance}
              isLoading={encryptingBalance}
            >
              Encrypt Balance
            </Button>
            {encryptedBalance && (
              <div className="alert alert-success">
                <strong>Balance Encrypted:</strong> Ready to store on-chain privately
              </div>
            )}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
            Private Transfer
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Input
              type="number"
              label="Transfer Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Enter transfer amount"
              disabled={!isReady}
              helperText="Transfer amount hidden from public view"
            />
            <Button
              variant="success"
              onClick={handleEncryptTransfer}
              disabled={!isReady || !transferAmount || encryptingTransfer}
              isLoading={encryptingTransfer}
            >
              Encrypt Transfer
            </Button>
            {encryptedTransfer && (
              <div className="alert alert-success">
                <strong>Transfer Encrypted:</strong> Can be processed privately on-chain
              </div>
            )}
          </div>
        </div>

        <div className="alert alert-warning">
          <strong>Privacy Benefits:</strong>
          <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>Account balances remain private</li>
            <li>Transfer amounts hidden from observers</li>
            <li>Smart contracts can validate sufficient funds without revealing balance</li>
            <li>Regulatory queries can be answered without exposing individual data</li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
            Possible Operations
          </h4>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            <li>Check if balance &gt;= transfer amount (without revealing balance)</li>
            <li>Update encrypted balance after transfer</li>
            <li>Calculate interest on encrypted principal</li>
            <li>Aggregate total deposits without revealing individual amounts</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
