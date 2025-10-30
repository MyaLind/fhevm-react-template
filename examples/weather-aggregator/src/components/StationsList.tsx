import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';

interface StationInfo {
  id: number;
  address: string;
  location: string;
  isActive: boolean;
  hasSubmitted: boolean;
  totalSubmissions: number;
}

export const StationsList: React.FC = () => {
  const { contract } = useContract();
  const [stations, setStations] = useState<StationInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const loadStations = async () => {
    if (!contract) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const stationCount = await contract.stationCount();

      if (stationCount.toString() === '0') {
        setStations([]);
        setLoading(false);
        return;
      }

      const stationsData: StationInfo[] = [];

      for (let i = 1; i <= stationCount; i++) {
        try {
          const stationInfo = await contract.getStationInfo(i);
          const hasSubmitted = await contract.hasStationSubmitted(i);

          stationsData.push({
            id: i,
            address: stationInfo[0],
            location: stationInfo[1],
            isActive: stationInfo[2],
            hasSubmitted: hasSubmitted,
            totalSubmissions: stationInfo[4].toNumber(),
          });
        } catch (err) {
          console.error(`Error loading station ${i}:`, err);
        }
      }

      setStations(stationsData);
    } catch (err: any) {
      console.error('Error loading stations:', err);
      setError('Failed to load stations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStations();
  }, [contract]);

  return (
    <div className="card">
      <h2>Weather Stations</h2>
      <div id="stationsList" className="station-list">
        {loading ? (
          <div className="status info">Loading stations...</div>
        ) : error ? (
          <div className="status error">{error}</div>
        ) : stations.length === 0 ? (
          <div className="status info">No weather stations registered yet</div>
        ) : (
          stations.map((station) => (
            <div key={station.id} className="station-item">
              <h4>
                Station {station.id}: {station.location}
              </h4>
              <div className="station-info">
                <strong>Address:</strong> {station.address.substring(0, 10)}...
                <br />
                <strong>Active:</strong> {station.isActive ? 'Yes' : 'No'}
                <br />
                <strong>Submitted This Period:</strong> {station.hasSubmitted ? 'Yes' : 'No'}
                <br />
                <strong>Total Submissions:</strong> {station.totalSubmissions}
              </div>
            </div>
          ))
        )}
      </div>
      <button className="btn" onClick={loadStations}>
        Refresh Stations
      </button>
    </div>
  );
};
