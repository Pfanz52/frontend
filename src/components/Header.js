import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';

function Header () {
  const { user, logout } = useAuth();
  const { cart, clearCart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);

  // Thêm state cho tìm kiếm
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    clearCart();
    window.location.href = '/';
  };

  // Xử lý tìm kiếm sản phẩm khi submit form
  const handleSearch = e => {
    e.preventDefault();
    // Nếu có từ khoá thì chuyển sang trang products với query search
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setSearch('');
    }
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className='sticky-top shadow-sm'>
      <nav className='navbar navbar-expand-lg navbar-dark bg-dark py-2'>
        <div className='container'>
          <Link className='navbar-brand fw-bold fs-4' to='/'>
            <i className='bi bi-cpu me-2'></i>Linh Kiện Store
          </Link>

          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarContent'
          >
            <span className='navbar-toggler-icon'></span>
          </button>

          <div className='collapse navbar-collapse' id='navbarContent'>
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
              <li className='nav-item'>
                <Link to='/about' className='nav-link'>
                  Giới thiệu
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/products' className='nav-link'>
                  Sản phẩm
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/contact' className='nav-link'>
                  Liên hệ
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/policy' className='nav-link'>
                  Bảo hành
                </Link>
              </li>
            </ul>

            {/* Cập nhật: form tìm kiếm */}
            <form className='d-flex me-3' role='search' onSubmit={handleSearch}>
              <input
                className='form-control form-control-sm me-2'
                type='search'
                placeholder='Tìm kiếm sản phẩm...'
                aria-label='Search'
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className='btn btn-outline-light btn-sm' type='submit'>
                🔍
              </button>
            </form>

            <ul className='navbar-nav d-flex align-items-center gap-2'>
              <li className='nav-item'>
                <Link
                  to='/cart'
                  className='text-white text-decoration-none position-relative cart-icon'
                >
                  🛒 Giỏ hàng
                  <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                    {totalItems || 0}
                  </span>
                </Link>
              </li>

              <li className='nav-item dropdown' ref={dropdownRef}>
                {user ? (
                  <div className='dropdown'>
                    <button
                      className='nav-link dropdown-toggle btn btn-link text-white text-decoration-none'
                      onClick={() => setShowMenu(!showMenu)}
                    >
                      {user.name}
                    </button>

                    {showMenu && (
                      <ul className='dropdown-menu dropdown-menu-end show position-absolute mt-2'>
                        <li>
                          <Link
                            className='dropdown-item'
                            to='/profile'
                            onClick={() => setShowMenu(false)}
                          >
                            Hồ sơ
                          </Link>
                        </li>
                        <li>
                          <Link
                            className='dropdown-item'
                            to='/orders'
                            onClick={() => setShowMenu(false)}
                          >
                            Đơn hàng
                          </Link>
                        </li>
                        <li>
                          <button
                            className='dropdown-item'
                            onClick={() => {
                              handleLogout();
                              setShowMenu(false);
                            }}
                          >
                            Đăng xuất
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link to='/login' className='nav-link'>
                    Đăng nhập
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
