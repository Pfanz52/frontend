import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

function ResetPassword() {
  const { token } = useParams(); // Lấy token từ URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 3000); // quay lại login sau 3s
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đặt lại mật khẩu');
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>🔑 Đặt lại mật khẩu</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleReset}>
          <label>Mật khẩu mới:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Nhập lại mật khẩu:</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button type="submit">Xác nhận</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
