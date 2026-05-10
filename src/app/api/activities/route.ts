import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''

    const activities = await prisma.activityTemplate.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
            ],
          } : {},
          type ? { type: { contains: type } } : {},
        ],
      },
      take: 20,
    })

    return NextResponse.json({ activities })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
