import { useState, useEffect } from 'react'
import apiClient from '../api/apiClient'

export interface User {
  id: string;
  email: string;
  fullName?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
        // Optionally verify token with /me endpoint
        try {
          const response = await apiClient.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.data);
            localStorage.setItem('user', JSON.stringify(response.data.data));
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false)
    }

    checkAuth();
  }, [])

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const response = await apiClient.post('/auth/register', { email, password, fullName });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { data: { user: userData }, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.error || 'Registration failed' };
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { data: { user: userData }, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.error || 'Login failed' };
    }
  }

  const signOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    return { error: null };
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }
}