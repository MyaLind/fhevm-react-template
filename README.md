# FHEVM SDK - Universal Toolkit for Privacy-Preserving dApps

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react)](https://reactjs.org/)

A universal, framework-agnostic SDK for building privacy-preserving decentralized applications using Fully Homomorphic Encryption (FHE) on Ethereum.

## 🎯 Overview

The FHEVM SDK provides a **wagmi-like** developer experience for building applications with Fully Homomorphic Encryption. It abstracts away the complexity of FHE operations while providing a familiar, intuitive API for web3 developers.

### Key Features

- 🔐 **Fully Homomorphic Encryption**: Compute on encrypted data without decryption
- ⚛️ **wagmi-Style API**: Familiar hooks and patterns for web3 developers
- 🎯 **Framework Agnostic**: Core library works with any JavaScript framework
- 📘 **TypeScript First**: Complete type safety with comprehensive definitions
- 🧩 **Modular Architecture**: Use only what you need
- 🚀 **Production Ready**: Tested with live deployments

## 📦 Packages

This monorepo contains:

- **`@fhevm/sdk`**: Core SDK with React hooks (packages/fhevm-sdk/)
- **`@fhevm-sdk/contracts`**: Example smart contracts (packages/contracts/)
- **Next.js Weather Example**: Modern Next.js 14 App Router demo (examples/nextjs-weather/)
- **HTML Weather Example**: Static HTML/JavaScript demo (examples/weather-aggregator/)

## 🚀 Quick Start

### Installation

```bash
# Install all packages from root
npm run install:all

# Or install individually
cd packages/fhevm-sdk && npm install
cd packages/contracts && npm install
```

### Build

```bash
# Build everything
npm run build

# Or build individually
npm run build:sdk        # Build SDK package
npm run build:contracts  # Compile smart contracts
```

### Run Examples

```bash
# Start the Next.js example (recommended)
npm run dev:nextjs
# Opens at http://localhost:3000

# Or start the HTML example
npm run dev:example
# Opens at http://localhost:8080
```

## 💻 Usage

### React Application

#### 1. Install the SDK

```bash
npm install @fhevm/sdk ethers
```

#### 2. Wrap your app with FHEVMProvider

```tsx
import { FHEVMProvider } from '@fhevm/sdk';
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);

function App() {
  return (
    <FHEVMProvider config={{ provider }}>
      <YourApp />
    </FHEVMProvider>
  );
}
```

#### 3. Use hooks in your components

```tsx
import { useEncrypt, useFHEVM } from '@fhevm/sdk';

function PrivateDataForm() {
  const { client, isReady } = useFHEVM();
  const { encrypt, data, isLoading } = useEncrypt();

  const handleSubmit = async (value: number) => {
    await encrypt(value, 'euint32');
    // data now contains encrypted value ready for contract submission
  };

  return (
    <button onClick={() => handleSubmit(42)} disabled={!isReady}>
      {isLoading ? 'Encrypting...' : 'Submit Private Data'}
    </button>
  );
}
```

### Framework-Agnostic Usage

```typescript
import { FHEVMClient } from '@fhevm/sdk/core';

const client = new FHEVMClient({ provider });
await client.init();

const encrypted = await client.encrypt(42, 'euint32');
```

## 📚 API Documentation

### React Hooks

- **`useFHEVM()`**: Access FHE client and status
- **`useEncrypt()`**: Encrypt values with loading states
- **`useDecrypt()`**: Decrypt values (with Gateway)
- **`useFHEContract()`**: Interact with FHE-enabled contracts

See [packages/fhevm-sdk/README.md](packages/fhevm-sdk/README.md) for complete API documentation.

## 🌟 Example: Confidential Weather Aggregator

A full-featured example application demonstrating the SDK's capabilities.

### Live Demo

**Application**: [https://weather-aggregator.vercel.app/](https://weather-aggregator.vercel.app/)

**Smart Contract** (Sepolia): `0x291B77969Bb18710609C35d263adCb0848a3f82F`

### What It Demonstrates

- **Privacy-Preserving Aggregation**: Multiple weather stations submit encrypted measurements
- **Computation on Encrypted Data**: Smart contract aggregates without decryption
- **Selective Decryption**: Only final averages are decrypted and made public
- **Complete Integration**: Full SDK workflow from encryption to decryption

### Use Case

Weather stations need to share data for accurate regional forecasts, but want to keep individual measurements private. The SDK enables:

1. **Stations encrypt data** using `useEncrypt()` hook
2. **Smart contract aggregates** encrypted values with FHE operations
3. **Gateway decrypts** only the final sum
4. **Contract publishes** average forecast (individual data stays private)

## 🏗️ Project Structure

```
fhevm-react-template/
├── packages/
│   ├── fhevm-sdk/              # 📦 Core SDK Package
│   │   ├── src/
│   │   │   ├── core/           # Framework-agnostic FHE client
│   │   │   │   └── FHEVMClient.ts
│   │   │   ├── react/          # React hooks and providers
│   │   │   │   ├── FHEVMProvider.tsx
│   │   │   │   └── hooks.ts
│   │   │   ├── types/          # TypeScript definitions
│   │   │   │   └── index.ts
│   │   │   └── index.ts        # Main exports
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md           # SDK documentation
│   │
│   └── contracts/              # 📝 Example Smart Contracts
│       ├── contracts/
│       │   └── ConfidentialWeatherAggregator.sol
│       ├── scripts/
│       │   └── deploy.js
│       ├── hardhat.config.js
│       └── package.json
│
├── examples/
│   ├── nextjs-weather/         # 🌤️ Next.js 14 Example (Recommended)
│   │   ├── app/                # Next.js App Router
│   │   ├── components/         # React components using SDK
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── weather-aggregator/     # 📄 HTML/JavaScript Example
│       ├── index.html          # Static frontend
│       └── docs/               # Additional docs
│
├── package.json                # Root workspace config
├── README.md                   # This file
├── LICENSE                     # MIT License
└── .gitignore
```

## 🎓 SDK Design Principles

### 1. wagmi-Like API

Familiar patterns for web3 developers:

```tsx
// Just like wagmi's useAccount, useContract, etc.
const { client, isReady } = useFHEVM();
const { encrypt, data } = useEncrypt();
```

### 2. Framework Agnostic Core

```typescript
// Works with React, Vue, Angular, or vanilla JS
import { FHEVMClient } from '@fhevm/sdk/core';
```

### 3. Type Safety First

```typescript
// Full TypeScript support with intelligent autocomplete
type EncryptedType = 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool';
const encrypted: EncryptedData = await client.encrypt(42, 'euint32');
```

### 4. Modular and Tree-Shakeable

```typescript
// Import only what you need
import { useEncrypt } from '@fhevm/sdk';  // React hooks
import { FHEVMClient } from '@fhevm/sdk/core';  // Core only
```

## 🔧 Development

### Prerequisites

- Node.js v18+
- npm or yarn
- MetaMask (for testing)

### Install Dependencies

```bash
# From root - installs all packages
npm run install:all
```

### Build SDK

```bash
npm run build:sdk
```

### Compile Contracts

```bash
npm run build:contracts
```

### Deploy Contracts

```bash
# Configure .env in packages/contracts/
# Then deploy to Sepolia
npm run deploy:contracts
```

### Run Examples

```bash
# Next.js example (recommended)
npm run dev:nextjs
# Opens at http://localhost:3000

# HTML example
npm run dev:example
# Opens at http://localhost:8080
```

## 📹 Video Demonstration

A comprehensive video demonstration is available showing:

- SDK installation and setup
- Building with React hooks
- Encrypting and submitting data
- Smart contract integration
- Live example walkthrough

demo1.mp4
demo2.mp4
demo3.mp4

## 🌐 Deployment Links

### Live Applications

- **Weather Aggregator Demo**: [https://weather-aggregator.vercel.app/](https://weather-aggregator.vercel.app/)

### Smart Contracts (Sepolia Testnet)

- **ConfidentialWeatherAggregator**: [`0x291B77969Bb18710609C35d263adCb0848a3f82F`](https://sepolia.etherscan.io/address/0x291B77969Bb18710609C35d263adCb0848a3f82F)
- **Owner Address**: `0xee8d5E90a8c481C5D482fdbb278649A66fF96A9A`
- **Gateway Address**: `0x33347831500F1E73F0CccBBe71C7E21Ca0100a42`

### Repository

- **GitHub**: [https://github.com/MyaLind/fhevm-react-template](https://github.com/MyaLind/fhevm-react-template)

## 💡 Use Cases

The SDK enables various privacy-preserving applications:

### Implemented: Confidential Weather Aggregation
- Multiple data sources contribute without revealing individual measurements
- Real-world example deployed on Sepolia

### Potential Applications:
- **Confidential Voting**: Vote without revealing choices
- **Private Auctions**: Sealed bids with fair outcomes
- **Anonymous Donations**: Support causes privately
- **Secret Surveys**: Honest responses, aggregate insights
- **Confidential DeFi**: Private trading and lending
- **Healthcare Data**: HIPAA-compliant blockchain applications
- **Supply Chain Privacy**: Competitive data, collaborative outcomes

## 🔒 Security & Privacy

### FHE Workflow

1. **Client-side Encryption**: Data encrypted in browser before transmission
2. **Encrypted Storage**: All sensitive data stored as encrypted ciphertexts
3. **Computation on Encrypted Data**: Smart contracts perform operations without decryption
4. **Selective Decryption**: Only final results decrypted via Zama Gateway
5. **No Raw Data Exposure**: Individual private data never visible on-chain

### Security Features

- Client-side encryption before blockchain submission
- Zero-knowledge of individual values
- Gateway-controlled decryption
- Type-safe operations
- Access control at contract level

## 🤝 Contributing

We welcome contributions! Whether it's:

- Bug reports and feature requests (GitHub Issues)
- Documentation improvements
- Code contributions (Pull Requests)
- Example applications
- Integration guides

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a Pull Request

 

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama**: For pioneering FHE technology and fhEVM
- **Ethereum Foundation**: For the blockchain platform
- **wagmi Team**: For API design inspiration
- **The Web3 Community**: For continuous support

## 📞 Support & Resources

### Documentation

- [SDK API Documentation](packages/fhevm-sdk/README.md)
- [Next.js Example Guide](examples/nextjs-weather/README.md)
- [HTML Example Guide](examples/weather-aggregator)
- [Zama fhEVM Documentation](https://docs.zama.ai/fhevm)

### Links

- **GitHub Repository**: [https://github.com/MyaLind/fhevm-react-template](https://github.com/MyaLind/fhevm-react-template)
- **Live Demo**: [https://weather-aggregator.vercel.app/](https://weather-aggregator.vercel.app/)


### Community

- Report bugs and request features via GitHub Issues
- Contribute code via Pull Requests
- Share your projects built with the SDK

---

**Built with ❤️ for privacy-first web3 development**

*Making Fully Homomorphic Encryption accessible to every developer*
