import { useState } from 'react'
import authService from '../services/authService'
import { AuthContext } from './AuthContextObject'

// Helper to get initial user state from localStorage (lazy init)
const getInitialUser = () => {
  try {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (storedUser && token) {
      return JSON.parse(storedUser)
    }
    return null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser)

  const login = async (email, password) => {
    const response = await authService.login(email, password)
    const { data } = response
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return response
  }

  const register = async (userData) => {
    const response = await authService.register(userData)
    const { data } = response
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return response
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}