import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

function getTokenPayload(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  try {
    return jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET!) as { userId: string }
  } catch { return null }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getTokenPayload(request)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id: tripId } = await params

    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: payload.userId } })
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 })

    const body = await request.json()
    const { city, country, startDate, endDate, budget, order, description } = body

    if (!city || !startDate || !endDate) {
      return NextResponse.json({ error: 'city, startDate, endDate are required' }, { status: 400 })
    }

    const stop = await prisma.stop.create({
      data: {
        tripId,
        city,
        country,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget: budget ? parseFloat(budget) : undefined,
        order: order ?? 0,
        description,
      },
      include: { activities: true },
    })

    return NextResponse.json({ stop }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
