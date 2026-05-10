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

    const [totalUsers, totalTrips, ongoingTrips, upcomingTrips, completedTrips] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.trip.count({ where: { status: 'ongoing' } }),
      prisma.trip.count({ where: { status: 'upcoming' } }),
      prisma.trip.count({ where: { status: 'completed' } }),
    ])

    // Top cities from stops
    const stops = await prisma.stop.findMany({ select: { city: true } })
    const cityCounts: Record<string, number> = {}
    stops.forEach(s => { cityCounts[s.city] = (cityCounts[s.city] || 0) + 1 })
    const topCities = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    // Top activities
    const activities = await prisma.activity.findMany({ select: { name: true, type: true } })
    const actCounts: Record<string, number> = {}
    activities.forEach(a => { actCounts[a.name] = (actCounts[a.name] || 0) + 1 })
    const topActivities = Object.entries(actCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    // Weekly trip creation (last 6 weeks)
    const sixWeeksAgo = new Date()
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42)
    const recentTrips = await prisma.trip.findMany({
      where: { createdAt: { gte: sixWeeksAgo } },
      select: { createdAt: true },
    })

    const weeklyData: Record<string, number> = {}
    recentTrips.forEach(t => {
      const week = `W${Math.ceil(new Date(t.createdAt).getDate() / 7)}`
      weeklyData[week] = (weeklyData[week] || 0) + 1
    })

    return NextResponse.json({
      totalUsers,
      totalTrips,
      ongoingTrips,
      upcomingTrips,
      completedTrips,
      topCities,
      topActivities,
      weeklyTrips: Object.entries(weeklyData).map(([week, count]) => ({ week, count })),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
