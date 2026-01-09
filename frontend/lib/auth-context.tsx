import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { api } from './api'

interface User {
  id: string
  email: string
  role: 'investor' | 'startup'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, role: 'investor' | 'startup') => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = Cookies.get('token')
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const response = await api.get('/auth/me')
        const userData = response.data
        if (userData && userData.role) {
          userData.role = userData.role.toLowerCase()
        }
        setUser(userData)
      } catch (error) {
        Cookies.remove('token')
        delete api.defaults.headers.common['Authorization']
      }
    }
    setLoading(false)
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { access_token, role } = response.data

      Cookies.set('token', access_token, { expires: 1 }) // 1 day
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      const normalizedRole = role.toLowerCase()
      setUser({ id: '', email, role: normalizedRole }) // ID will be set by checkAuth
      await checkAuth()

      // Redirect based on role
      if (normalizedRole === 'investor') {
        router.push('/investor')
      } else {
        router.push('/startup')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      const message = error.response?.data?.detail
        || (error.message === 'Network Error' ? 'Unable to connect to server. Check if backend is running.' : error.message)
        || 'Login failed';
      throw new Error(message)
    }
  }

  const signup = async (email: string, password: string, role: 'investor' | 'startup') => {
    try {
      const response = await api.post('/auth/signup', { email, password, role: role.toUpperCase() })
      const { access_token } = response.data

      Cookies.set('token', access_token, { expires: 1 })
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      setUser({ id: '', email, role })
      await checkAuth()

      const normalizedRole = role.toLowerCase()
      // Redirect to onboarding
      if (normalizedRole === 'investor') {
        router.push('/investor/onboarding')
      } else {
        router.push('/startup/onboarding')
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      const message = error.response?.data?.detail
        || (error.message === 'Network Error' ? 'Unable to connect to server. Check if backend is running.' : error.message)
        || 'Signup failed';
      throw new Error(message)
    }
  }

  const logout = () => {
    Cookies.remove('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}