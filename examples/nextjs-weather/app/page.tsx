'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { FHEVMProvider } from '@fhevm/sdk';
import WeatherStation from '@/components/WeatherStation';
import ForecastDisplay from '@/components/ForecastDisplay';
import ContractInfo from '@/components/ContractInfo';

export default function Home() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const ethersProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(ethersProvider);
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(ethersProvider);
        setAccount(accounts[0]);
        setIsConnected(true);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            setIsConnected(false);
            setAccount('');
          }
        });
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask to use this application');
    }
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>🌤️ Confidential Weather Aggregator</h1>
        <p style={{ fontSize: '1.125rem', color: 'white', marginTop: '1rem' }}>
          Privacy-preserving weather data aggregation using FHEVM SDK
        </p>

        {!isConnected ? (
          <button
            className="btn btn-primary"
            onClick={connectWallet}
            style={{ marginTop: '2rem' }}
          >
            Connect Wallet
          </button>
        ) : (
          <div style={{ marginTop: '2rem' }}>
            <span className="badge badge-success" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </div>
        )}
      </header>

      {isConnected && provider ? (
        <FHEVMProvider config={{ provider }}>
          <div className="grid grid-2">
            <div>
              <ContractInfo account={account} />
              <WeatherStation />
            </div>
            <div>
              <ForecastDisplay />
            </div>
          </div>

          <div className="card" style={{ marginTop: '2rem' }}>
            <h2>🎯 About This Demo</h2>
            <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
              This Next.js application demonstrates the <strong>FHEVM SDK</strong> in action.
              Multiple weather stations can submit encrypted measurements without revealing their
              individual data. The smart contract aggregates encrypted values using Fully Homomorphic
              Encryption, and only the final average forecast is decrypted and made public.
            </p>

            <h3 style={{ marginTop: '2rem' }}>SDK Features Used:</h3>
            <ul style={{ marginTop: '1rem', marginLeft: '1.5rem', lineHeight: '1.8' }}>
              <li><code>FHEVMProvider</code> - Context provider for FHE client</li>
              <li><code>useFHEVM()</code> - Access client status and configuration</li>
              <li><code>useEncrypt()</code> - Encrypt data with loading states</li>
              <li><code>useFHEContract()</code> - Interact with FHE-enabled contracts</li>
            </ul>

            <div className="alert alert-info" style={{ marginTop: '2rem' }}>
              <strong>💡 Learn More:</strong> Check out the{' '}
              <a
                href="https://github.com/MyaLind/FHEWeatherAggregator"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--primary-color)', fontWeight: 600 }}
              >
                GitHub repository
              </a>{' '}
              for complete SDK documentation and more examples.
            </div>
          </div>
        </FHEVMProvider>
      ) : (
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Connect Your Wallet to Get Started</h2>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            You need to connect your MetaMask wallet to interact with the application.
          </p>
        </div>
      )}
    </div>
  );
}
