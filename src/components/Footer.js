import './Footer.css';

function Footer() {
  return (
    <footer className="footer bg-dark text-white pt-4 mt-5">
      <div className="container">
        <div className="row">

          {/* Cột 1 */}
          <div className="col-md-4">
            <h5>VỀ CHÚNG TÔI</h5>
            <p>
              Linh Kiện Store cung cấp thiết bị điện tử, cảm biến, IOT, Arduino, ESP32...
              Sản phẩm chất lượng, hỗ trợ tận tình, giao hàng toàn quốc.
            </p>
          </div>

          {/* Cột 2 */}
          <div className="col-md-4">
            <h5>LIÊN KẾT NHANH</h5>
            <ul className="list-unstyled">
              <li><a href="/about">Giới thiệu</a></li>
              <li><a href="/products">Sản phẩm</a></li>
              <li><a href="/contact">Liên hệ</a></li>
              <li><a href="/policy">Chính sách bảo hành</a></li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div className="col-md-4">
            <h5>LIÊN HỆ</h5>
            <p>📞 0972.84.11.66</p>
            <p>📧 sale.banlinhkien@gmail.com</p>
            <p>📍 Số 123, Q. Tân Bình, TP.HCM</p>
          </div>

        </div>
        <hr />
        <p className="text-center pb-3">© {new Date().getFullYear()} Linh Kiện Store. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
