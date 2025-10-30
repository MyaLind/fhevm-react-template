import React, { useState } from 'react';
import { useContract } from '../hooks/useContract';

export const ForecastGeneration: React.FC = () => {
  const { contract } = useContract();
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!contract) {
      setStatusType('error');
      setStatusMessage('Please connect wallet first');
      return;
    }

    try {
      setIsLoading(true);
      setStatusType('info');
      setStatusMessage('Transaction submitted. Waiting for confirmation...');

      const tx = await contract.generateRegionalForecast();
      await tx.wait();

      setStatusType('success');
      setStatusMessage('Regional forecast generation initiated!');
    } catch (error: any) {
      console.error('Error generating forecast:', error);
      let errorMessage = error.message;

      if (errorMessage.includes('Cannot generate forecast')) {
        errorMessage = 'Cannot generate forecast at this time. Check forecast period timing.';
      } else if (errorMessage.includes('No stations submitted')) {
        errorMessage = 'No weather stations have submitted data yet';
      } else if (errorMessage.includes('Already generated')) {
        errorMessage = 'Forecast has already been generated for this period';
      } else if (errorMessage.includes('user rejected')) {
        errorMessage = 'Transaction was rejected by user';
      } else if (errorMessage.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas fees';
      }

      setStatusType('error');
      setStatusMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Generate Regional Forecast</h2>
      <p style={{ marginBottom: '20px', color: '#718096' }}>
        Aggregate data from all stations to generate regional forecast
      </p>

      <button className="btn" id="generateForecastBtn" onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Forecast'}
      </button>
      {statusMessage && (
        <div id="generateStatus" className={`status ${statusType}`} style={{ marginTop: '10px' }}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};
