'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import InvoiceTable from '@/components/invoice/InvoiceTable'
import type { Trip, Invoice, ChecklistItem } from '@/types'

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [budget, setBudget] = useState<{ totalBudget: number; totalSpent: number; remaining: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get(`/trips/${id}`),
      api.get(`/trips/${id}/checklist`),
      api.get(`/trips/${id}/budget`),
    ]).then(([tripRes, checkRes, budgetRes]) => {
      const t = tripRes.data.trip
      setTrip(t)
      setChecklist(checkRes.data.items)
      setBudget(budgetRes.data)
      if (t.invoices?.length > 0) {
        setInvoice(t.invoices[0])
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ padding: 48, fontFamily: 'DM Sans, sans-serif', color: '#6B7280' }}>Loading...</div>

  const packedCount = checklist.filter(i => i.packed).length
  const checklistProgress = checklist.length ? Math.round((packedCount / checklist.length) * 100) : 0
  const categories = [...new Set(checklist.map(i => i.category))]
  const isOverBudget = budget && budget.remaining < 0

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ padding: '18px 48px 0' }}>
        <Link href="/trips" style={{ textDecoration: 'none' }}>
          <button style={{ background: 'transparent', color: '#6B7280', border: 0, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            ← back to My Trips
          </button>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, padding: '18px 48px 48px', flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Trip info */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 22 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>Trip</span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 600, marginTop: 4, margin: '4px 0 0' }}>{trip?.name}</h2>
            <p style={{ color: '#6B7280', fontSize: 12.5, marginTop: 6 }}>
              {trip && `${new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
              {trip?.stops?.length ? ` · ${trip.stops.length} cities` : ''}
              {trip?.user?.name ? ` · created by ${trip.user.name.split(' ')[0]}` : ''}
            </p>
            <div style={{ background: '#F3F4F6', borderRadius: 8, height: 42, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', marginTop: 16, color: '#6B7280', fontSize: 14 }}>
              🔍 <input placeholder="Search invoices......" style={{ border: 0, background: 'transparent', outline: 'none', flex: 1, fontFamily: 'inherit', fontSize: 14 }} />
            </div>
          </div>

          {/* Mini checklist */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 0 }}>
            <div style={{ padding: '18px 22px 12px', borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 600, margin: 0 }}>Packing checklist</h3>
                <span style={{ background: 'rgba(45,106,79,0.12)', color: '#2D6A4F', padding: '4px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>{packedCount}/{checklist.length}</span>
              </div>
              <div style={{ background: '#E5E7EB', borderRadius: 999, height: 7, overflow: 'hidden', marginTop: 10 }}>
                <div style={{ background: '#1E1E1E', height: '100%', borderRadius: 999, width: `${checklistProgress}%` }} />
              </div>
            </div>
            <div style={{ padding: '12px 22px 18px' }}>
              {categories.map((cat, i) => {
                const catItems = checklist.filter(item => item.category === cat)
                const catPacked = catItems.filter(item => item.packed).length
                return (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: i ? '1px dashed #E5E7EB' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 5, background: '#1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span style={{ fontSize: 13 }}>{cat}</span>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#6B7280' }}>{catPacked}/{catItems.length}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <Link href={`/trips/${id}/view`} style={{ textDecoration: 'none' }}>
            <button style={{ background: 'transparent', color: '#1E1E1E', border: '1.5px solid #1E1E1E', borderRadius: 8, height: 44, width: '100%', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>View Full Budget</button>
          </Link>

          {/* Budget insights */}
          <div style={{ background: '#1E1E1E', borderRadius: 12, padding: 22, color: '#fff' }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Budget insights</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
              {[
                ['Total Budget', budget?.totalBudget || 0, false],
                ['Total Spent', budget?.totalSpent || 0, false],
                ['Remaining', budget?.remaining || 0, isOverBudget],
              ].map(([k, v, danger]) => (
                <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{k as string}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: danger ? '#FCA5A5' : '#fff', fontSize: 15 }}>
                    {(v as number) < 0 ? '−' : ''}${Math.abs(v as number).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ borderRadius: 999, height: 8, overflow: 'hidden', marginTop: 18, background: 'rgba(255,255,255,0.15)' } as React.CSSProperties}>
              <div style={{ background: isOverBudget ? '#EF4444' : '#F5A623', height: '100%', borderRadius: 999, width: '100%' }} />
            </div>
            {isOverBudget && <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', marginTop: 10 }}>Over budget · review line items</p>}
          </div>
        </aside>

        {/* Main */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {invoice ? (
            <>
              <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>Invoice</span>
                    <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 24, fontWeight: 600, marginTop: 4, margin: '4px 0 0', color: '#1E1E1E' }}>
                      INV-{invoice.id.slice(0, 8).toUpperCase()}
                    </h1>
                    <p style={{ color: '#6B7280', fontSize: 13, marginTop: 6 }}>
                      Generated {new Date(invoice.generatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · Currency USD
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <span style={{ background: invoice.status === 'paid' ? 'rgba(45,106,79,0.12)' : 'rgba(245,166,35,0.15)', color: invoice.status === 'paid' ? '#2D6A4F' : '#8C5A00', padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                      ● {invoice.status}
                    </span>
                    <button style={{ background: '#F5A623', color: '#1E1E1E', border: 0, borderRadius: 8, height: 34, padding: '0 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Mark as paid</button>
                  </div>
                </div>
                <div style={{ height: 1, background: '#E5E7EB', margin: '22px 0 18px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>Travelers</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                      {invoice.travelers.split(',').slice(0, 4).map((name, i) => (
                        <span key={i} style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#F4D9A4,#E0AC58)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, marginLeft: i ? -8 : 0, border: '2px solid #fff', flexShrink: 0 }}>
                          {name.trim()[0]}
                        </span>
                      ))}
                      <span style={{ marginLeft: 10, fontSize: 13 }}>{invoice.travelers}</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280' }}>Issued to</div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginTop: 6 }}>{trip?.user?.name} · {trip?.user?.email}</div>
                  </div>
                </div>
              </div>

              <InvoiceTable items={invoice.items} />

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button style={{ background: 'transparent', color: '#1E1E1E', border: '1.5px solid #1E1E1E', borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Download PDF</button>
                <button style={{ background: 'transparent', color: '#1E1E1E', border: '1.5px solid #1E1E1E', borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Email invoice</button>
                <button style={{ background: '#F5A623', color: '#1E1E1E', border: 0, borderRadius: 8, height: 44, padding: '0 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Settle balance</button>
              </div>
            </>
          ) : (
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 48, textAlign: 'center', color: '#6B7280' }}>
              No invoice generated for this trip yet.
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
