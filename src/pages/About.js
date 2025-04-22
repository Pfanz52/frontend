import React from 'react';
import './About.css';

function About() {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">🔍 Về Linh Kiện Store</h2>
      <p>
        Linh Kiện Store là đơn vị hàng đầu trong lĩnh vực cung cấp linh kiện điện tử, thiết bị IoT và giải pháp công nghệ cho học tập, nghiên cứu và sản xuất. Chúng tôi không chỉ là nơi bán hàng, mà còn là người đồng hành công nghệ với khách hàng.
      </p>

      <h4 className="mt-4">🌟 Sứ mệnh</h4>
      <p>Hỗ trợ cộng đồng yêu công nghệ Việt Nam bằng cách cung cấp sản phẩm chất lượng, giá hợp lý, dịch vụ tận tâm.</p>

      <h4 className="mt-4">🧑‍🏫 Giá trị cốt lõi</h4>
      <ul>
        <li>Cam kết chất lượng</li>
        <li>Hỗ trợ kỹ thuật chuyên sâu</li>
        <li>Giao hàng nhanh chóng</li>
        <li>Đồng hành cùng học tập và sáng tạo</li>
      </ul>

      <h4 className="mt-4">📍 Trụ sở</h4>
      <p>123 Đường Lập Trình, Quận Kỹ Thuật, TP.HCM</p>
    </div>
  );
}

export default About;
