'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import StandardHeader from '@/components/layout/StandardHeader'
import type { CommunityPost } from '@/types'

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/community').then(r => setPosts(r.data.posts)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const toneColors = ['linear-gradient(135deg,#F4D9A4,#E0AC58)', 'linear-gradient(135deg,#BFD0DD,#8AA8BD)', 'linear-gradient(135deg,#C7DCC8,#8FB69A)', 'linear-gradient(135deg,#E8E2D5,#D6CBB6)']

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <StandardHeader />
      <div style={{ padding: '8px 48px 56px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>Community tab</span>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 600, marginTop: 4, margin: '4px 0 0' }}>Stories from the road</h1>
            <p style={{ color: '#6B7280', fontSize: 13.5, marginTop: 6, maxWidth: 560 }}>
              Itineraries shared by other travelers. Save them, fork them, follow the planners whose taste you trust.
            </p>
          </div>
          <button style={{ background: '#F5A623', color: '#1E1E1E', border: 0, borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            ↗ Share a trip
          </button>
        </div>

        {loading && <p style={{ color: '#6B7280', fontSize: 14 }}>Loading posts...</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {posts.map((post, i) => {
            const tags = post.tags ? post.tags.split(',').map(t => t.trim()) : []
            const initials = post.user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
            return (
              <div key={post.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'grid', gridTemplateColumns: '320px 1fr auto', gap: 24, padding: 20 }}>
                <div style={{ height: 200, borderRadius: 8, background: toneColors[i % toneColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.45)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.04em' }}>
                  {post.title.split(' ')[0].toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F4D9A4,#E0AC58)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{initials}</span>
                    <span style={{ fontWeight: 500, fontSize: 13.5 }}>{post.user?.name || 'Traveler'}</span>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>· {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 600, lineHeight: 1.2, margin: 0 }}>{post.title}</h3>
                  <p style={{ color: '#6B7280', fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>{post.description}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                    {tags.map(t => (
                      <span key={t} style={{ background: 'rgba(30,30,30,0.08)', color: '#1E1E1E', padding: '4px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 14, fontSize: 12.5, color: '#6B7280' }}>
                    <span>♡ 0</span><span>↳ 0</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button style={{ background: '#F5A623', color: '#1E1E1E', border: 0, borderRadius: 8, height: 34, padding: '0 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Fork trip</button>
                    <button style={{ background: 'transparent', color: '#1E1E1E', border: '1.5px solid #1E1E1E', borderRadius: 8, height: 34, padding: '0 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
                  </div>
                </div>
              </div>
            )
          })}
          {!loading && posts.length === 0 && <p style={{ color: '#6B7280', fontSize: 14 }}>No community posts yet.</p>}
        </div>
      </div>
    </div>
  )
}
