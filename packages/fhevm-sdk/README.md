# @fhevm/sdk

Universal SDK for building privacy-preserving decentralized applications with Fully Homomorphic Encryption (FHE).

## Features

- 🔐 **Fully Homomorphic Encryption**: Compute on encrypted data without decryption
- ⚛️ **React Integration**: wagmi-style hooks for seamless integration
- 🎯 **Framework Agnostic**: Core library works with any JavaScript framework
- 📘 **TypeScript First**: Full type safety with comprehensive type definitions
- 🧩 **Modular Architecture**: Use only what you need

## Installation

```bash
npm install @fhevm/sdk
```

Or with yarn:

```bash
yarn add @fhevm/sdk
```

## Quick Start

### React Integration

#### 1. Wrap your app with FHEVMProvider

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

#### 2. Use encryption hooks in your components

```tsx
import { useEncrypt, useFHEVM } from '@fhevm/sdk';

function WeatherStation() {
  const { client, isReady } = useFHEVM();
  const { encrypt, data, isLoading, error } = useEncrypt();

  const handleSubmit = async () => {
    // Encrypt a temperature value (22.5°C stored as 2250)
    await encrypt(2250, 'euint32');

    if (data) {
      // Submit encrypted data to smart contract
      console.log('Encrypted data:', data);
    }
  };

  return (
    <div>
      <button onClick={handleSubmit} disabled={!isReady || isLoading}>
        {isLoading ? 'Encrypting...' : 'Submit Data'}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### Framework-Agnostic Usage

```typescript
import { FHEVMClient } from '@fhevm/sdk/core';
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const client = new FHEVMClient({ provider });

await client.init();

// Encrypt a value
const encrypted = await client.encrypt(2250, 'euint32');

// Create input proof for contract
const proof = await client.createInputProof(
  encrypted,
  contractAddress,
  userAddress
);
```

## API Reference

### FHEVMProvider

React context provider for FHE functionality.

**Props:**

- `config: FHEVMConfig` - Configuration object
  - `provider: Provider` - Ethereum provider (required)
  - `chainId?: number` - Chain ID (optional)
  - `gatewayAddress?: string` - Gateway contract address (optional)
  - `aclAddress?: string` - ACL contract address (optional)

**Example:**

```tsx
<FHEVMProvider config={{ provider: ethersProvider, chainId: 11155111 }}>
  <App />
</FHEVMProvider>
```

### useFHEVM()

Access the FHE client and status.

**Returns:**

```typescript
{
  client: IFHEVMClient | null;
  isReady: boolean;
  error: string | null;
  provider: Provider | null;
  signer: Signer | null;
  chainId: number | null;
}
```

**Example:**

```tsx
const { client, isReady, error } = useFHEVM();

if (!isReady) {
  return <div>Initializing FHE client...</div>;
}

if (error) {
  return <div>Error: {error}</div>;
}
```

### useEncrypt()

Hook for encrypting values.

**Returns:**

```typescript
{
  data: EncryptedData | null;
  isLoading: boolean;
  error: string | null;
  encrypt: (value: number | boolean, type: EncryptedType) => Promise<void>;
  reset: () => void;
  isReady: boolean;
}
```

**Example:**

```tsx
const { encrypt, data, isLoading, error, reset } = useEncrypt();

// Encrypt different types
await encrypt(100, 'euint8');      // 8-bit unsigned integer
await encrypt(50000, 'euint32');   // 32-bit unsigned integer
await encrypt(true, 'ebool');      // Boolean

// Reset state
reset();
```

### useDecrypt()

Hook for decrypting values (typically used with Gateway callbacks).

**Returns:**

```typescript
{
  value: bigint | boolean | null;
  isLoading: boolean;
  error: string | null;
  decrypt: (ciphertext: string) => Promise<void>;
}
```

**Example:**

```tsx
const { decrypt, value, isLoading } = useDecrypt();

