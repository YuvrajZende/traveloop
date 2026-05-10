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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  try {
    const payload = getTokenPayload(request)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id: tripId, itemId } = await params

    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: payload.userId } })
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 })

    const { packed } = await request.json()

    const item = await prisma.checklistItem.update({
      where: { id: itemId },
      data: { packed },
    })

    return NextResponse.json({ item })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
