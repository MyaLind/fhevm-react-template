import { NextRequest, NextResponse } from 'next/server';

/**
 * FHE Operations Route
 * Handles general FHE operations and status checks
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'operational',
      message: 'FHE operations API is running',
      endpoints: {
        encrypt: '/api/fhe/encrypt',
        decrypt: '/api/fhe/decrypt',
        compute: '/api/fhe/compute'
      }
    });
  } catch (error) {
    console.error('FHE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, data } = body;

    // Route to specific FHE operations
    switch (operation) {
      case 'status':
        return NextResponse.json({
          status: 'ready',
          timestamp: new Date().toISOString()
        });
      default:
        return NextResponse.json(
          { error: 'Unknown operation' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('FHE POST error:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
