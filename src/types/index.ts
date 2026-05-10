export interface User {
  id: string
  name: string
  email: string
  photo?: string
  phone?: string
  city?: string
  country?: string
  role: 'user' | 'admin'
}

export interface Trip {
  id: string
  name: string
  description?: string
  coverPhoto?: string
  startDate: string
  endDate: string
  status: 'ongoing' | 'upcoming' | 'completed'
  isPublic: boolean
  stops: Stop[]
  user: User
  createdAt?: string
}

export interface Stop {
  id: string
  city: string
  country?: string
  startDate: string
  endDate: string
  budget?: number
  order: number
  description?: string
  activities: Activity[]
}

export interface Activity {
  id: string
  name: string
  type: string
  cost?: number
  duration?: string
  description?: string
}

export interface ChecklistItem {
  id: string
  label: string
  category: string
  packed: boolean
}

export interface Note {
  id: string
  title: string
  content: string
  stopRef?: string
  dayRef?: string
  createdAt: string
  user?: User
}

export interface InvoiceItem {
  id: string
  description: string
  category: string
  qty?: string
  unitCost: number
  amount: number
}

export interface Invoice {
  id: string
  status: 'pending' | 'paid'
  travelers: string
  generatedAt: string
  items: InvoiceItem[]
}

export interface CommunityPost {
  id: string
  tripId?: string
  userId: string
  title: string
  description: string
  tags: string
  createdAt: string
  user?: User
}

export interface City {
  id: string
  name: string
  country: string
  region?: string
  costIndex?: number
  popularity?: number
  imageUrl?: string
}

export interface ActivityTemplate {
  id: string
  name: string
  type: string
  cost?: number
  duration?: string
  description?: string
  imageUrl?: string
}

export interface BudgetSummary {
  totalBudget: number
  totalSpent: number
  remaining: number
  byStop: Array<{
    city: string
    budget: number
    spent: number
  }>
}
