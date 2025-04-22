import { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Gửi email thất bại');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-card">
        <h2>🔒 Quên mật khẩu</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email đã đăng ký:</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
          <button type="submit">Gửi mã xác nhận</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
