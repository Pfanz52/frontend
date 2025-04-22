import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider ({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (token) {
      try {
        const decoded = jwtDecode(token);
        const newUser = {
          id: decoded.userId,
          name: decoded.name,
          email: decoded.email,
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      } catch (err) {
        console.error('❌ Lỗi decode token:', err);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);

  }, []);

  const login = userData => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
