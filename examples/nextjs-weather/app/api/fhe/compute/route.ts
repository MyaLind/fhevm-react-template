import { NextRequest, NextResponse } from 'next/server';

/**
 * Homomorphic Computation API Route
 * Demonstrates FHE computation capabilities
 * Note: Actual computations happen on-chain in smart contracts
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, operands, contractAddress } = body;

    // Validate input
    if (!operation) {
      return NextResponse.json(
        { error: 'Operation type is required' },
        { status: 400 }
      );
    }

    if (!operands || !Array.isArray(operands)) {
      return NextResponse.json(
        { error: 'Operands array is required' },
        { status: 400 }
      );
    }

    const validOperations = ['add', 'sub', 'mul', 'div', 'min', 'max', 'eq', 'ne', 'lt', 'lte', 'gt', 'gte'];
    if (!validOperations.includes(operation)) {
      return NextResponse.json(
        { error: `Invalid operation. Must be one of: ${validOperations.join(', ')}` },
        { status: 400 }
      );
    }

    // FHE computations are performed on-chain
    return NextResponse.json({
      success: true,
      message: 'FHE computations are performed on-chain',
      info: {
        operation,
        operandCount: operands.length,
        contractAddress: contractAddress || 'Not specified',
        note: 'Smart contracts can perform homomorphic operations on encrypted data without decryption'
      },
      supportedOperations: {
        arithmetic: ['add', 'sub', 'mul', 'div'],
        comparison: ['eq', 'ne', 'lt', 'lte', 'gt', 'gte'],
        other: ['min', 'max']
      },
      example: {
        solidity: 'euint32 result = TFHE.add(encryptedA, encryptedB);',
        description: 'Adds two encrypted numbers without decrypting them'
      }
    });

  } catch (error) {
    console.error('Computation API error:', error);
    return NextResponse.json(
      { error: 'Computation request failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Homomorphic Computation endpoint',
    method: 'POST',
    usage: 'Send { operation, operands, contractAddress } to learn about FHE computations',
    note: 'Actual computations happen on-chain in smart contracts using TFHE library',
    supportedOperations: ['add', 'sub', 'mul', 'div', 'min', 'max', 'eq', 'ne', 'lt', 'lte', 'gt', 'gte']
  });
}
