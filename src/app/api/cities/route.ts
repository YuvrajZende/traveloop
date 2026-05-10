import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const region = searchParams.get('region') || ''
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20

    const cities = await prisma.city.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { name: { contains: search } },
              { country: { contains: search } },
            ],
          } : {},
          region ? { region: { contains: region } } : {},
        ],
      },
      take: limit,
      orderBy: { popularity: 'desc' },
    })

    return NextResponse.json({ cities })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
