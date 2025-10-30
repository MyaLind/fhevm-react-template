import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';

interface ForecastData {
  id: number;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  timestamp: number;
  stationCount: number;
  isGenerated: boolean;
}

export const ForecastHistory: React.FC = () => {
  const { contract } = useContract();
  const [forecasts, setForecasts] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const loadForecasts = async () => {
    if (!contract) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const forecastCount = await contract.forecastCount();

      if (forecastCount.toString() === '1') {
        setForecasts([]);
        setLoading(false);
        return;
      }

      const forecastsData: ForecastData[] = [];
      const startFrom = Math.max(1, forecastCount - 5); // Show last 5 forecasts

      for (let i = forecastCount - 1; i >= startFrom; i--) {
        try {
          const forecast = await contract.getRegionalForecast(i);

          if (forecast[6]) {
            // isGenerated
            forecastsData.push({
              id: i,
              temperature: forecast[0].toNumber(),
              humidity: forecast[1].toNumber(),
              pressure: forecast[2].toNumber(),
              windSpeed: forecast[3],
              timestamp: forecast[4].toNumber(),
              stationCount: forecast[5].toNumber(),
              isGenerated: forecast[6],
            });
          }
        } catch (err) {
          console.error(`Error loading forecast ${i}:`, err);
        }
      }

      setForecasts(forecastsData);
    } catch (err: any) {
      console.error('Error loading forecasts:', err);
      setError('Failed to load forecasts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForecasts();
  }, [contract]);

  return (
    <div className="card">
      <h2>Recent Forecasts</h2>
      <div id="forecastHistory" className="forecast-history">
        {loading ? (
          <div className="status info">Loading forecasts...</div>
        ) : error ? (
          <div className="status error">{error}</div>
        ) : forecasts.length === 0 ? (
          <div className="status info">No forecasts generated yet</div>
        ) : (
          forecasts.map((forecast) => (
            <div key={forecast.id} className="forecast-item">
              <div className="forecast-header">
                <span className="forecast-id">Forecast {forecast.id}</span>
                <span className="forecast-time">
                  {new Date(forecast.timestamp * 1000).toLocaleString()}
                </span>
              </div>
              <div className="weather-data">
                <div className="weather-item">
                  <span className="value">{(forecast.temperature / 100).toFixed(1)}C</span>
                  <span className="label">Temperature</span>
                </div>
                <div className="weather-item">
                  <span className="value">{(forecast.humidity / 100).toFixed(1)}%</span>
                  <span className="label">Humidity</span>
                </div>
                <div className="weather-item">
                  <span className="value">{(forecast.pressure / 100).toFixed(2)} hPa</span>
                  <span className="label">Pressure</span>
                </div>
                <div className="weather-item">
                  <span className="value">{forecast.windSpeed} km/h</span>
                  <span className="label">Wind Speed</span>
                </div>
              </div>
              <div style={{ marginTop: '10px', color: '#718096', fontSize: '0.9rem' }}>
                Participating Stations: {forecast.stationCount}
              </div>
            </div>
          ))
        )}
      </div>
      <button className="btn" onClick={loadForecasts}>
        Refresh Forecasts
      </button>
    </div>
  );
};
