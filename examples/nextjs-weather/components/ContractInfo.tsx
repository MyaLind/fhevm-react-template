'use client';

import { useState, useEffect } from 'react';
import { useFHEContract } from '@fhevm/sdk';

const CONTRACT_ADDRESS = '0x291B77969Bb18710609C35d263adCb0848a3f82F';

const CONTRACT_ABI = [
  'function owner() view returns (address)',
  'function stationCount() view returns (uint256)',
  'function forecastCount() view returns (uint256)',
  'function timeWindowEnabled() view returns (bool)',
];

interface ContractInfoProps {
  account: string;
}

export default function ContractInfo({ account }: ContractInfoProps) {
  const { contract } = useFHEContract(CONTRACT_ADDRESS, CONTRACT_ABI);
  const [owner, setOwner] = useState('');
  const [stationCount, setStationCount] = useState(0);
  const [forecastCount, setForecastCount] = useState(0);
  const [timeWindowEnabled, setTimeWindowEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contract) {
      loadContractInfo();
    }
  }, [contract]);

  const loadContractInfo = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const [ownerAddr, stations, forecasts, timeWindow] = await Promise.all([
        contract.owner(),
        contract.stationCount(),
        contract.forecastCount(),
        contract.timeWindowEnabled(),
      ]);

      setOwner(ownerAddr);
      setStationCount(Number(stations));
      setForecastCount(Number(forecasts));
      setTimeWindowEnabled(timeWindow);
    } catch (error) {
      console.error('Error loading contract info:', error);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = account && owner && account.toLowerCase() === owner.toLowerCase();

  return (
    <div className="card">
      <h2>📋 Contract Information</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <span className="loading" />
        </div>
      ) : (
        <>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Contract Address:</span>
              <code style={{ fontSize: '0.75rem' }}>
                {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-8)}
              </code>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Network:</span>
              <span className="badge badge-info">Sepolia Testnet</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Your Role:</span>
              {isOwner ? (
                <span className="badge badge-warning">👑 Owner</span>
              ) : (
                <span className="badge badge-info">Weather Station</span>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginTop: '1.5rem',
            }}
          >
            <div className="stat-card">
              <div className="stat-value">{stationCount}</div>
              <div className="stat-label">Stations</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">{forecastCount}</div>
              <div className="stat-label">Forecasts</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {timeWindowEnabled ? '✓' : '✗'}
              </div>
              <div className="stat-label">Time Window</div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              <strong>🔗 Contract Link:</strong>{' '}
              <a
                href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
              >
                View on Etherscan →
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
