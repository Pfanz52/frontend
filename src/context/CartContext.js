import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (token && user) {
      axios
        .get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          setCart(res.data || []);
          setLoaded(true);
        })
        .catch(err => {
          console.error('❌ Lỗi tải giỏ hàng:', err);
          setLoaded(true);
        });
    } else {
      setCart([]);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (token && user && loaded) {
      axios
        .post(
          'http://localhost:5000/api/cart',
          {
            items: cart,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .catch(err => console.error('❌ Lỗi lưu giỏ hàng:', err));
    }
  }, [cart, loaded]);

  const addToCart = product => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('⚠️ Bạn cần đăng nhập để thêm vào giỏ hàng!');
      return;
    }

    const exist = cart.find(item => item._id === product._id);
    if (exist) {
      setCart(
        cart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const decreaseQuantity = id => {
    const item = cart.find(p => p._id === id);
    if (!item) return;

    if (item.quantity === 1) {
      setCart(cart.filter(p => p._id !== id));
    } else {
      setCart(
        cart.map(p => (p._id === id ? { ...p, quantity: p.quantity - 1 } : p))
      );
    }
  };

  const removeFromCart = id => {
    setCart(cart.filter(item => item._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
