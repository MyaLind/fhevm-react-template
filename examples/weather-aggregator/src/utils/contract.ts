export const CONTRACT_ADDRESS = "0x291B77969Bb18710609C35d263adCb0848a3f82F";

export const CONTRACT_ABI = [
  "function registerStation(address stationAddress, string calldata location) external",
  "function submitWeatherData(uint32 temperature, uint32 humidity, uint32 pressure, uint8 windSpeed) external",
  "function generateRegionalForecast() external",
  "function getCurrentForecastInfo() external view returns (uint256, bool, bool, uint256)",
  "function getStationInfo(uint256 stationId) external view returns (address, string memory, bool, uint256, uint256)",
  "function getRegionalForecast(uint256 forecastId) external view returns (uint32, uint32, uint32, uint8, uint256, uint256, bool)",
  "function stationCount() external view returns (uint256)",
  "function forecastCount() external view returns (uint256)",
  "function owner() external view returns (address)",
  "function canSubmitData() external view returns (bool)",
  "function canGenerateForecast() external view returns (bool)",
  "function getCurrentHour() external view returns (uint256)",
  "function hasStationSubmitted(uint256 stationId) external view returns (bool)",
  "function getActiveStationCount() external view returns (uint256)",
  "function timeWindowEnabled() external view returns (bool)",
  "function setTimeWindowEnabled(bool enabled) external",
  "function processForecastResult(uint256 requestId, uint32 totalTemperature, uint32 totalHumidity, uint32 totalPressure, uint32 totalWindSpeed) public"
];
