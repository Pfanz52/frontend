import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      alert('❌ Gửi phản hồi thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 text-dark">
        📞 Liên Hệ Với Chúng Tôi
      </h2>

      <div className="row g-4">
        {/* Form phản hồi + thông tin */}
        <div className="col-md-6">
          <div className="card shadow-sm p-4 border-0 rounded-4">
            <h5 className="mb-3">💬 Gửi phản hồi</h5>

            {success && (
              <div className="alert alert-success p-2">
                ✅ Phản hồi của bạn đã được tiếp nhận. Chúng tôi sẽ liên hệ sớm!
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Họ và tên"
                className="form-control mb-3"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email liên hệ"
                className="form-control mb-3"
                value={form.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Nội dung phản hồi"
                className="form-control mb-3"
                rows="4"
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
              <button type="submit" className="btn btn-dark w-100">
                📤 Gửi phản hồi
              </button>
            </form>

            <hr className="my-4" />

            <h5 className="mb-3">📍 Thông tin cửa hàng</h5>
            <p><i className="bi bi-geo-alt-fill text-primary me-2"></i><strong>Địa chỉ:</strong> 123 Đường Lập Trình, TP.HCM</p>
            <p><i className="bi bi-envelope-fill text-primary me-2"></i><strong>Email:</strong> support@linhkienstore.vn</p>
            <p><i className="bi bi-telephone-fill text-primary me-2"></i><strong>Hotline:</strong> 0909 123 456</p>
          </div>
        </div>

        {/* Google Map */}
        <div className="col-md-6">
          <div className="card shadow-sm p-0 border-0 rounded-4 overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4691891000026!2d106.70042397480582!3d10.77565835919559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1dd8a82b33%3A0xd7dc79e18b4fd6e7!2zMjA2IEzhuqF5IFbEg24gSGnhu4dwLCBQaMaw4budbmcgNCwgUXXhuq1uIDMsIEjDoCBO4buZaSwgVmlldG5hbQ!5e0!3m2!1svi!2s!4v1713700000000!5m2!1svi!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Linh Kiện Store Map"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
