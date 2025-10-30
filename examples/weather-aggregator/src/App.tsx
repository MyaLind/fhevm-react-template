import React, { useEffect } from 'react';
import { WalletConnection } from './components/WalletConnection';
import { ContractInfo } from './components/ContractInfo';
import { StationRegistration } from './components/StationRegistration';
import { WeatherDataSubmission } from './components/WeatherDataSubmission';
import { ForecastGeneration } from './components/ForecastGeneration';
import { StationsList } from './components/StationsList';
import { ForecastHistory } from './components/ForecastHistory';
import { useWallet } from './hooks/useWallet';
import { useContract } from './hooks/useContract';
import './App.css';

const App: React.FC = () => {
  const { isConnected, connect, account, connectionStatus, networkName } = useWallet();
  const { refreshAll } = useContract();

  useEffect(() => {
    if (isConnected) {
      refreshAll();
    }
  }, [isConnected, refreshAll]);

  return (
    <div className="app-container">
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`} id="connectionStatus">
        {connectionStatus}
      </div>

      <div className="container">
        <div className="header">
          <h1>Confidential Weather Aggregator</h1>
          <p>Secure weather data aggregation using FHE encryption</p>
          <p className="subtitle">React Application with Enhanced Features</p>
        </div>

        <div className="grid">
          <WalletConnection
            isConnected={isConnected}
            account={account}
            onConnect={connect}
            networkName={networkName}
          />
          <ContractInfo />
        </div>

        <StationRegistration account={account} />
        <WeatherDataSubmission />
        <ForecastGeneration />

        <div className="grid">
          <StationsList />
          <ForecastHistory />
        </div>
      </div>
    </div>
  );
};

export default App;
