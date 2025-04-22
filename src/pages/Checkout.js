import axios from 'axios';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './Checkout.css';

function Checkout() {
  const [qrImage, setQrImage] = useState('');
  const { cart, clearCart } = useCart();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    province: '',
    district: '',
    ward: '',
    addressDetail: '',
    note: '',
  });

  const [voucher, setVoucher] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [success, setSuccess] = useState(false);
  const [latestOrder, setLatestOrder] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    axios.get('https://provinces.open-api.vn/api/p/')
      .then(res => setProvinces(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (form.province) {
      axios.get(`https://provinces.open-api.vn/api/p/${form.province}?depth=2`)
        .then(res => setDistricts(res.data.districts))
        .catch(err => console.error(err));
    }
  }, [form.province]);

  useEffect(() => {
    if (form.district) {
      axios.get(`https://provinces.open-api.vn/api/d/${form.district}?depth=2`)
        .then(res => setWards(res.data.wards))
        .catch(err => console.error(err));
    }
  }, [form.district]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const requiredFields = ['name', 'phone', 'email', 'province', 'district', 'ward', 'addressDetail'];
    const missing = requiredFields.filter(field => !form[field]);
    if (missing.length > 0) {
      alert(`⚠️ Vui lòng điền đầy đủ thông tin: ${missing.join(', ')}`);
      return;
    }

    if (cart.length === 0) {
      alert('⚠️ Giỏ hàng đang trống!');
      return;
    }

    const selectedProvince = provinces.find(p => p.code === +form.province);
    const selectedDistrict = districts.find(d => d.code === +form.district);
    const selectedWard = wards.find(w => w.code === +form.ward);

    try {
      const res = await axios.post('http://localhost:5000/api/orders', {
        ...form,
        province: selectedProvince?.name || '',
        district: selectedDistrict?.name || '',
        ward: selectedWard?.name || '',
        products: cart,
        total,
        paymentMethod,
        voucher,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      clearCart();
      setLatestOrder(res.data.order);
      setSuccess(true);

      // Tạo mã QR nếu chọn chuyển khoản
      if (res.data.order.paymentMethod === 'bank') {
        const qrRes = await axios.post('https://api.vietqr.io/v2/generate', {
          accountNo: '0365956252',
          accountName: 'DANG HUU PHUOC',
          acqId: '970422',
          amount: res.data.order.total,
          addInfo: res.data.order.orderCode,
          template: 'compact'
        });
        setQrImage(qrRes.data.data.qrDataURL);
      }

    } catch (err) {
      console.error(err);
      alert('❌ Đặt hàng thất bại. Vui lòng thử lại!');
    }
  };

  if (success && latestOrder) {
    return (
      <div className="container mt-5">
        <h2>✅ Đặt hàng thành công!</h2>
        <p>Cảm ơn bạn <strong>{latestOrder.name}</strong> đã đặt hàng.</p>

        <h5>🧾 Hóa đơn</h5>
        <p><strong>Địa chỉ:</strong> {latestOrder.addressDetail}, {latestOrder.ward}, {latestOrder.district}, {latestOrder.province}</p>
        <p><strong>SĐT:</strong> {latestOrder.phone}</p>
        <p><strong>Phương thức:</strong> {latestOrder.paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản ngân hàng'}</p>

        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {latestOrder.products.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.price.toLocaleString()} VNĐ</td>
                <td>{item.quantity}</td>
                <td>{(item.price * item.quantity).toLocaleString()} VNĐ</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-end fw-bold">
          Tổng tiền: {latestOrder.total.toLocaleString()} VNĐ
        </div>

        {/* Hiển thị mã QR nếu chọn bank */}
        {latestOrder.paymentMethod === 'bank' && (
          <div className="mt-4 text-center">
            <h5>🔁 Quét mã để chuyển khoản</h5>
            {qrImage && <img src={qrImage} alt="QR VietQR" style={{ width: 220 }} />}
            <p><strong>Số tiền:</strong> {latestOrder.total.toLocaleString()} VNĐ</p>
            <p><strong>Nội dung chuyển khoản:</strong> {latestOrder.orderCode}</p>
          </div>
        )}

        <div className="text-center mt-4">
          <button className="btn btn-outline-secondary me-2" onClick={() => window.print()}>
            🖨️ In hóa đơn
          </button>
          <a href="/orders" className="btn btn-dark">🧾 Xem tất cả đơn hàng</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 checkout-wrapper">
      <h2 className="checkout-title">🧾 Thanh Toán</h2>

      {/* Địa chỉ nhận hàng */}
      <div className="checkout-section">
        <h5>1. Địa chỉ nhận hàng</h5>
        <div className="row g-2">
          <div className="col-md-6"><input type="text" name="name" className="form-control" placeholder="Họ và tên" onChange={handleChange} /></div>
          <div className="col-md-6"><input type="tel" name="phone" className="form-control" placeholder="Số điện thoại" onChange={handleChange} /></div>
          <div className="col-12"><input type="email" name="email" className="form-control" placeholder="Email nhận hóa đơn" onChange={handleChange} /></div>
          <div className="col-md-4">
            <select className="form-select" name="province" onChange={handleChange}>
              <option value="">Tỉnh / Thành phố</option>
              {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <select className="form-select" name="district" onChange={handleChange}>
              <option value="">Quận / Huyện</option>
              {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <select className="form-select" name="ward" onChange={handleChange}>
              <option value="">Phường / Xã</option>
              {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
            </select>
          </div>
          <div className="col-12">
            <input type="text" name="addressDetail" className="form-control" placeholder="Số nhà, tên đường..." onChange={handleChange} />
          </div>
          <div className="col-12">
            <textarea name="note" className="form-control" placeholder="Ghi chú cho người bán (nếu có)" onChange={handleChange}></textarea>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="checkout-section mt-4">
        <h5>2. Sản phẩm</h5>
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index}>
                <td><img src={item.image} alt={item.name} style={{ width: 60 }} /></td>
                <td>{item.name}</td>
                <td>{item.price.toLocaleString()} VNĐ</td>
                <td>{item.quantity}</td>
                <td>{(item.price * item.quantity).toLocaleString()} VNĐ</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-end fs-5">
          Tổng cộng: <span className="text-danger fw-bold">{total.toLocaleString()} VNĐ</span>
        </div>
      </div>

      {/* Mã giảm giá */}
      <div className="checkout-section mt-4">
        <h5>🎁 Mã giảm giá</h5>
        <input type="text" className="form-control" value={voucher} onChange={(e) => setVoucher(e.target.value)} placeholder="Nhập mã nếu có" />
      </div>

      {/* Phương thức thanh toán */}
      <div className="checkout-section mt-4">
        <h5>💳 Phương thức thanh toán</h5>
        <div>
    <label className="d-block">
            <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} /> Thanh toán khi nhận hàng (COD)
          </label>
          <label className="d-block mt-2">
            <input type="radio" value="bank" checked={paymentMethod === 'bank'} onChange={(e) => setPaymentMethod(e.target.value)} /> Chuyển khoản ngân hàng
          </label>
          {paymentMethod === 'bank' && (
            <div className="mt-3 text-center">
              {/* <img src="/images/vietqr.png" alt="QR" style={{ width: 220 }} /> */}
              {/* <p className="text-muted">Quét mã để chuyển khoản</p> */}
            </div>
          )}
        </div>
      </div>

      {/* Nút đặt hàng */}
      <div className="text-end mt-4">
        <button className="btn btn-danger px-4 py-2" onClick={handleSubmit}>🛒 Đặt hàng</button>
      </div>
    </div>
  );
}

export default Checkout;
