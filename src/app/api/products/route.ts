import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/products'

export const dynamic = 'force-dynamic'

// GET /api/products — public endpoint returning all live products
export async function GET() {
  const products = await getProducts()
  return NextResponse.json(products, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
