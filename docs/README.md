# FHEVM SDK Documentation

Complete documentation for the FHEVM SDK - a universal toolkit for building privacy-preserving decentralized applications.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Installation](#installation)
3. [Core Concepts](#core-concepts)
4. [API Reference](#api-reference)
5. [Examples](#examples)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Getting Started

The FHEVM SDK provides a wagmi-like developer experience for building applications with Fully Homomorphic Encryption (FHE) on Ethereum.

### What is FHE?

Fully Homomorphic Encryption allows computations to be performed on encrypted data without ever decrypting it. This enables:

- **Private Smart Contracts**: Compute on sensitive data while keeping it encrypted
- **Confidential Transactions**: Hide transaction amounts and details
- **Privacy-Preserving dApps**: Build applications where user data stays private
- **Secure Data Aggregation**: Combine data from multiple sources without exposing individual values

### Key Features

- 🔐 **Client-side Encryption**: Encrypt data in the browser before blockchain submission
- ⚛️ **React Hooks**: Familiar wagmi-style API with hooks like `useFHEVM()`, `useEncrypt()`
- 🎯 **Framework Agnostic**: Core library works with React, Vue, or vanilla JavaScript
- 📘 **TypeScript First**: Complete type safety with comprehensive definitions
- 🛠️ **Rich Utilities**: Encryption, security, and validation helpers included
- 🧩 **Modular**: Use only what you need

## Installation

### For React Applications

```bash
npm install @fhevm/sdk ethers
```

### For Vue Applications

```bash
npm install @fhevm/sdk ethers
```

### For Vanilla JavaScript

```bash
npm install @fhevm/sdk ethers
```

## Core Concepts

### 1. FHE Client Initialization

The FHE client manages encryption keys and provides methods for encrypting/decrypting data.

```typescript
import { FHEVMClient } from '@fhevm/sdk/core';
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const client = new FHEVMClient({ provider });
await client.init();
```

### 2. Encryption Types

The SDK supports multiple encrypted data types:

- `euint8`: 0-255
- `euint16`: 0-65,535
- `euint32`: 0-4,294,967,295
- `euint64`: Large numbers up to 2^64-1
- `ebool`: Boolean values

### 3. Encryption Workflow

1. **Client-side Encryption**: Data encrypted in browser using public key
2. **Submit to Blockchain**: Encrypted data sent to smart contract
3. **On-chain Computation**: Contract performs operations on encrypted data
4. **Selective Decryption**: Only authorized parties can decrypt results

### 4. Decryption Workflow

1. **Request Permission**: Ask contract for decryption permission
2. **Sign EIP-712**: User signs message to authorize decryption
3. **Gateway Decrypts**: Zama Gateway validates and decrypts
4. **Return Value**: Decrypted value returned to authorized address

## API Reference

### React Hooks

#### `useFHEVM()`

Access the FHE client and its status.

```typescript
const { client, isReady, error } = useFHEVM();
```

**Returns:**
- `client`: FHEVMClient instance
- `isReady`: Boolean indicating if client is initialized
- `error`: Error object if initialization failed

#### `useEncrypt()`

Encrypt values with loading states.

```typescript
const { encrypt, data, isLoading, error } = useEncrypt();

// Usage
await encrypt(42, 'euint32');
```

**Returns:**
- `encrypt(value, type)`: Function to encrypt a value
- `data`: Encrypted data result
- `isLoading`: Boolean indicating encryption in progress
- `error`: Error object if encryption failed

#### `useDecrypt()`

Decrypt values through the Gateway.

```typescript
const { decrypt, data, isLoading, error } = useDecrypt();

// Usage
await decrypt(encryptedData, contractAddress);
```

#### `useFHEContract(config)`

Interact with FHE-enabled smart contracts.

```typescript
const contract = useFHEContract({
  address: '0x...',
  abi: CONTRACT_ABI,
  signer
});

// Call contract methods
await contract.submitEncryptedValue(encryptedData);
```

### Vue Composables

#### `useFhevmClient(config)`

Initialize FHEVM client for Vue applications.

```typescript
const { client, isReady, error } = useFhevmClient({ provider });
```

#### `useFhevmEncrypt()`

Encrypt values with reactive state.

```typescript
const { encrypt, data, isLoading, error } = useFhevmEncrypt();
```

### Core Client

#### `FHEVMClient`

Framework-agnostic FHE client.

```typescript
import { FHEVMClient } from '@fhevm/sdk/core';

const client = new FHEVMClient({ provider });
await client.init();

// Encrypt
const encrypted = await client.encrypt(42, 'euint32');

// Decrypt (with permission)
const decrypted = await client.decrypt(encrypted, contractAddress);
```

### Utility Functions

#### Encryption Utilities

```typescript
import { encrypt, encryptBatch, validateEncryptedData } from '@fhevm/sdk';

// Encrypt single value
const encrypted = await encrypt(client, 42, 'euint32');

// Encrypt multiple values
const encryptedArray = await encryptBatch(client, [1, 2, 3], 'euint32');

// Validate encrypted data
if (validateEncryptedData(encrypted)) {
  // Safe to use
}
```

#### Security Utilities

```typescript
import {
  sanitizeInput,
  isValidAddress,
  validateContractAddress,
  generateNonce,
  isSecureContext
} from '@fhevm/sdk';

// Sanitize user input
const clean = sanitizeInput(userInput);

// Validate Ethereum address
if (isValidAddress('0x...')) {
  // Valid address
}

// Check secure context (HTTPS)
if (isSecureContext()) {
  // Safe to proceed
}
```

#### Validation Utilities

```typescript
import {
  isValidEncryptedType,
  isValidValueForType,
  isValidConfig,
  isSupportedNetwork
} from '@fhevm/sdk';

// Validate encrypted type
if (isValidEncryptedType('euint32')) {
  // Valid type
}

// Validate value for type
if (isValidValueForType(255, 'euint8')) {
  // Value fits in type
}

// Check supported network
if (isSupportedNetwork(chainId)) {
  // Network supported
}
```

## Examples

### Basic React Application

```tsx
import { FHEVMProvider, useFHEVM, useEncrypt } from '@fhevm/sdk';
import { ethers } from 'ethers';

// Wrap app with provider
function App() {
  const provider = new ethers.BrowserProvider(window.ethereum);

  return (
    <FHEVMProvider config={{ provider }}>
      <EncryptionDemo />
    </FHEVMProvider>
  );
}

// Use hooks in components
function EncryptionDemo() {
  const { isReady } = useFHEVM();
  const { encrypt, data, isLoading } = useEncrypt();

  const handleEncrypt = async () => {
    await encrypt(42, 'euint32');
  };

  return (
    <button onClick={handleEncrypt} disabled={!isReady || isLoading}>
      {isLoading ? 'Encrypting...' : 'Encrypt Value'}
    </button>
  );
}
```

### Contract Integration

```tsx
import { useFHEContract, useEncrypt } from '@fhevm/sdk';

function WeatherStation() {
  const { encrypt } = useEncrypt();
  const contract = useFHEContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI
  });

  const submitData = async (temperature: number) => {
    const encrypted = await encrypt(temperature, 'euint32');
    const tx = await contract.submitTemperature(encrypted);
    await tx.wait();
  };

  return <div>Weather Station</div>;
}
```

### Vue Application

```vue
<script setup>
import { useFhevmClient, useFhevmEncrypt } from '@fhevm/sdk';
import { ref } from 'vue';

const provider = ref(null);
const { client, isReady } = useFhevmClient({ provider });
const { encrypt, data, isLoading } = useFhevmEncrypt();

const handleEncrypt = async (value) => {
  await encrypt(value, 'euint32');
};
</script>

<template>
  <button @click="handleEncrypt(42)" :disabled="!isReady || isLoading">
    Encrypt
  </button>
</template>
```

## Best Practices

### 1. Always Encrypt Client-Side

```typescript
// ✅ Good: Encrypt in browser
const encrypted = await client.encrypt(sensitiveValue, 'euint32');
await contract.submitValue(encrypted);

// ❌ Bad: Never send plaintext to contract
await contract.submitValue(sensitiveValue);
```

### 2. Validate Input Before Encryption

```typescript
import { isValidValueForType } from '@fhevm/sdk';

// ✅ Good: Validate before encrypting
if (isValidValueForType(value, 'euint8')) {
  await encrypt(value, 'euint8');
} else {
  throw new Error('Value out of range for euint8');
}
```

### 3. Handle Errors Gracefully

```typescript
const { encrypt, error } = useEncrypt();

try {
  await encrypt(value, 'euint32');
} catch (err) {
  console.error('Encryption failed:', err);
  // Show user-friendly error message
}
```

### 4. Use Type Safety

```typescript
import type { EncryptedType, EncryptedData } from '@fhevm/sdk';

const encryptValue = async (
  value: number,
  type: EncryptedType
): Promise<EncryptedData> => {
  return await encrypt(value, type);
};
```

### 5. Optimize Performance

```typescript
// ✅ Good: Batch encrypt multiple values
const encrypted = await encryptBatch(client, [1, 2, 3], 'euint32');

// ❌ Avoid: Multiple individual encryptions
const e1 = await encrypt(1, 'euint32');
const e2 = await encrypt(2, 'euint32');
const e3 = await encrypt(3, 'euint32');
```

## Troubleshooting

### Client Not Initializing

**Problem**: `isReady` stays `false`

**Solutions**:
- Check provider is connected to correct network
- Ensure wallet is connected
- Verify network is supported
- Check browser console for errors

### Encryption Fails

**Problem**: `encrypt()` throws error

**Solutions**:
- Verify value is within range for type
- Check client is initialized (`isReady === true`)
- Ensure secure context (HTTPS or localhost)
- Validate input before encryption

### Decryption Permission Denied

**Problem**: Cannot decrypt values

**Solutions**:
- Verify contract grants decryption permission
- Check user has authority to decrypt
- Ensure EIP-712 signature is valid
- Confirm Gateway is accessible

### Contract Interaction Fails

**Problem**: Transaction reverts

**Solutions**:
- Verify encrypted data format is correct
- Check contract expects correct type (euint32, etc.)
- Ensure sufficient gas limit
- Validate contract ABI matches deployment

## Additional Resources

- [API Reference](./api-reference.md)
- [Examples](../examples/)
- [Smart Contract Guide](./smart-contracts.md)
- [Zama Documentation](https://docs.zama.ai/fhevm)

## Support

For questions and issues:
- GitHub Issues: [Report bugs](https://github.com/your-repo/issues)
- Examples: Check [examples/](../examples/) directory
- Community: Join the discussion

---

**Built with ❤️ for privacy-first web3 development**
