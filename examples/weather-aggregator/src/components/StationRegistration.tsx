import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';

interface StationRegistrationProps {
  account: string | null;
}

export const StationRegistration: React.FC<StationRegistrationProps> = ({ account }) => {
  const { contract } = useContract();
  const [stationAddress, setStationAddress] = useState<string>('');
  const [stationLocation, setStationLocation] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (account) {
      setStationAddress(account);
    }
  }, [account]);

  const handleRegister = async () => {
    if (!contract || !account) {
      setStatusType('error');
      setStatusMessage('Please connect wallet first');
      return;
    }

    if (!stationAddress || !stationLocation) {
      setStatusType('error');
      setStatusMessage('Please fill in station address and location');
      return;
    }

    try {
      const owner = await contract.owner();
      if (account.toLowerCase() !== owner.toLowerCase()) {
        setStatusType('error');
        setStatusMessage(
          `Only the contract owner can register new weather stations. Owner: ${owner.substring(
            0,
            10
          )}... Your address: ${account.substring(0, 10)}...`
        );
        return;
      }

      setIsLoading(true);
      setStatusType('info');
      setStatusMessage('Transaction submitted. Waiting for confirmation...');

      const tx = await contract.registerStation(stationAddress, stationLocation);
      await tx.wait();

      setStatusType('success');
      setStatusMessage('Weather station registered successfully!');
      setStationLocation('');
    } catch (error: any) {
      console.error('Error registering station:', error);
      let errorMessage = error.message;

      if (errorMessage.includes('Station already registered')) {
        errorMessage =
          'This station address is already registered. Each address can only be registered once.';
      } else if (errorMessage.includes('Not authorized')) {
        errorMessage = 'Access denied: Only the contract owner can register stations';
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
      <h2>Register Weather Station</h2>
      <p style={{ marginBottom: '20px', color: '#718096' }}>
        Register your address as a weather station (Owner only)
      </p>

      <div className="form-group">
        <label htmlFor="stationAddress">Station Address</label>
        <input
          type="text"
          id="stationAddress"
          placeholder="0x..."
          value={stationAddress}
          readOnly
        />
      </div>
      <div className="form-group">
        <label htmlFor="stationLocation">Station Location</label>
        <input
          type="text"
          id="stationLocation"
          placeholder="e.g., City Center Station"
          value={stationLocation}
          onChange={(e) => setStationLocation(e.target.value)}
        />
      </div>

      <button className="btn" id="registerStationBtn" onClick={handleRegister} disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register Station'}
      </button>
      {statusMessage && (
        <div id="registerStatus" className={`status ${statusType}`} style={{ marginTop: '10px' }}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};
