import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute ({ children }) {
  const { user, loading } = useAuth();

  if (loading)
    return <p className='text-center mt-5'>🔒 Đang xác minh tài khoản...</p>;

  return user ? children : <Navigate to='/login' />;
}

export default PrivateRoute;
