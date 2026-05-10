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

    const notes = await prisma.note.findMany({
      where: { tripId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ notes })
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

    const { title, content, stopRef, dayRef } = await request.json()
    if (!title || !content) return NextResponse.json({ error: 'title and content are required' }, { status: 400 })

    const note = await prisma.note.create({
      data: { tripId, userId: payload.userId, title, content, stopRef, dayRef },
      include: { user: { select: { id: true, name: true } } },
    })

    return NextResponse.json({ note }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
