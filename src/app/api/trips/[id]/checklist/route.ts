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

    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: payload.userId } })
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 })

    const items = await prisma.checklistItem.findMany({ where: { tripId } })
    return NextResponse.json({ items })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getTokenPayload(request)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id: tripId } = await params

    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: payload.userId } })
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 })

    const { label, category } = await request.json()
    if (!label || !category) return NextResponse.json({ error: 'label and category are required' }, { status: 400 })

    const item = await prisma.checklistItem.create({ data: { tripId, label, category } })
    return NextResponse.json({ item }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
