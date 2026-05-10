'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockTrips } from '@/lib/mock-data'
import { Search, Heart, MessageCircle, Share2, Send, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api'

interface Reply { user: string; avatar: string; text: string; time: string }
interface Post {
  id: number
  user: string
  avatar: string
  content: string
  time: string
  likes: number
}

// Posts are now fetched from the API with a fallback to mock data
const MOCK_POSTS: Post[] = [
  { id: 101, user: 'Sarah Jenkins', avatar: 'S', content: 'Just returned from a 2-week trip to Japan! Highly recommend getting the JR Pass before you arrive, it saved us so much money on the Shinkansen.', time: '2 days ago', likes: 24 },
  { id: 102, user: 'David Chen', avatar: 'D', content: 'Does anyone have recommendations for good vegetarian restaurants in Rome? I’ll be there next month.', time: '5 hours ago', likes: 3 },
  { id: 103, user: 'Elena Rodriguez', avatar: 'E', content: 'Tip for packing light: roll your clothes instead of folding them. You can fit almost twice as much in your carry-on!', time: '1 week ago', likes: 112 },
  { id: 104, user: 'Marcus Thorne', avatar: 'M', content: 'Looking for a travel buddy for a hiking trip in Patagonia this December. Let me know if you are interested!', time: '1 day ago', likes: 8 }
]

type SortKey   = 'recent' | 'popular'
type FilterKey = 'all' | 'questions' | 'tips'

export default function CommunityPage() {
  const [search,     setSearch]     = useState('')
  const [sortBy,     setSortBy]     = useState<SortKey>('recent')
  const [filterBy,   setFilterBy]   = useState<FilterKey>('all')
  const [posts,      setPosts]      = useState<Post[]>([])
  const [liked,      setLiked]      = useState<Set<number>>(new Set())
  const [replies,    setReplies]    = useState<Record<number, Reply[]>>({})
  const [showReply,  setShowReply]  = useState<Set<number>>(new Set())
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({})
  const [sharedFor,  setSharedFor]  = useState<{ postId: number; tripId: string } | null>(null)
  const [isLoading,  setIsLoading]  = useState(true)
  const [user, setUser] = useState<{name: string, avatar: string} | null>(null)

  useEffect(() => {
    async function loadCommunity() {
      try {
        const [userData, data] = await Promise.all([
          apiClient('/users/me').catch(() => null),
          apiClient('/community').catch(() => [])
        ])

        if (userData) {
          const name = (userData.first_name || userData.username || 'User') + (userData.last_name ? ' ' + userData.last_name : '')
          const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
          setUser({ name: name.trim(), avatar: initials || 'U' })
        }

        if (data && data.length > 0) {
          setPosts(data.map((p: any) => ({
            id: p.id,
            user: p.author_name || 'Traveler',
            avatar: (p.author_name || 'T')[0].toUpperCase(),
            content: p.content,
            time: new Date(p.created_at).toLocaleDateString(),
            likes: parseInt(p.likes_count || '0', 10)
          })))
        } else {
          setPosts(MOCK_POSTS)
        }
      } catch (err) {
        console.error('Failed to load community posts:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadCommunity()
  }, [])

  async function toggleLike(id: number) {
    // Optimistic UI
    setLiked(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + (liked.has(id) ? -1 : 1) } : p))
    
    try {
      await apiClient(`/community/${id}/like`, { method: 'POST' })
    } catch (err) {
      console.error('Failed to toggle like:', err)
      // Revert if failed
      setLiked(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + (!liked.has(id) ? -1 : 1) } : p))
    }
  }

  function toggleReply(id: number) {
    setShowReply(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  function submitReply(postId: number) {
    const text = replyTexts[postId]?.trim()
    if (!text) return
    setReplies(prev => ({
      ...prev,
      [postId]: [...(prev[postId] ?? []), { user: user?.name || 'You', avatar: user?.avatar || 'U', text, time: 'Just now' }]
    }))
    setReplyTexts(prev => ({ ...prev, [postId]: '' }))
    setShowReply(prev => { const s = new Set(prev); s.delete(postId); return s })
  }

  function handleShareTrip(postId: number, tripId: string) {
    setSharedFor({ postId, tripId })
    setTimeout(() => setSharedFor(null), 2500)
  }

  let displayPosts = posts.filter(p =>
    !search ||
    p.content.toLowerCase().includes(search.toLowerCase()) ||
    p.user.toLowerCase().includes(search.toLowerCase())
  )
  if (sortBy === 'popular') displayPosts = [...displayPosts].sort((a, b) => b.likes - a.likes)

  function ControlBtn({ value, set, labels }: { value: string; set: (v: any) => void; labels: Record<string, string> }) {
    const entries = Object.entries(labels) as [string, string][]
    const isActive = value !== entries[0][0]
    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <button className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border text-xs shrink-0 h-10 gap-1', isActive && 'border-primary text-primary')}>
            {labels[value]}
            {isActive && <Check className="w-3 h-3" />}
          </button>
        } />
        <DropdownMenuContent align="end" className="w-40">
          {entries.map(([k, label]) => (
            <DropdownMenuItem key={k} onClick={() => set(k)}>
              <span className="flex-1">{label}</span>
              {value === k && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search community posts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background border-border h-10" />
        </div>
        <ControlBtn value="none" set={() => {}} labels={{ none: 'Group by' }} />
        <ControlBtn value={filterBy} set={setFilterBy} labels={{ all: 'Filter', questions: 'Questions', tips: 'Tips' }} />
        <ControlBtn value={sortBy}   set={setSortBy}   labels={{ recent: 'Sort by...', popular: 'Popularity' }} />
      </div>

      <h1 className="text-2xl font-bold tracking-tight">Community</h1>

      {/* Posts */}
      <div className="space-y-4">
        {isLoading ? <div className="text-center py-12 text-muted-foreground">Loading posts...</div> : displayPosts.map(post => {
          const postReplies = replies[post.id] ?? []
          const isReplying  = showReply.has(post.id)
          const isShared    = sharedFor?.postId === post.id

          return (
            <div key={post.id} className="flex items-start gap-4">
              <Avatar className="w-11 h-11 shrink-0 border border-border">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">{post.avatar}</AvatarFallback>
              </Avatar>

              <div className="flex-1 border border-border rounded-xl bg-card shadow-sm overflow-hidden">
                {/* Post body */}
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">{post.user}</p>
                    <p className="text-xs text-muted-foreground">{post.time}</p>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{post.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={cn('flex items-center gap-1.5 text-xs transition-colors', liked.has(post.id) ? 'text-red-500' : 'text-muted-foreground hover:text-red-500')}
                    >
                      <Heart className={cn('w-3.5 h-3.5', liked.has(post.id) && 'fill-current')} />
                      {post.likes}
                    </button>

                    <button
                      onClick={() => toggleReply(post.id)}
                      className={cn('flex items-center gap-1.5 text-xs transition-colors', isReplying ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Reply {postReplies.length > 0 && `(${postReplies.length})`}
                    </button>

                    {/* Share itinerary dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <button className={cn('flex items-center gap-1.5 text-xs transition-colors', isShared ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}>
                          <Share2 className="w-3.5 h-3.5" />
                          {isShared ? 'Shared!' : 'Share itinerary'}
                        </button>
                      } />
                      <DropdownMenuContent align="start" className="w-56">
                        <div className="px-3 py-2 text-xs text-muted-foreground font-medium border-b border-border mb-1">Share one of your trips</div>
                        {mockTrips.map(trip => (
                          <DropdownMenuItem key={trip.id} onClick={() => handleShareTrip(post.id, trip.id)}>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{trip.name}</p>
                              <p className="text-[10px] text-muted-foreground capitalize">{trip.status}</p>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Existing replies */}
                {postReplies.length > 0 && (
                  <div className="border-t border-border bg-muted/20 px-5 py-3 space-y-3">
                    {postReplies.map((r, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Avatar className="w-7 h-7 shrink-0 border border-border">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">{r.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold">{r.user}</span>
                            <span className="text-[10px] text-muted-foreground">{r.time}</span>
                          </div>
                          <p className="text-xs text-foreground/80 leading-relaxed">{r.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply input */}
                {isReplying && (
                  <div className="border-t border-border bg-muted/20 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7 shrink-0 border border-border">
                        <AvatarFallback className="text-[10px] bg-primary text-primary-foreground font-semibold">{user?.avatar || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex items-center gap-2 border border-border rounded-lg bg-background px-3 py-2">
                        <input
                          className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                          placeholder={`Reply to ${post.user}...`}
                          value={replyTexts[post.id] ?? ''}
                          onChange={e => setReplyTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') submitReply(post.id) }}
                          autoFocus
                        />
                        <button onClick={() => submitReply(post.id)} className="text-primary hover:text-primary/80 transition-colors disabled:opacity-40" disabled={!replyTexts[post.id]?.trim()}>
                          <Send className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleReply(post.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {!isLoading && displayPosts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No posts match your search.</p>
        )}
      </div>
    </div>
  )
}
