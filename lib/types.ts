export interface Activity {
  id: string
  name: string
  type: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'shopping'
  duration: number // hours
  cost: number
  description: string
  time?: string
}

export interface Stop {
  id: string
  city: string
  country: string
  startDate: string
  endDate: string
  days: number
  activities: Activity[]
  accommodation: number
  transport: number
}

export interface Trip {
  id: string
  name: string
  description: string
  coverImage: string
  startDate: string
  endDate: string
  stops: Stop[]
  totalBudget: number
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed'
  isPublic: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
}
