import { NextRequest, NextResponse } from 'next/server';

/**
 * Decryption API Route
 * Handles decryption requests for FHE encrypted data
 * Note: Actual decryption happens via Zama Gateway
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { encryptedData, contractAddress, account } = body;

    // Validate input
    if (!encryptedData) {
      return NextResponse.json(
        { error: 'Encrypted data is required' },
        { status: 400 }
      );
    }

    if (!contractAddress) {
      return NextResponse.json(
        { error: 'Contract address is required' },
        { status: 400 }
      );
    }

    if (!account) {
      return NextResponse.json(
        { error: 'Account address is required' },
        { status: 400 }
      );
    }

    // Note: Actual decryption is handled by Zama Gateway with EIP-712 signatures
    // This endpoint provides information about the decryption process
    return NextResponse.json({
      success: true,
      message: 'Decryption requests are processed via Zama Gateway',
      process: {
        step1: 'Request decryption permission from contract',
        step2: 'Sign EIP-712 message with your wallet',
        step3: 'Gateway processes and returns decrypted value',
        step4: 'Use useDecrypt() hook from @fhevm/sdk'
      },
      data: {
        encryptedData,
        contractAddress,
        account
      }
    });

  } catch (error) {
    console.error('Decryption API error:', error);
    return NextResponse.json(
      { error: 'Decryption request failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Decryption endpoint',
    method: 'POST',
    usage: 'Send { encryptedData, contractAddress, account } to request decryption',
    note: 'Decryption is handled by Zama Gateway via useDecrypt() hook'
  });
}
