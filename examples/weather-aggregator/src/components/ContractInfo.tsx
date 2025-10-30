import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';

export const ContractInfo: React.FC = () => {
  const { contract, account } = useContract();
  const [contractAddress, setContractAddress] = useState<string>('-');
  const [contractOwner, setContractOwner] = useState<string>('-');
  const [totalStations, setTotalStations] = useState<string>('-');
  const [userStatus, setUserStatus] = useState<string>('Not authorized');
  const [timeWindowStatus, setTimeWindowStatus] = useState<string>('-');
  const [currentForecastId, setCurrentForecastId] = useState<string>('-');
  const [canSubmitData, setCanSubmitData] = useState<string>('-');
  const [canGenerateForecast, setCanGenerateForecast] = useState<string>('-');
  const [submittedStations, setSubmittedStations] = useState<string>('-');
  const [showToggleButton, setShowToggleButton] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const refreshInfo = async () => {
    if (!contract || !account) return;

    try {
      const owner = await contract.owner();
      const stationCount = await contract.stationCount();
      const timeWindowEnabled = await contract.timeWindowEnabled();
      const forecastInfo = await contract.getCurrentForecastInfo();
      const canSubmit = await contract.canSubmitData();
      const canGenerate = await contract.canGenerateForecast();

      setContractAddress('0x291B77969Bb18710609C35d263adCb0848a3f82F');
      setContractOwner(owner.substring(0, 10) + '...');
      setTotalStations(stationCount.toString());
      setTimeWindowStatus(timeWindowEnabled ? 'Enabled' : 'Disabled');
      setCurrentForecastId(forecastInfo[0].toString());
      setCanSubmitData(canSubmit ? 'Yes' : 'No');
      setCanGenerateForecast(canGenerate ? 'Yes' : 'No');
      setSubmittedStations(forecastInfo[3].toString());

      const isOwner = account.toLowerCase() === owner.toLowerCase();
      if (isOwner) {
        setUserStatus('Contract Owner');
        setShowToggleButton(true);
      } else {
        setShowToggleButton(false);
        let status = 'Not authorized';
        try {
          for (let i = 1; i <= stationCount; i++) {
            const stationInfo = await contract.getStationInfo(i);
            if (stationInfo[0].toLowerCase() === account.toLowerCase()) {
              status = stationInfo[2] ? 'Active Station' : 'Inactive Station';
              break;
            }
          }
        } catch (error) {
          // User might not be a registered station
        }
        setUserStatus(status);
      }
    } catch (error) {
      console.error('Error refreshing contract info:', error);
    }
  };

  const toggleTimeWindow = async () => {
    if (!contract || !account) return;

    try {
      const owner = await contract.owner();
      if (account.toLowerCase() !== owner.toLowerCase()) {
        setStatusMessage('Only the contract owner can toggle time window');
        return;
      }

      const currentStatus = await contract.timeWindowEnabled();
      const newStatus = !currentStatus;

      setStatusMessage('Transaction submitted. Waiting for confirmation...');
      const tx = await contract.setTimeWindowEnabled(newStatus);
      await tx.wait();

      setStatusMessage(
        `Time window ${newStatus ? 'enabled' : 'disabled'} successfully! ${
          newStatus ? 'Restrictions apply' : 'Testing mode active'
        }`
      );
      await refreshInfo();
    } catch (error: any) {
      console.error('Error toggling time window:', error);
      setStatusMessage(error.message || 'Failed to toggle time window');
    }
  };

  useEffect(() => {
    refreshInfo();
  }, [contract, account]);

  return (
    <>
      <div className="card">
        <h2>Current Forecast Period</h2>
        <div id="currentForecastInfo">
          <div className="status info">
            <strong>Forecast ID:</strong> <span id="currentForecastId">{currentForecastId}</span>
            <br />
            <strong>Can Submit Data:</strong> <span id="canSubmitData">{canSubmitData}</span>
            <br />
            <strong>Can Generate Forecast:</strong>{' '}
            <span id="canGenerateForecast">{canGenerateForecast}</span>
            <br />
            <strong>Submitted Stations:</strong>{' '}
            <span id="submittedStations">{submittedStations}</span>
          </div>
        </div>
        <button className="btn" onClick={refreshInfo}>
          Refresh Info
        </button>
      </div>

      <div className="card">
        <h2>Contract Information</h2>
        <div className="status info">
          <strong>Contract Address:</strong> <span id="contractAddress">{contractAddress}</span>
          <br />
          <strong>Owner:</strong> <span id="contractOwner">{contractOwner}</span>
          <br />
          <strong>Total Stations:</strong> <span id="totalStations">{totalStations}</span>
          <br />
          <strong>Your Status:</strong> <span id="userStatus">{userStatus}</span>
          <br />
          <strong>Time Window:</strong> <span id="timeWindowStatus">{timeWindowStatus}</span>
        </div>
        <button className="btn" onClick={refreshInfo}>
          Refresh Info
        </button>
        {showToggleButton && (
          <button
            className="btn"
            id="toggleTimeWindowBtn"
            onClick={toggleTimeWindow}
            style={{ marginTop: '10px' }}
          >
            Toggle Time Window
          </button>
        )}
        {statusMessage && (
          <div className="status info" style={{ marginTop: '10px' }}>
            {statusMessage}
          </div>
        )}
      </div>
    </>
  );
};
