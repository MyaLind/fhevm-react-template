# 🌤️ Confidential Weather Aggregator

A privacy-preserving decentralized weather forecasting platform built with Fully Homomorphic Encryption (FHE) technology on Ethereum.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://myalind.github.io/FHEWeatherAggregator/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.22.16-yellow)](https://hardhat.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🎯 Overview

The Confidential Weather Aggregator enables multiple weather stations to submit encrypted meteorological data that can be aggregated into accurate regional forecasts **without revealing individual station measurements**. This ensures data privacy while maintaining forecast accuracy through secure multi-party computation.

**Live Application**: [https://myalind.github.io/FHEWeatherAggregator/](https://myalind.github.io/FHEWeatherAggregator/)

**Repository**: [https://github.com/MyaLind/FHEWeatherAggregator](https://github.com/MyaLind/FHEWeatherAggregator)

## 📹 Demo Video

A comprehensive demonstration of the platform's features is available in **demo.mp4**. Please download the video to view the full functionality including station registration, encrypted data submission, and regional forecast generation.

## 🔑 Core Concepts

### Confidential Weather Forecast Aggregation

The platform addresses a critical challenge in meteorological data sharing: **how to aggregate weather data from multiple stations while preserving the privacy of each station's measurements**.

#### The Problem

Traditional weather forecasting systems require weather stations to share raw data openly, which creates several concerns:

- **Proprietary Data Protection**: Private weather stations may not want to reveal precise measurements
- **Competitive Advantage**: Commercial weather services need to protect their data assets
- **Data Sovereignty**: Government and institutional stations may have data sharing restrictions
- **Privacy Compliance**: GDPR and other regulations may limit data sharing

#### Our Solution: FHE-Powered Private Aggregation

Using Fully Homomorphic Encryption (FHE), our platform enables:

1. **Encrypted Data Submission**: Weather stations encrypt their measurements (temperature, humidity, pressure, wind speed) before submission
2. **Computation on Encrypted Data**: The smart contract aggregates encrypted values without decryption
3. **Private Individual Data**: Each station's specific measurements remain confidential
4. **Public Aggregated Results**: Only the final regional averages are decrypted and made public

#### Real-World Use Cases

- **Collaborative Forecasting Networks**: Competing weather services share data without revealing proprietary measurements
- **Cross-Border Data Sharing**: International weather cooperation while respecting data sovereignty laws
- **Research Collaboration**: Academic institutions contribute data to research without exposing sensitive information
- **Regulatory Compliance**: Weather data aggregation that meets privacy regulations like GDPR

### Technology Stack

- **Blockchain**: Ethereum (Sepolia Testnet)
- **Encryption**: Zama's fhEVM (Fully Homomorphic Encryption for Ethereum)
- **Smart Contracts**: Solidity 0.8.24
- **Development Framework**: Hardhat
- **Frontend**: Modern web technologies with ethers.js

## ✨ Key Features

### 🔐 Privacy-Preserving Data Aggregation

- All weather data encrypted with FHE before submission
- Computations performed on encrypted values
- Individual station data never exposed on-chain
- Only aggregated regional forecasts are publicly visible

### 🏢 Multi-Station Network

- Decentralized registration of weather stations
- Role-based access control (Owner, Weather Stations, Public)
- Station activation/deactivation management
- Real-time status monitoring

### ⚡ Automated Forecast Generation

- Minimum 3 stations required for forecast generation
- Automated aggregation of encrypted data
- Secure decryption via Zama Gateway
- Historical forecast tracking

### ⏰ Configurable Time Windows

- Owner-controlled submission periods (default: every 6 hours)
- Forecast generation windows (1 hour after submission)
- Testing mode for development and demonstrations
- UTC-based timing for global coordination

### 🎨 Modern User Interface

- Responsive design with dynamic theming
- Real-time connection status
- Comprehensive error handling
- MetaMask wallet integration
- Live data refresh

## 🏗️ Architecture

### Smart Contract Architecture

```
ConfidentialWeatherAggregator
├── Role Management
│   ├── Owner (Deploy, Register Stations, Configure)
│   └── Weather Stations (Submit Data)
│
├── Data Structures
│   ├── WeatherStation (address, location, status)
│   ├── WeatherData (encrypted measurements)
│   └── RegionalForecast (aggregated results)
│
├── Core Functions
│   ├── registerStation() - Owner only
│   ├── submitWeatherData() - Encrypted submission
│   ├── generateRegionalForecast() - FHE aggregation
│   └── processForecastResult() - Gateway callback
│
└── Time Management
    ├── canSubmitData() - Submission window check
    ├── canGenerateForecast() - Generation window check
    └── setTimeWindowEnabled() - Testing mode toggle
```

### FHE Workflow

```
┌─────────────────┐
│ Weather Station │
│   (Raw Data)    │
└────────┬────────┘
         │
         ↓ FHE.asEuint32() - Client-side encryption
┌─────────────────┐
│ Encrypted Data  │
│  (euint32/euint8)│
└────────┬────────┘
         │
         ↓ submitWeatherData()
┌─────────────────┐
│  Smart Contract │
│  (On-chain)     │
└────────┬────────┘
         │
         ↓ FHE.add() - Encrypted aggregation
┌─────────────────┐
│ Encrypted Sum   │
└────────┬────────┘
         │
         ↓ FHE.requestDecryption()
┌─────────────────┐
│  Zama Gateway   │
│  (Decryption)   │
└────────┬────────┘
         │
         ↓ processForecastResult()
┌─────────────────┐
│ Public Forecast │
│ (Average Values)│
└─────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- MetaMask wallet extension
- Sepolia testnet ETH (for gas fees)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/MyaLind/FHEWeatherAggregator.git
cd FHEWeatherAggregator
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment**

Create a `.env` file in the root directory:

```env
SEPOLIA_RPC_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_wallet_private_key
```

4. **Compile contracts**

```bash
npx hardhat compile
```

5. **Run tests**

```bash
npx hardhat test
```

## 📖 Usage Guide

### For Contract Owners

1. **Register Weather Stations**
   - Connect owner wallet
   - Enter station address and location
   - Click "Register Station"
   - Approve transaction in MetaMask

2. **Configure Time Windows**
   - Toggle time window restrictions for testing
   - Enable: Enforces 6-hour submission cycles
   - Disable: Allows submissions anytime (testing mode)

3. **Monitor System**
   - View registered stations
   - Check submission status
   - Review forecast history

### For Weather Stations

1. **Submit Weather Data**
   - Connect registered station wallet
   - Enter measurements:
     - Temperature: -100°C to 100°C
     - Humidity: 0% to 100%
     - Pressure: 900 hPa to 1100 hPa
     - Wind Speed: 0 to 200 km/h
   - Click "Submit Weather Data"
   - Confirm transaction

2. **Check Submission Status**
   - View "Submitted This Period" status
   - Monitor total submission count
   - Track last submission time

### For Public Users

1. **View Regional Forecasts**
   - Access historical forecasts
   - See aggregated weather data
   - Check participating stations count
   - View forecast timestamps

2. **Generate New Forecasts**
   - Wait for forecast generation window
   - Ensure minimum 3 stations submitted data
   - Click "Generate Forecast"
   - Wait for Gateway decryption

## 🔧 Smart Contract Details

### Deployment Information

- **Network**: Ethereum Sepolia Testnet
- **Contract Address**: `0x291B77969Bb18710609C35d263adCb0848a3f82F`
- **Owner Address**: `0xee8d5E90a8c481C5D482fdbb278649A66fF96A9A`
- **Gateway Address**: `0x33347831500F1E73F0CccBBe71C7E21Ca0100a42`

### Contract Functions

#### View Functions (No Gas Required)

```solidity
// Get current forecast period information
getCurrentForecastInfo() returns (
    uint256 currentForecastId,
    bool canSubmit,
    bool canGenerate,
    uint256 submittedStations
)

// Get station details
getStationInfo(uint256 stationId) returns (
    address stationAddress,
    string memory location,
    bool isActive,
    uint256 lastSubmissionTime,
    uint256 submissionCount
)

// Get regional forecast data
getRegionalForecast(uint256 forecastId) returns (
    uint32 temperature,
    uint32 humidity,
    uint32 pressure,
    uint8 windSpeed,
    uint256 timestamp,
    uint256 participatingStations,
    bool isGenerated
)

// Check system status
owner() returns (address)
stationCount() returns (uint256)
forecastCount() returns (uint256)
timeWindowEnabled() returns (bool)
canSubmitData() returns (bool)
canGenerateForecast() returns (bool)
getCurrentHour() returns (uint256)
hasStationSubmitted(uint256 stationId) returns (bool)
getActiveStationCount() returns (uint256)
```

#### Write Functions (Requires Gas)

```solidity
// Owner only - Register new weather station
registerStation(address stationAddress, string calldata location)

// Owner only - Toggle time window restrictions
setTimeWindowEnabled(bool enabled)

// Owner only - Deactivate a station
deactivateStation(uint256 stationId)

// Weather stations only - Submit encrypted data
submitWeatherData(
    uint32 temperature,
    uint32 humidity,
    uint32 pressure,
    uint8 windSpeed
)

// Anyone - Generate regional forecast (timing restrictions apply)
generateRegionalForecast()

// Gateway only - Process decrypted results (callback)
processForecastResult(
    uint256 requestId,
    uint32 totalTemperature,
    uint32 totalHumidity,
    uint32 totalPressure,
    uint32 totalWindSpeed
)
```

### Events

```solidity
event StationRegistered(uint256 indexed stationId, address indexed stationAddress, string location)
event WeatherDataSubmitted(uint256 indexed stationId, uint256 indexed forecastId, uint256 timestamp)
event RegionalForecastGenerated(uint256 indexed forecastId, uint256 participatingStations, uint256 timestamp)
event StationDeactivated(uint256 indexed stationId)
event TimeWindowToggled(bool enabled)
```

## 🔒 Security Features

### Access Control

- **Owner Permissions**: Station registration, system configuration, station management
- **Station Permissions**: Data submission only when registered and active
- **Gateway Protection**: Callback function restricted to Gateway address only
- **Time-based Restrictions**: Configurable submission and forecast generation windows

### Data Validation

- Temperature range: -100°C to 100°C (stored as value × 100)
- Humidity range: 0% to 100% (stored as value × 100)
- Pressure range: 900 hPa to 1100 hPa (stored as value × 100)
- Wind speed range: 0 to 200 km/h (stored as integer)

### Privacy Guarantees

- **Client-side Encryption**: Data encrypted before leaving the client
- **Encrypted Storage**: All measurements stored as euint32/euint8 types
- **Encrypted Computation**: Aggregation performed without decryption
- **Selective Decryption**: Only final averages are decrypted via Gateway
- **No Raw Data Exposure**: Individual station data never visible on-chain

## 📊 Data Flow Example

### Scenario: Three Weather Stations Submit Data

1. **Station A** (Tokyo): Submits encrypted data
   - Temperature: 22.5°C → Encrypted as euint32(2250)
   - Humidity: 65.0% → Encrypted as euint32(6500)

2. **Station B** (Seoul): Submits encrypted data
   - Temperature: 18.3°C → Encrypted as euint32(1830)
   - Humidity: 72.5% → Encrypted as euint32(7250)

3. **Station C** (Beijing): Submits encrypted data
   - Temperature: 20.1°C → Encrypted as euint32(2010)
   - Humidity: 58.7% → Encrypted as euint32(5870)

4. **Smart Contract**: Aggregates encrypted values
   - Total Temperature: FHE.add(2250, 1830, 2010) → Encrypted sum
   - Total Humidity: FHE.add(6500, 7250, 5870) → Encrypted sum

5. **Gateway**: Decrypts totals
   - Total Temperature: 6090 (decrypted)
   - Total Humidity: 19620 (decrypted)

6. **Smart Contract**: Calculates averages
   - Average Temperature: 6090 / 3 = 2030 → 20.3°C
   - Average Humidity: 19620 / 3 = 6540 → 65.4%

7. **Public Result**: Regional forecast published
   - Temperature: 20.3°C (individual values never revealed)
   - Humidity: 65.4% (individual values never revealed)

## 🌍 Use Cases

### 1. Commercial Weather Networks

**Challenge**: Competing weather services want to create better forecasts by sharing data, but don't want to reveal their proprietary measurements to competitors.

**Solution**: Each service submits encrypted data, contributes to regional forecasts, and benefits from improved accuracy without exposing their specific sensor readings.

### 2. Cross-Border Meteorological Cooperation

**Challenge**: Countries want to collaborate on weather forecasting but face data sovereignty laws that restrict raw data sharing across borders.

**Solution**: National weather agencies submit encrypted data that can be aggregated internationally while keeping raw measurements within national control.

### 3. Academic Research Networks

**Challenge**: Universities and research institutions want to contribute to large-scale climate studies but need to protect sensitive research data until publication.

**Solution**: Research stations share encrypted data for meta-analysis while maintaining exclusive rights to their raw datasets for publications.

### 4. IoT Weather Sensor Networks

**Challenge**: Smart home weather sensors can improve local forecasts, but users don't want to share exact measurements from their private property.

**Solution**: Homeowners contribute to neighborhood forecasts through encrypted submissions, enhancing accuracy while protecting personal privacy.

### 5. Agricultural Weather Monitoring

**Challenge**: Farms want to participate in regional agricultural forecasting but don't want to reveal specific microclimates that represent competitive advantages.

**Solution**: Encrypted data sharing allows collective insights for pest prediction, irrigation planning, and harvest timing without exposing individual farm conditions.

## 🛣️ Roadmap

### Phase 1: Core Platform ✅
- [x] FHE-enabled smart contracts
- [x] Weather data submission and aggregation
- [x] Gateway integration for decryption
- [x] Web-based user interface
- [x] Time window management

### Phase 2: Enhanced Features (Q2 2025)
- [ ] Multi-region support (separate forecasts per region)
- [ ] Weather alerts based on anomaly detection
- [ ] Stake-based station reputation system
- [ ] Mobile-responsive design improvements
- [ ] Advanced forecast visualizations

### Phase 3: Ecosystem Expansion (Q3 2025)
- [ ] API for third-party integrations
- [ ] Decentralized storage for historical data (IPFS)
- [ ] Token incentives for data contributors
- [ ] Cross-chain deployment (Polygon, Arbitrum)
- [ ] Machine learning forecast improvements

### Phase 4: Mainnet & Scale (Q4 2025)
- [ ] Ethereum mainnet deployment
- [ ] Governance token and DAO
- [ ] Commercial partnerships with weather services
- [ ] Mobile applications (iOS, Android)
- [ ] Integration with DeFi weather derivatives

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow Solidity style guide for smart contracts
- Use ESLint configuration for JavaScript
- Include comprehensive comments
- Write unit tests for new features
- Update documentation as needed

### Reporting Issues

Please use GitHub Issues for bug reports and feature requests. Include:

- Clear description of the issue
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (browser, wallet, network)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama**: For providing the fhEVM technology and Gateway infrastructure
- **Ethereum Foundation**: For the robust blockchain platform
- **OpenZeppelin**: For secure smart contract libraries
- **Hardhat**: For the excellent development framework
- **The Web3 Community**: For continuous support and feedback

## 📞 Contact & Support

- **GitHub Repository**: [https://github.com/MyaLind/FHEWeatherAggregator](https://github.com/MyaLind/FHEWeatherAggregator)
- **Live Application**: [https://myalind.github.io/FHEWeatherAggregator/](https://myalind.github.io/FHEWeatherAggregator/)
- **Issues**: [GitHub Issues](https://github.com/MyaLind/FHEWeatherAggregator/issues)

## 📚 Additional Resources

- [Zama fhEVM Documentation](https://docs.zama.ai/fhevm)
- [Fully Homomorphic Encryption Explained](https://en.wikipedia.org/wiki/Homomorphic_encryption)
- [Ethereum Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Hardhat Documentation](https://hardhat.org/docs)

---

**Built with ❤️ for a more private and collaborative future in weather forecasting**

*Last Updated: October 2025*
