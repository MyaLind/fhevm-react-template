import React, { useState } from 'react';
import { useContract } from '../hooks/useContract';

export const WeatherDataSubmission: React.FC = () => {
  const { contract } = useContract();
  const [temperature, setTemperature] = useState<string>('');
  const [humidity, setHumidity] = useState<string>('');
  const [pressure, setPressure] = useState<string>('');
  const [windSpeed, setWindSpeed] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!contract) {
      setStatusType('error');
      setStatusMessage('Please connect wallet first');
      return;
    }

    if (!temperature || !humidity || !pressure || !windSpeed) {
      setStatusType('error');
      setStatusMessage('Please fill in all weather data fields');
      return;
    }

    try {
      setIsLoading(true);
      setStatusType('info');
      setStatusMessage('Transaction submitted. Waiting for confirmation...');

      // Convert to the required format (multiply by 100 for precision)
      const tempValue = Math.round(parseFloat(temperature) * 100);
      const humidityValue = Math.round(parseFloat(humidity) * 100);
      const pressureValue = Math.round(parseFloat(pressure) * 100);
      const windSpeedValue = Math.round(parseFloat(windSpeed));

      const tx = await contract.submitWeatherData(
        tempValue,
        humidityValue,
        pressureValue,
        windSpeedValue
      );

      await tx.wait();

      setStatusType('success');
      setStatusMessage('Weather data submitted successfully!');

      // Clear form
      setTemperature('');
      setHumidity('');
      setPressure('');
      setWindSpeed('');
    } catch (error: any) {
      console.error('Error submitting weather data:', error);
      let errorMessage = error.message;

      if (errorMessage.includes('Not authorized')) {
        errorMessage = 'Only registered weather stations can submit data';
      } else if (errorMessage.includes('Already submitted')) {
        errorMessage = 'You have already submitted data for this forecast period';
      } else if (errorMessage.includes('Cannot submit data')) {
        errorMessage = 'Data submission window is closed. Wait for next forecast period.';
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
      <h2>Submit Weather Data</h2>
      <p style={{ marginBottom: '20px', color: '#718096' }}>
        Submit encrypted weather data from your weather station
      </p>

      <div className="grid">
        <div className="form-group">
          <label htmlFor="temperature">Temperature (C)</label>
          <input
            type="number"
            id="temperature"
            step="0.01"
            placeholder="e.g., 22.5"
            min="-100"
            max="100"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="humidity">Humidity (%)</label>
          <input
            type="number"
            id="humidity"
            step="0.01"
            placeholder="e.g., 65.0"
            min="0"
            max="100"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pressure">Pressure (hPa)</label>
          <input
            type="number"
            id="pressure"
            step="0.01"
            placeholder="e.g., 1013.25"
            min="900"
            max="1100"
            value={pressure}
            onChange={(e) => setPressure(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="windSpeed">Wind Speed (km/h)</label>
          <input
            type="number"
            id="windSpeed"
            step="0.1"
            placeholder="e.g., 15.0"
            min="0"
            max="200"
            value={windSpeed}
            onChange={(e) => setWindSpeed(e.target.value)}
          />
        </div>
      </div>

      <button className="btn" id="submitDataBtn" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit Weather Data'}
      </button>
      {statusMessage && (
        <div id="submitStatus" className={`status ${statusType}`} style={{ marginTop: '10px' }}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};
