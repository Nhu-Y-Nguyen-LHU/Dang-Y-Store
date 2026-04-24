import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/products';

export async function GET() {
  const products = getAllProducts();
  return NextResponse.json({ data: products });
}
