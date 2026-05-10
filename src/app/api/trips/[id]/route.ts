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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getTokenPayload(request)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const trip = await prisma.trip.findFirst({
      where: { id, userId: payload.userId },
      include: {
        stops: { include: { activities: true }, orderBy: { order: 'asc' } },
        user: { select: { id: true, name: true, email: true, role: true } },
        checklist: true,
        notes: { include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
        invoices: { include: { items: true } },
      },
    })

    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 })

    return NextResponse.json({ trip })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getTokenPayload(request)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const existing = await prisma.trip.findFirst({ where: { id, userId: payload.userId } })
    if (!existing) return NextResponse.json({ error: 'Trip not found' }, { status: 404 })

    const body = await request.json()
    const { name, description, startDate, endDate, isPublic, status } = body

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(isPublic !== undefined && { isPublic }),
        ...(status && { status }),
      },
      include: {
        stops: { include: { activities: true }, orderBy: { order: 'asc' } },
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    })

    return NextResponse.json({ trip })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getTokenPayload(request)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const existing = await prisma.trip.findFirst({ where: { id, userId: payload.userId } })
    if (!existing) return NextResponse.json({ error: 'Trip not found' }, { status: 404 })

    await prisma.trip.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
