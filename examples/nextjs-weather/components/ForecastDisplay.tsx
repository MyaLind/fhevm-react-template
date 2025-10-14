'use client';

import { useState, useEffect } from 'react';
import { useFHEContract } from '@fhevm/sdk';

const CONTRACT_ADDRESS = '0x291B77969Bb18710609C35d263adCb0848a3f82F';

const CONTRACT_ABI = [
  'function forecastCount() view returns (uint256)',
  'function getRegionalForecast(uint256 forecastId) view returns (uint32 temperature, uint32 humidity, uint32 pressure, uint8 windSpeed, uint256 timestamp, uint256 participatingStations, bool isGenerated)',
  'function generateRegionalForecast() external',
];

interface Forecast {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  timestamp: number;
  participatingStations: number;
  isGenerated: boolean;
}

export default function ForecastDisplay() {
  const { contract } = useFHEContract(CONTRACT_ADDRESS, CONTRACT_ABI);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (contract) {
      loadForecasts();
    }
  }, [contract]);

  const loadForecasts = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const count = await contract.forecastCount();
      const forecastCount = Number(count);

      const forecastPromises = [];
      // Load last 5 forecasts
      const start = Math.max(0, forecastCount - 5);
      for (let i = start; i < forecastCount; i++) {
        forecastPromises.push(contract.getRegionalForecast(i));
      }

      const results = await Promise.all(forecastPromises);
      const formattedForecasts = results.map((result: any) => ({
        temperature: Number(result[0]) / 100,
        humidity: Number(result[1]) / 100,
        pressure: Number(result[2]) / 100,
        windSpeed: Number(result[3]),
        timestamp: Number(result[4]),
        participatingStations: Number(result[5]),
        isGenerated: result[6],
      }));

      setForecasts(formattedForecasts.reverse());
    } catch (error) {
      console.error('Error loading forecasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateForecast = async () => {
    if (!contract) return;

    try {
      setGenerating(true);
      const tx = await contract.generateRegionalForecast();
      console.log('Forecast generation transaction:', tx.hash);
      await tx.wait();
      console.log('Forecast generation complete!');

      // Reload forecasts after generation
      setTimeout(() => loadForecasts(), 2000);
    } catch (error: any) {
      console.error('Error generating forecast:', error);
      alert(error.message || 'Failed to generate forecast');
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>📈 Regional Forecasts</h2>
        <button
          className="btn btn-success"
          onClick={handleGenerateForecast}
          disabled={generating || !contract}
        >
          {generating ? (
            <>
              <span className="loading" />
              Generating...
            </>
          ) : (
            '🔮 Generate Forecast'
          )}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <span className="loading" style={{ width: '32px', height: '32px', borderWidth: '3px' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading forecasts...</p>
        </div>
      ) : forecasts.length === 0 ? (
        <div className="alert alert-info">
          <strong>No forecasts yet</strong>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Submit weather data and generate a forecast to see aggregated results.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {forecasts.map((forecast, index) => (
            <div
              key={index}
              style={{
                padding: '1.5rem',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '2px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>
                  Forecast #{forecasts.length - index}
                </h3>
                <span className="badge badge-info">
                  {forecast.participatingStations} stations
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '1rem',
                  marginTop: '1rem',
                }}
              >
                <div className="stat-card">
                  <div className="stat-value">{forecast.temperature.toFixed(1)}°C</div>
                  <div className="stat-label">Temperature</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{forecast.humidity.toFixed(1)}%</div>
                  <div className="stat-label">Humidity</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{forecast.pressure.toFixed(1)}</div>
                  <div className="stat-label">Pressure (hPa)</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{forecast.windSpeed}</div>
                  <div className="stat-label">Wind (km/h)</div>
                </div>
              </div>

              <p
                style={{
                  marginTop: '1rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                }}
              >
                Generated: {formatDate(forecast.timestamp)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px' }}>
        <p style={{ fontSize: '0.875rem', color: '#92400e' }}>
          <strong>🔐 Privacy Guarantee:</strong> These averages are computed from encrypted data.
          Individual station measurements remain private and are never exposed on-chain.
        </p>
      </div>
    </div>
  );
}
