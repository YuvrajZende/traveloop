'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockTrips, currentUser } from '@/lib/mock-data'
import { Search, Heart, MessageCircle, Share2, Send, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Reply { user: string; avatar: string; text: string; time: string }
interface Post {
  id: number
  user: string
  avatar: string
  content: string
  time: string
  likes: number
}

const INITIAL_POSTS: Post[] = [
  { id: 1, user: 'Sarah M.',  avatar: 'SM', content: 'Just got back from Bali — the rice terraces at dawn are absolutely breathtaking. Spent 10 days exploring Ubud and Seminyak. Happy to share my itinerary!', time: '2h ago',  likes: 24 },
  { id: 2, user: 'James K.',  avatar: 'JK', content: 'Tokyo in cherry blossom season is on another level. Shinjuku Gyoen was packed but worth every second. Pro tip: go early morning for fewer crowds.', time: '5h ago',  likes: 41 },
  { id: 3, user: 'Priya R.',  avatar: 'PR', content: 'Planning a Southeast Asia trip and looking for recommendations — Bangkok, Chiang Mai, or straight to Vietnam? Would love community input on the best route!', time: '1d ago',  likes: 18 },
  { id: 4, user: 'Marco T.',  avatar: 'MT', content: 'Lisbon is massively underrated for budget travel in Europe. Incredible food, beautiful architecture, and so much history. Did a week for under €700 all-in.', time: '2d ago',  likes: 55 },
]

type SortKey   = 'recent' | 'popular'
type FilterKey = 'all' | 'questions' | 'tips'

export default function CommunityPage() {
  const [search,     setSearch]     = useState('')
  const [sortBy,     setSortBy]     = useState<SortKey>('recent')
  const [filterBy,   setFilterBy]   = useState<FilterKey>('all')
  const [posts,      setPosts]      = useState<Post[]>(INITIAL_POSTS)
  const [liked,      setLiked]      = useState<Set<number>>(new Set())
  const [replies,    setReplies]    = useState<Record<number, Reply[]>>({})
  const [showReply,  setShowReply]  = useState<Set<number>>(new Set())
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({})
  const [sharedFor,  setSharedFor]  = useState<{ postId: number; tripId: string } | null>(null)

  function toggleLike(id: number) {
    setLiked(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + (liked.has(id) ? -1 : 1) } : p))
  }

  function toggleReply(id: number) {
    setShowReply(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  function submitReply(postId: number) {
    const text = replyTexts[postId]?.trim()
    if (!text) return
    setReplies(prev => ({
      ...prev,
      [postId]: [...(prev[postId] ?? []), { user: currentUser.name, avatar: currentUser.avatar, text, time: 'Just now' }]
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
        <ControlBtn value={filterBy} set={setFilterBy} labels={{ all: 'All posts', questions: 'Questions', tips: 'Tips' }} />
        <ControlBtn value={sortBy}   set={setSortBy}   labels={{ recent: 'Most recent', popular: 'Most popular' }} />
      </div>

      <h1 className="text-2xl font-bold tracking-tight">Community</h1>

      {/* Posts */}
      <div className="space-y-4">
        {displayPosts.map(post => {
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
                        <AvatarFallback className="text-[10px] bg-primary text-primary-foreground font-semibold">{currentUser.avatar}</AvatarFallback>
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

        {displayPosts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No posts match your search.</p>
        )}
      </div>
    </div>
  )
}
