import { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [newName, setNewName] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  // Lấy thông tin người dùng từ localStorage khi load trang
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setNewName(userData.name);
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessages([]);
    setError('');
    const token = localStorage.getItem('token');

    try {
      const updatedMessages = [];

      // ✅ Cập nhật tên nếu có thay đổi
      if (newName !== user.name) {
        const res = await axios.put(
          'http://localhost:5000/api/users/profile',
          { name: newName },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const updatedUser = res.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        updatedMessages.push('✅ Đã cập nhật tên!');
      }

      // ✅ Đổi mật khẩu nếu có nhập
      if (password && newPassword) {
        await axios.put(
          'http://localhost:5000/api/auth/update-password',
          { currentPassword: password, newPassword },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        updatedMessages.push('🔐 Đã đổi mật khẩu!');
      }

      setMessages(updatedMessages);
      setPassword('');
      setNewPassword('');
    } catch (err) {
        console.log(error.response);
      setError(err.response?.data?.message || 'Lỗi cập nhật thông tin');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>👤 Hồ sơ cá nhân</h2>

        {messages.length > 0 &&
          messages.map((msg, idx) => (
            <div key={idx} className="alert alert-success">
              {msg}
            </div>
          ))}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleUpdate}>
          <label>Tên:</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />

          <label>Email:</label>
          <input type="email" value={user.email} disabled />

          <hr />
          <h5>🔒 Đổi mật khẩu</h5>

          <label>Mật khẩu hiện tại:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Bỏ qua nếu không đổi"
          />

          <label>Mật khẩu mới:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Bỏ qua nếu không đổi"
          />

          <button type="submit" className="btn btn-dark w-100 mt-3">
            Cập nhật
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
