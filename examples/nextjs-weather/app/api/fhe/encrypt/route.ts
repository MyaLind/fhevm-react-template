import { NextRequest, NextResponse } from 'next/server';

/**
 * Encryption API Route
 * Provides server-side encryption capabilities for FHE operations
 * Note: Client-side encryption is preferred for better security
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, type } = body;

    // Validate input
    if (value === undefined || value === null) {
      return NextResponse.json(
        { error: 'Value is required' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Encryption type is required (e.g., euint32)' },
        { status: 400 }
      );
    }

    // Validate encryption type
    const validTypes = ['euint8', 'euint16', 'euint32', 'euint64', 'ebool'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Note: Actual encryption should be done client-side using the SDK
    // This is a placeholder for server-side validation/logging
    return NextResponse.json({
      success: true,
      message: 'Encryption should be performed client-side using @fhevm/sdk',
      data: {
        value,
        type,
        recommendation: 'Use useEncrypt() hook from @fhevm/sdk for client-side encryption'
      }
    });

  } catch (error) {
    console.error('Encryption API error:', error);
    return NextResponse.json(
      { error: 'Encryption failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Encryption endpoint',
    method: 'POST',
    usage: 'Send { value, type } to encrypt data',
    note: 'Client-side encryption is recommended using @fhevm/sdk'
  });
}
