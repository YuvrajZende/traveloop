import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    // Enrich with user info
    const enriched = await Promise.all(
      posts.map(async (post) => {
        const user = await prisma.user.findUnique({
          where: { id: post.userId },
          select: { id: true, name: true, email: true },
        })
        return { ...post, user }
      })
    )

    return NextResponse.json({ posts: enriched })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
