import './Register.css';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Mật khẩu không khớp');
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      console.log('Đăng ký thành công:', res.data);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng ký');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Tạo tài khoản</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-3"
          name="name"
          placeholder="Họ và tên"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          className="form-control mb-3"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          name="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          className="form-control mb-4"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          onChange={handleChange}
          required
        />
        <button className="btn btn-register" type="submit">
          Đăng ký
        </button>
      </form>
      <div className="register-footer">
        Đã có tài khoản? <a href="/login">Đăng nhập</a>
      </div>
    </div>
  );
}

export default Register;
