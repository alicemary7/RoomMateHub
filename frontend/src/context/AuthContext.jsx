import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('roommatehub_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user session
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('roommatehub_token');
      const savedUser = localStorage.getItem('roommatehub_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Refresh profile in background
          const res = await API.get('/auth/me');
          if (res.data?.success) {
            setUser(res.data.data);
            localStorage.setItem('roommatehub_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen to window logout event from API interceptor
    const handleLogoutEvent = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => window.removeEventListener('auth-logout', handleLogoutEvent);
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data?.success) {
      const { token: receivedToken, user: loggedUser } = res.data;
      setToken(receivedToken);
      setUser(loggedUser);
      localStorage.setItem('roommatehub_token', receivedToken);
      localStorage.setItem('roommatehub_user', JSON.stringify(loggedUser));
      return loggedUser;
    }
  };

  const register = async (userData) => {
    const res = await API.post('/auth/register', userData);
    if (res.data?.success) {
      const { token: receivedToken, user: newUser } = res.data;
      setToken(receivedToken);
      setUser(newUser);
      localStorage.setItem('roommatehub_token', receivedToken);
      localStorage.setItem('roommatehub_user', JSON.stringify(newUser));
      return newUser;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('roommatehub_token');
    localStorage.removeItem('roommatehub_user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('roommatehub_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        isTenant: user?.role === 'tenant',
        isOwner: user?.role === 'owner',
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
