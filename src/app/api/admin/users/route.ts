import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET!) as { userId: string; role: string }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true,
        city: true, country: true, createdAt: true,
        _count: { select: { trips: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ users })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
