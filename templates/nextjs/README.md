# Next.js Template for FHEVM SDK

This template demonstrates how to integrate the FHEVM SDK into a Next.js application.

## Features

- **Next.js 14+** with App Router
- **FHEVM SDK Integration** for privacy-preserving operations
- **TypeScript** support
- **Ready-to-use Components** for FHE operations
- **Example Implementations** for common use cases

## Quick Start

### Installation

```bash
# Clone or copy this template
cp -r templates/nextjs my-fhe-app
cd my-fhe-app

# Install dependencies
npm install
```

### Configuration

1. Set up your environment variables:

```bash
# .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_GATEWAY_URL=https://gateway.zama.ai
```

2. Update your contract ABI in the appropriate location

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
templates/nextjs/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with FHEVMProvider
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── api/                # API routes
│       ├── fhe/            # FHE operation routes
│       └── keys/           # Key management routes
├── components/             # React components
│   ├── ui/                 # Base UI components
│   ├── fhe/                # FHE-specific components
│   └── examples/           # Example use cases
├── lib/                    # Utility libraries
│   ├── fhe/                # FHE helpers
│   └── utils/              # General utilities
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
└── styles/                 # Additional styles
```

## Usage Examples

### Basic Encryption

```tsx
import { useEncrypt, useFHEVM } from '@fhevm/sdk';

function MyComponent() {
  const { isReady } = useFHEVM();
  const { encrypt, data, isLoading } = useEncrypt();

  const handleEncrypt = async () => {
    await encrypt(42, 'euint32');
    // data now contains encrypted value
  };

  return (
    <button onClick={handleEncrypt} disabled={!isReady || isLoading}>
      Encrypt Value
    </button>
  );
}
```

### Contract Interaction

```tsx
import { useFHEContract } from '@fhevm/sdk';

function ContractExample() {
  const contract = useFHEContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI
  });

  const submitData = async (encryptedValue) => {
    const tx = await contract.submitValue(encryptedValue);
    await tx.wait();
  };

  return <div>Contract Integration</div>;
}
```

## Customization

### Adding Your Smart Contract

1. Place your contract ABI in `lib/contracts/`
2. Create a hook in `hooks/` for contract interactions
3. Use the hook in your components

### Styling

The template uses CSS modules and global styles. Customize in:
- `app/globals.css` - Global styles
- Component-specific CSS modules

### Adding Features

1. Create new components in `components/`
2. Add utility functions in `lib/utils/`
3. Define types in `types/`

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

The template works with any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama fhEVM](https://docs.zama.ai/fhevm)

## Support

For issues and questions:
- Check the [main README](../../README.md)
- Review [SDK documentation](../../packages/fhevm-sdk/README.md)
- See [examples](../../examples/)

## License

MIT
