'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import StandardHeader from '@/components/layout/StandardHeader'
import ResultCard from '@/components/search/ResultCard'
import type { ActivityTemplate } from '@/types'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ActivityTemplate[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const doSearch = async (q: string) => {
    setLoading(true)
    try {
      const res = await api.get(`/activities?search=${encodeURIComponent(q)}`)
      setResults(res.data.activities)
      setCount(res.data.activities.length)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    doSearch('')
  }, [])

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <StandardHeader placeholder="Search cities or activities..." onSearch={(q) => { setQuery(q); doSearch(q) }} />
      <div style={{ padding: '12px 48px 56px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, fontWeight: 600, margin: 0 }}>Results</h2>
            <p style={{ color: '#6B7280', fontSize: 13.5, marginTop: 4 }}>
              <strong style={{ color: '#1E1E1E' }}>{count}</strong> activities{query && <> matching <em>&ldquo;{query}&rdquo;</em></>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 999, height: 36, padding: '0 16px', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>🗺 Map view</button>
            <button style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 999, height: 36, padding: '0 16px', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>+ Save search</button>
          </div>
        </div>

        {loading && <p style={{ color: '#6B7280', fontSize: 14 }}>Searching...</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {results.map(r => <ResultCard key={r.id} item={r} />)}
          {!loading && results.length === 0 && <p style={{ color: '#6B7280', fontSize: 14 }}>No results found.</p>}
        </div>
      </div>
    </div>
  )
}