await decrypt(ciphertext);
console.log('Decrypted value:', value);
```

### useFHEContract()

Hook for interacting with FHE-enabled smart contracts.

**Parameters:**

- `contractAddress: string` - Contract address
- `abi: any[]` - Contract ABI

**Returns:**

```typescript
{
  contract: Contract | null;
  isLoading: boolean;
  error: string | null;
}
```

**Example:**

```tsx
const { contract, isLoading } = useFHEContract(
  '0x291B77969Bb18710609C35d263adCb0848a3f82F',
  contractABI
);

if (contract) {
  await contract.submitWeatherData(encryptedTemp, encryptedHumidity);
}
```

## TypeScript Support

The SDK is written in TypeScript and provides comprehensive type definitions.

### Available Encrypted Types

```typescript
type EncryptedType =
  | 'ebool'     // Encrypted boolean
  | 'euint4'    // Encrypted 4-bit unsigned integer
  | 'euint8'    // Encrypted 8-bit unsigned integer
  | 'euint16'   // Encrypted 16-bit unsigned integer
  | 'euint32'   // Encrypted 32-bit unsigned integer
  | 'euint64'   // Encrypted 64-bit unsigned integer
  | 'euint128'  // Encrypted 128-bit unsigned integer
  | 'euint256'  // Encrypted 256-bit unsigned integer
  | 'eaddress'; // Encrypted address
```

### Type Definitions

```typescript
interface EncryptedData {
  data: Uint8Array;
  type: EncryptedType;
  signature?: string;
}

interface FHEVMConfig {
  provider: Provider;
  chainId?: number;
  gatewayAddress?: string;
  aclAddress?: string;
  kmsVerifierAddress?: string;
}

interface IFHEVMClient {
  init(): Promise<void>;
  isReady(): boolean;
  encrypt(value: number | boolean, type: EncryptedType): Promise<EncryptedData>;
  createInputProof(
    encrypted: EncryptedData,
    contractAddress: string,
    userAddress: string
  ): Promise<{ data: Uint8Array; signature: string }>;
  getPublicKey(): Uint8Array | null;
}
```

## Architecture

The SDK follows a modular architecture:

```
@fhevm/sdk
├── core/              # Framework-agnostic FHE client
│   └── FHEVMClient.ts
├── react/             # React-specific hooks and providers
│   ├── FHEVMProvider.tsx
│   └── hooks.ts
└── types/             # TypeScript type definitions
    └── index.ts
```

### Core Module

The core module provides framework-agnostic FHE functionality:

```typescript
import { FHEVMClient, encryptUint32 } from '@fhevm/sdk/core';
```

Use this if you're not using React or want more control.

### React Module

The React module provides hooks and context providers:

```typescript
import {
  FHEVMProvider,
  useFHEVM,
  useEncrypt,
  useDecrypt,
  useFHEContract
} from '@fhevm/sdk';
```

## Examples

### Example 1: Simple Encrypted Counter

```tsx
import { useEncrypt, useFHEVM } from '@fhevm/sdk';
import { ethers } from 'ethers';

function Counter() {
  const { isReady } = useFHEVM();
  const { encrypt, data } = useEncrypt();
  const [count, setCount] = useState(0);

  const increment = async () => {
    const newCount = count + 1;
    await encrypt(newCount, 'euint8');
    setCount(newCount);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment} disabled={!isReady}>
        Increment
      </button>
      {data && <p>Encrypted: {ethers.hexlify(data.data)}</p>}
    </div>
  );
}
```

### Example 2: Private Voting

```tsx
import { useEncrypt, useFHEContract } from '@fhevm/sdk';

