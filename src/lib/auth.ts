const TOKEN_KEY = 'traveloop_token'

export const saveToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
    // Also set cookie for middleware
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`
  }
}

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
    document.cookie = 'token=; path=/; max-age=0'
  }
}
