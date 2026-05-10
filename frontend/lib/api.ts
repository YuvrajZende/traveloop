const BASE_URL = 'http://localhost:3000/api';

/**
 * Gets the JWT token from localStorage
 */
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('traveloop_token');
  }
  return null;
};

/**
 * Sets the JWT token to localStorage
 */
export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('traveloop_token', token);
  }
};

/**
 * Clears the JWT token
 */
export const clearToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('traveloop_token');
  }
};

/**
 * Core fetch wrapper that injects Authorization headers
 */
export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'An error occurred');
  }

  return data;
}

// ==========================================
// Authentication APIs
// ==========================================

export const authApi = {
  login: async (credentials: any) => {
    const data = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      setToken(data.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('traveloop_user', JSON.stringify(data.user));
      }
    }
    return data;
  },
  
  register: async (userData: any) => {
    const data = await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      setToken(data.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('traveloop_user', JSON.stringify(data.user));
      }
    }
    return data;
  },

  logout: () => {
    clearToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('traveloop_user');
    }
  },
  
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('traveloop_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
};
