import { NextRequest, NextResponse } from 'next/server';

/**
 * Key Management API Route
 * Provides information about FHE key management
 * Note: Actual key management is handled by fhevmjs and Zama Gateway
 */
export async function GET() {
  return NextResponse.json({
    message: 'FHE Key Management API',
    info: {
      publicKey: 'Generated and managed by fhevmjs',
      privateKey: 'Never leaves the Gateway - used only for authorized decryption',
      keyGeneration: 'Automatic during FHEVMClient initialization',
      usage: 'Keys are used for encrypting inputs and decrypting outputs'
    },
    workflow: {
      encryption: {
        step1: 'Client generates or fetches public key',
        step2: 'Data is encrypted using public key',
        step3: 'Encrypted data sent to smart contract'
      },
      decryption: {
        step1: 'Request decryption permission from contract',
        step2: 'Sign EIP-712 message to authorize',
        step3: 'Gateway uses private key to decrypt',
        step4: 'Decrypted value returned to authorized user'
      }
    },
    security: {
      note: 'FHE keys enable computation on encrypted data',
      guarantee: 'Data remains encrypted during computation',
      access: 'Only authorized parties can request decryption'
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'info':
        return NextResponse.json({
          publicKeyManagement: 'Handled by @fhevm/sdk',
          initialization: 'Use FHEVMProvider or FHEVMClient.init()',
          recommendation: 'Keys are automatically managed - no manual intervention needed'
        });

      case 'status':
        return NextResponse.json({
          status: 'ready',
          message: 'Key management is handled by the SDK',
          sdk: '@fhevm/sdk'
        });

      default:
        return NextResponse.json(
          { error: 'Unknown action. Use: info, status' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Key management API error:', error);
    return NextResponse.json(
      { error: 'Request failed' },
      { status: 500 }
    );
  }
}
