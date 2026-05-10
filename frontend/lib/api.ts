const BASE_URL = 'http://localhost:5000/api'

export const PLACE_IMAGES: Record<string, string> = {
  'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
  'osaka': 'https://images.unsplash.com/photo-1590559899731-a382839e5547?w=800&q=80',
  'kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
  'bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
  'chiang mai': 'https://images.unsplash.com/photo-1598935898639-31bc415458f7?w=800&q=80',
  'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
  'kuala lumpur': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
  'seoul': 'https://images.unsplash.com/photo-1538485399081-5f90071e7989?w=800&q=80',
  'beijing': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
  'shanghai': 'https://images.unsplash.com/photo-1538425749076-8a07d32d3e31?w=800&q=80',
  'hong kong': 'https://images.unsplash.com/photo-1550757750-4c18480e17b3?w=800&q=80',
  'taipei': 'https://images.unsplash.com/photo-1583951645888-5ea266f8880c?w=800&q=80',
  'mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
  'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
  'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
  'venice': 'https://images.unsplash.com/photo-1514890547358-a73d5f16c6e0?w=800&q=80',
  'florence': 'https://images.unsplash.com/photo-1543429258-c5ca390b0f66?w=800&q=80',
  'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
  'madrid': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80',
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80',
  'berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80',
  'vienna': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80',
  'prague': 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80',
  'budapest': 'https://images.unsplash.com/photo-1551867633-194f137a5dd8?w=800&q=80',
  'athens': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
  'santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
  'lisbon': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&q=80',
  'porto': 'https://images.unsplash.com/photo-1559056199-6952bf8d56a0?w=800&q=80',
  'istanbul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
  'los angeles': 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&q=80',
  'san francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80',
  'miami': 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800&q=80',
  'las vegas': 'https://images.unsplash.com/photo-1605833556294-4ba991a11128?w=800&q=80',
  'toronto': 'https://images.unsplash.com/photo-1517935706615-271b9a085b68?w=800&q=80',
  'vancouver': 'https://images.unsplash.com/photo-155951126053e-91d8a765b8d0?w=800&q=80',
  'mexico city': 'https://images.unsplash.com/photo-1518105779142-d975f2291788?w=800&q=80',
  'cancun': 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&q=80',
  'rio de janeiro': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80',
  'buenos aires': 'https://images.unsplash.com/photo-1589909202802-e4b9e8c325?w=800&q=80',
  'cape town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80',
  'sydney': 'https://images.unsplash.com/photo-1506973035872-a4c1629ee14e?w=800&q=80',
  'melbourne': 'https://images.unsplash.com/photo-1514395462725-fb45692a74f5?w=800&q=80',
  'auckland': 'https://images.unsplash.com/photo-1507699622108-4be3abd695e8?w=800&q=80',
  'cairo': 'https://images.unsplash.com/photo-1572286258217-40142c1c6a70?w=800&q=80',
  'marrakech': 'https://images.unsplash.com/photo-1597212618440-80611c9618f3?w=800&q=80',
  'hanoi': 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&q=80',
  'phuket': 'https://images.unsplash.com/photo-1583417317751-5f98f3b8e9b7?w=800&q=80',
}

export function getCoverImage(place: string | null): string {
  if (!place) return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'
  const key = place.toLowerCase().trim()
  if (PLACE_IMAGES[key]) return PLACE_IMAGES[key]
  for (const [city, url] of Object.entries(PLACE_IMAGES)) {
    if (key.includes(city) || city.includes(key)) return url
  }
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'
}

/**
 * Gets the JWT token from localStorage
 */
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('traveloop_token')
  }
  return null
}

/**
 * Sets the JWT token to localStorage
 */
export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('traveloop_token', token)
  }
}

/**
 * Clears the JWT token
 */
export const clearToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('traveloop_token')
  }
}

/**
 * Core fetch wrapper that injects Authorization headers
 */
export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = getToken()
  
  const headers = new Headers(options.headers || {})
  headers.set('Content-Type', 'application/json')
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred')
  }

  return data
}

// ==========================================
// Authentication APIs
// ==========================================

export const authApi = {
  login: async (credentials: any) => {
    const data = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    if (data.token) {
      setToken(data.token)
      if (typeof window !== 'undefined') {
        localStorage.setItem('traveloop_user', JSON.stringify(data.user))
      }
    }
    return data
  },
  
  register: async (userData: any) => {
    const data = await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    if (data.token) {
      setToken(data.token)
      if (typeof window !== 'undefined') {
        localStorage.setItem('traveloop_user', JSON.stringify(data.user))
      }
    }
    return data
  },

  logout: () => {
    clearToken()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('traveloop_user')
    }
  },
  
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('traveloop_user')
      return user ? JSON.parse(user) : null
    }
    return null
  }
}
