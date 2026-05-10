import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

function getTokenPayload(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  try {
    return jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET!) as { userId: string; role: string }
  } catch { return null }
}

export async function GET(request: NextRequest) {
  try {
    const payload = getTokenPayload(request)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const where: Record<string, unknown> = { userId: payload.userId }
    if (status) where.status = status

    const trips = await prisma.trip.findMany({
      where,
      include: {
        stops: { include: { activities: true }, orderBy: { order: 'asc' } },
        user: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ trips })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getTokenPayload(request)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { name, description, startDate, endDate, isPublic, status } = body

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: 'Name, startDate, and endDate are required' }, { status: 400 })
    }

    const trip = await prisma.trip.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isPublic: isPublic ?? false,
        status: status ?? 'upcoming',
        userId: payload.userId,
      },
      include: {
        stops: { include: { activities: true } },
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    })

    return NextResponse.json({ trip }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
