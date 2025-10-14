'use client';

import { useState } from 'react';
import { useFHEVM, useEncrypt, useFHEContract } from '@fhevm/sdk';

const CONTRACT_ADDRESS = '0x291B77969Bb18710609C35d263adCb0848a3f82F';

const CONTRACT_ABI = [
  'function submitWeatherData(uint32 temperature, uint32 humidity, uint32 pressure, uint8 windSpeed) external',
  'function stationCount() view returns (uint256)',
  'function timeWindowEnabled() view returns (bool)',
];

export default function WeatherStation() {
  const { client, isReady } = useFHEVM();
  const { encrypt, data, isLoading, error, reset } = useEncrypt();
  const { contract } = useFHEContract(CONTRACT_ADDRESS, CONTRACT_ABI);

  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [pressure, setPressure] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contract || !isReady) {
      alert('Contract not ready');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitSuccess(false);

      // Convert to proper format (multiply by 100 for decimals)
      const tempValue = Math.round(parseFloat(temperature) * 100);
      const humidValue = Math.round(parseFloat(humidity) * 100);
      const pressValue = Math.round(parseFloat(pressure) * 100);
      const windValue = Math.round(parseFloat(windSpeed));

      // Encrypt each value
      console.log('Encrypting temperature:', tempValue);
      await encrypt(tempValue, 'euint32');
      const encryptedTemp = data;

      console.log('Encrypting humidity:', humidValue);
      await encrypt(humidValue, 'euint32');
      const encryptedHumidity = data;

      console.log('Encrypting pressure:', pressValue);
      await encrypt(pressValue, 'euint32');
      const encryptedPressure = data;

      console.log('Encrypting wind speed:', windValue);
      await encrypt(windValue, 'euint8');
      const encryptedWind = data;

      if (!encryptedTemp || !encryptedHumidity || !encryptedPressure || !encryptedWind) {
        throw new Error('Encryption failed');
      }

      // Submit to contract
      console.log('Submitting encrypted data to contract...');
      const tx = await contract.submitWeatherData(
        encryptedTemp.data,
        encryptedHumidity.data,
        encryptedPressure.data,
        encryptedWind.data
      );

      console.log('Transaction submitted:', tx.hash);
      await tx.wait();
      console.log('Transaction confirmed!');

      setSubmitSuccess(true);
      reset();

      // Clear form
      setTemperature('');
      setHumidity('');
      setPressure('');
      setWindSpeed('');

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting data:', err);
      alert(err instanceof Error ? err.message : 'Failed to submit data');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2>📊 Submit Weather Data</h2>

      {!isReady && (
        <div className="alert alert-info">
          <strong>Initializing FHE client...</strong>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            The SDK is setting up encryption capabilities.
          </p>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <strong>Encryption Error:</strong> {error}
        </div>
      )}

      {submitSuccess && (
        <div className="alert alert-success">
          <strong>✅ Success!</strong> Your encrypted weather data has been submitted.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="temperature">
            Temperature (°C)
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
              Range: -100 to 100
            </span>
          </label>
          <input
            type="number"
            id="temperature"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            step="0.1"
            min="-100"
            max="100"
            required
            disabled={!isReady || submitting}
          />
        </div>

        <div className="input-group">
          <label htmlFor="humidity">
            Humidity (%)
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
              Range: 0 to 100
            </span>
          </label>
          <input
            type="number"
            id="humidity"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
            step="0.1"
            min="0"
            max="100"
            required
            disabled={!isReady || submitting}
          />
        </div>

        <div className="input-group">
          <label htmlFor="pressure">
            Pressure (hPa)
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
              Range: 900 to 1100
            </span>
          </label>
          <input
            type="number"
            id="pressure"
            value={pressure}
            onChange={(e) => setPressure(e.target.value)}
            step="0.1"
            min="900"
            max="1100"
            required
            disabled={!isReady || submitting}
          />
        </div>

        <div className="input-group">
          <label htmlFor="windSpeed">
            Wind Speed (km/h)
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
              Range: 0 to 200
            </span>
          </label>
          <input
            type="number"
            id="windSpeed"
            value={windSpeed}
            onChange={(e) => setWindSpeed(e.target.value)}
            step="1"
            min="0"
            max="200"
            required
            disabled={!isReady || submitting}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isReady || submitting || isLoading}
          style={{ width: '100%' }}
        >
          {submitting || isLoading ? (
            <>
              <span className="loading" />
              {isLoading ? 'Encrypting...' : 'Submitting...'}
            </>
          ) : (
            '🔒 Encrypt & Submit Data'
          )}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <strong>🔐 Privacy Note:</strong> Your data is encrypted client-side using the FHEVM SDK before
          submission. Individual measurements remain private on-chain.
        </p>
      </div>
    </div>
  );
}
