# Next.js Weather Aggregator - FHEVM SDK Example

A Next.js 14 application demonstrating the **FHEVM SDK** for building privacy-preserving decentralized applications with Fully Homomorphic Encryption.

## 🎯 What This Demonstrates

This Next.js application showcases:

- **FHEVMProvider Integration**: Context provider setup in Next.js App Router
- **React Hooks Usage**: `useFHEVM()`, `useEncrypt()`, `useFHEContract()`
- **Client-Side Encryption**: Encrypting data before blockchain submission
- **Smart Contract Interaction**: Reading and writing to FHE-enabled contracts
- **TypeScript Support**: Full type safety with the SDK

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask wallet
- Sepolia testnet ETH

### Installation

```bash
# From the nextjs-weather directory
npm install
```

Or from the root directory:

```bash
npm run install:all
```

### Development

```bash
# Start development server
npm run dev

# Or from root
npm run dev:nextjs
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
nextjs-weather/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page with FHEVMProvider
│   └── globals.css         # Global styles
├── components/
│   ├── WeatherStation.tsx  # Weather data submission form
│   ├── ForecastDisplay.tsx # Display aggregated forecasts
│   └── ContractInfo.tsx    # Contract information display
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md              # This file
```

## 💻 SDK Usage Examples

### 1. Provider Setup (app/page.tsx)

```tsx
import { FHEVMProvider } from '@fhevm/sdk';
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);

<FHEVMProvider config={{ provider }}>
  <YourApp />
</FHEVMProvider>
```

### 2. Client Status Hook (components/WeatherStation.tsx)

```tsx
import { useFHEVM } from '@fhevm/sdk';

function WeatherStation() {
  const { client, isReady } = useFHEVM();

  if (!isReady) {
    return <div>Initializing FHE client...</div>;
  }

  // Client is ready to use
}
```

### 3. Encryption Hook (components/WeatherStation.tsx)

```tsx
import { useEncrypt } from '@fhevm/sdk';

function WeatherStation() {
  const { encrypt, data, isLoading, error, reset } = useEncrypt();

  const handleSubmit = async () => {
    // Encrypt a temperature value (22.5°C stored as 2250)
    await encrypt(2250, 'euint32');

    if (data) {
      // data.data contains encrypted bytes
      await contract.submitWeatherData(data.data);
    }

    reset(); // Clear state
  };
}
```

### 4. Contract Hook (components/ForecastDisplay.tsx)

```tsx
import { useFHEContract } from '@fhevm/sdk';

function ForecastDisplay() {
  const { contract, isLoading } = useFHEContract(
    '0x291B77969Bb18710609C35d263adCb0848a3f82F',
    contractABI
  );

  const loadData = async () => {
    if (contract) {
      const count = await contract.forecastCount();
      // Use contract methods
    }
  };
}
```

## 🔧 Key Features

### Privacy-Preserving Data Submission

Weather stations submit encrypted measurements:

1. **Client-side encryption** using `useEncrypt()` hook
2. **Type-safe operations** with TypeScript
3. **Loading states** managed automatically
4. **Error handling** built into hooks

### Smart Contract Integration

Interact with FHE-enabled contracts:

1. **Read encrypted data** from blockchain
2. **Submit encrypted values** without revealing raw data
3. **Generate forecasts** from aggregated encrypted data
4. **View results** after Gateway decryption

### Next.js App Router Benefits

- **Server Components**: Optimized performance
- **Client Components**: Interactive UI with 'use client'
- **Route Handlers**: API routes for backend logic
- **Metadata API**: SEO optimization

## 🎨 Styling

The application uses modern CSS with:

- CSS Variables for theming
- Responsive grid layouts
- Custom components (cards, buttons, badges)
- Loading states and animations
- Alert messages for user feedback

## 🔒 Security & Privacy

### How FHE Protects Privacy

1. **Encryption happens client-side** before data leaves the browser
2. **Smart contract performs computations** on encrypted data
3. **Individual values never exposed** on-chain
4. **Only aggregated results** are decrypted via Gateway

### Example Flow

```
Raw Data (22.5°C)
    ↓ useEncrypt()
Encrypted Data (euint32)
    ↓ Submit to Contract
On-Chain Storage (encrypted)
    ↓ FHE Aggregation
Encrypted Sum
    ↓ Gateway Decryption
Final Average (20.3°C)
```

## 📚 Learn More

### FHEVM SDK Documentation

- [SDK API Reference](../../packages/fhevm-sdk/README.md)
- [Main Repository README](../../README.md)
- [GitHub Repository](https://github.com/MyaLind/FHEWeatherAggregator)

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

### Zama Resources

- [Zama fhEVM Documentation](https://docs.zama.ai/fhevm)
- [FHE Introduction](https://www.zama.ai/post/homomorphic-encryption-101)

## 🌐 Deployment

### Deploy to Vercel

The easiest way to deploy this Next.js app:

```bash
npm install -g vercel
vercel
```

Or use the [Vercel Platform](https://vercel.com/new).

### Deploy to Other Platforms

This app can be deployed to any platform that supports Next.js:

- **Netlify**: `npm run build` → Deploy `out/` folder
- **AWS Amplify**: Connect GitHub repo
- **Railway**: Connect GitHub repo
- **DigitalOcean App Platform**: Connect GitHub repo

### Environment Variables

No environment variables required for the frontend. The contract address is hardcoded in the components.

For production, consider using:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x291B77969Bb18710609C35d263adCb0848a3f82F
NEXT_PUBLIC_CHAIN_ID=11155111
```

## 🐛 Troubleshooting

### MetaMask Not Connecting

1. Ensure MetaMask is installed
2. Switch to Sepolia testnet
3. Refresh the page

### Contract Calls Failing

1. Check you have Sepolia ETH for gas
2. Verify contract address is correct
3. Check console for error messages

### Encryption Not Working

1. Ensure FHE client is initialized (`isReady === true`)
2. Check browser console for errors
3. Verify ethers.js provider is connected

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

## 🤝 Contributing

This example is part of the FHEVM SDK project. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a Pull Request

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.

## 🙏 Acknowledgments

- **Zama**: For fhEVM technology
- **Next.js Team**: For the excellent framework
- **Vercel**: For hosting platform

---

**Built with ❤️ using FHEVM SDK and Next.js**

For questions or issues, visit the [GitHub repository](https://github.com/MyaLind/FHEWeatherAggregator).
