import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    axios
      .get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
        setFilteredOrders(res.data);
      })
      .catch((err) => console.error('❌ Lỗi lấy đơn hàng:', err));
  }, [token]);

  useEffect(() => {
    let result = [...orders];

    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter(order => new Date(order.createdAt) >= from);
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter(order => new Date(order.createdAt) <= to);
    }

    setFilteredOrders(result);
    setCurrentPage(1); // reset về trang đầu
  }, [statusFilter, dateFrom, dateTo, orders]);

  const handleCancel = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Đã hủy đơn hàng');
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      alert(`❌ ${err.response?.data?.message || 'Không thể hủy đơn'}`);
    }
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="container mt-5">
      <h2>🧾 Đơn hàng của bạn</h2>

      {/* Bộ lọc */}
      <div className="row mb-4 g-2">
        <div className="col-md-3">
          <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">🔍 Lọc theo trạng thái</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đã hủy">Đã hủy</option>
            <option value="Đã giao">Đã giao</option>
          </select>
        </div>
        <div className="col-md-3">
          <input type="date" className="form-control" value={dateFrom} onChange={e => setDateFrom(e.target.value)} placeholder="Từ ngày" />
        </div>
        <div className="col-md-3">
          <input type="date" className="form-control" value={dateTo} onChange={e => setDateTo(e.target.value)} placeholder="Đến ngày" />
        </div>
      </div>

      {paginatedOrders.length === 0 ? (
        <p>Không có đơn hàng nào phù hợp.</p>
      ) : (
        paginatedOrders.map((order, idx) => (
          <div key={idx} className="order-card border p-3 my-3 rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5>🧍‍♂️ {order.name}</h5>
              <span className={`badge bg-${order.status === 'Đã hủy' ? 'danger' : 'success'}`}>
                {order.status}
              </span>
            </div>

            <p><strong>📅 Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
            <p><strong>📍 Địa chỉ:</strong> {order.addressDetail}, {order.ward}, {order.district}, {order.province}</p>
            <p><strong>📞 SĐT:</strong> {order.phone}</p>
            <p><strong>💳 Thanh toán:</strong> {order.paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản'}</p>
            <p><strong>🚚 Đơn vị vận chuyển:</strong> {order.shippingProvider || 'Giao hàng nhanh'}</p>
            <p><strong>📦 Giao dự kiến:</strong> {new Date(order.estimatedDelivery).toLocaleDateString('vi-VN')}</p>

            <table className="table table-bordered mt-3">
              <thead className="table-light">
                <tr>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((p, i) => (
                  <tr key={i}>
                    <td><img src={p.image} alt={p.name} width="60" style={{ borderRadius: 4 }} /></td>
                    <td>{p.name}</td>
                    <td>{p.price.toLocaleString()} VNĐ</td>
                    <td>{p.quantity}</td>
                    <td>{(p.price * p.quantity).toLocaleString()} VNĐ</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-end fw-bold">Tổng cộng: {order.total.toLocaleString()} VNĐ</p>

            {order.status === 'Chờ xác nhận' && (
              <div className="text-end">
                <button onClick={() => handleCancel(order._id)} className="btn btn-outline-danger btn-sm">
                  ❌ Hủy đơn
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Orders;
