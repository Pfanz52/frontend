import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import { FaLock, FaEnvelope, FaUser } from 'react-icons/fa';

function Login () {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      login(res.data.user);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-bg'>
      <div className='login-card shadow'>
        <div className='login-header'>
          <div className='avatar'>
            <FaUser />
          </div>
          <h2>Đăng nhập</h2>
        </div>
        {error && <div className='alert alert-danger text-center'>{error}</div>}
        <form onSubmit={handleLogin} autoComplete='off'>
          <div className='input-group'>
            <span className='input-icon'>
              <FaEnvelope />
            </span>
            <input
              type='email'
              name='email'
              placeholder='Email'
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className='input-group'>
            <span className='input-icon'>
              <FaLock />
            </span>
            <input
              type='password'
              name='password'
              placeholder='Mật khẩu'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button className='btn-login' type='submit' disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
        <div className='login-footer'>
          <a href='/register'>Chưa có tài khoản?</a>
          <span> | </span>
          <a href='/forgot-password'>Quên mật khẩu?</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
