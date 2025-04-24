import { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

function ForgotPassword () {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/forgot-password',
        { email }
      );
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Gửi email thất bại');
    }
  };

  return (
    <div className='forgot-bg'>
      <div className='forgot-card'>
        <div className='forgot-header'>
          <span className='forgot-icon'>🔒</span>
          <h2 className='forgot-title'>Quên mật khẩu</h2>
        </div>
        {message && <div className='alert alert-success'>{message}</div>}
        {error && <div className='alert alert-danger'>{error}</div>}
        <form onSubmit={handleSubmit} autoComplete='off'>
          <label className='form-label' htmlFor='forgot-email'>
            Email đã đăng ký:
          </label>
          <input
            id='forgot-email'
            type='email'
            className='form-control'
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
            placeholder='Nhập email'
          />
          <button className='btn btn-forgot' type='submit'>
            Gửi mã xác nhận
          </button>
        </form>
        <div className='forgot-footer'>
          Đã nhớ mật khẩu? <a href='/login'>Đăng nhập</a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
