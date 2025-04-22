import React from 'react';
import './Policy.css';

function Policy() {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">🛡️ Chính Sách Bảo Hành</h2>

      <h5>⏱️ Thời gian bảo hành</h5>
      <p>
        Sản phẩm được bảo hành từ 3 đến 12 tháng tùy theo từng loại. Thời gian bảo hành được ghi rõ trong phần thông tin sản phẩm.
      </p>

      <h5>✔️ Điều kiện bảo hành</h5>
      <ul>
        <li>Sản phẩm còn thời hạn bảo hành.</li>
        <li>Có hoá đơn mua hàng hoặc thông tin đặt hàng.</li>
        <li>Lỗi do nhà sản xuất, không phải lỗi người dùng.</li>
      </ul>

      <h5>❌ Không bảo hành nếu</h5>
      <ul>
        <li>Sản phẩm bị cháy nổ, vô nước, va đập mạnh.</li>
        <li>Tự ý tháo lắp, chỉnh sửa phần cứng.</li>
        <li>Sử dụng sai hướng dẫn kỹ thuật.</li>
      </ul>

      <h5>📮 Hỗ trợ</h5>
      <p>Mọi yêu cầu bảo hành vui lòng gửi về email: <strong>baohanh@linhkienstore.vn</strong></p>
    </div>
  );
}

export default Policy;
