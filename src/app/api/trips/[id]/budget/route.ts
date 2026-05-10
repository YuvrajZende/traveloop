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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getTokenPayload(request)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id: tripId } = await params

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: payload.userId },
      include: { stops: { include: { activities: true } } },
    })

    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 })

    const byStop = trip.stops.map(stop => {
      const spent = stop.activities.reduce((sum, a) => sum + (a.cost ?? 0), 0)
      return {
        city: stop.city,
        budget: stop.budget ?? 0,
        spent,
      }
    })

    const totalBudget = byStop.reduce((sum, s) => sum + s.budget, 0)
    const totalSpent = byStop.reduce((sum, s) => sum + s.spent, 0)

    return NextResponse.json({
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      byStop,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