function VotingApp() {
  const { encrypt, data } = useEncrypt();
  const { contract } = useFHEContract(contractAddress, votingABI);
  const [choice, setChoice] = useState<boolean>(false);

  const vote = async () => {
    // Encrypt vote (true/false)
    await encrypt(choice, 'ebool');

    if (contract && data) {
      // Submit encrypted vote
      await contract.castVote(data.data, data.signature);
    }
  };

  return (
    <div>
      <button onClick={() => setChoice(true)}>Vote Yes</button>
      <button onClick={() => setChoice(false)}>Vote No</button>
      <button onClick={vote}>Submit Encrypted Vote</button>
    </div>
  );
}
```

### Example 3: Confidential Auction

```tsx
import { useEncrypt, useFHEVM } from '@fhevm/sdk';

function AuctionBid() {
  const { encrypt, data, isLoading } = useEncrypt();
  const [bidAmount, setBidAmount] = useState(0);

  const submitBid = async () => {
    // Encrypt bid amount (in wei)
    await encrypt(bidAmount, 'euint64');

    if (data) {
      // Submit to auction contract
      console.log('Encrypted bid ready:', data);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(Number(e.target.value))}
        placeholder="Bid amount"
      />
      <button onClick={submitBid} disabled={isLoading}>
        {isLoading ? 'Encrypting...' : 'Submit Sealed Bid'}
      </button>
    </div>
  );
}
```

## Best Practices

### 1. Always Check Client Ready State

```tsx
const { client, isReady } = useFHEVM();

if (!isReady) {
  return <div>Loading FHE client...</div>;
}

// Safe to use client now
```

### 2. Handle Errors Gracefully

```tsx
const { encrypt, error } = useEncrypt();

useEffect(() => {
  if (error) {
    console.error('Encryption failed:', error);
    // Show user-friendly error message
  }
}, [error]);
```

### 3. Use Appropriate Encrypted Types

Choose the smallest type that fits your data:

```tsx
// For percentages (0-100)
await encrypt(65, 'euint8');

// For temperatures in hundredths (-100 to 100 = -10000 to 10000)
await encrypt(2250, 'euint16');

// For large numbers
await encrypt(1000000, 'euint32');
```

### 4. Reset State When Needed

```tsx
const { encrypt, reset } = useEncrypt();

// After successful submission
await submitToContract(data);
reset(); // Clear encrypted data
```

## Advanced Usage

### Custom Configuration

```tsx
<FHEVMProvider
  config={{
    provider: ethersProvider,
    chainId: 11155111, // Sepolia
    gatewayAddress: '0x33347831500F1E73F0CccBBe71C7E21Ca0100a42'
  }}
>
  <App />
</FHEVMProvider>
```

### Direct Client Access

```tsx
const { client } = useFHEVM();

if (client) {
  const publicKey = client.getPublicKey();
  console.log('FHE Public Key:', publicKey);
}
```

## Troubleshooting

### Issue: Client Not Ready

**Problem:** `isReady` stays `false`

**Solution:** Ensure Ethereum provider is properly connected:

```tsx
useEffect(() => {
  const checkProvider = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
  };
  checkProvider();
}, []);
```

### Issue: Encryption Fails

**Problem:** `encrypt()` returns an error

**Solution:** Verify value is within type bounds:

```tsx
// euint8: 0 to 255
// euint32: 0 to 4,294,967,295
// etc.
```

### Issue: TypeScript Errors

**Problem:** Type definitions not found

**Solution:** Ensure TypeScript version >= 5.0:

```bash
npm install typescript@^5.0.0 --save-dev
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md).

## License

MIT License - see [LICENSE](../../LICENSE) for details.

## Resources

- [Documentation](../../README.md)
- [Example Templates](../../examples/)
- [Zama fhEVM Docs](https://docs.zama.ai/fhevm)
- [GitHub Repository](https://github.com/MyaLind/FHEWeatherAggregator)

## Support

- GitHub Issues: [Report a bug](https://github.com/MyaLind/FHEWeatherAggregator/issues)
- Example App: [Live Demo](https://myalind.github.io/FHEWeatherAggregator/)
