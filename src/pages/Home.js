import './Home.css';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// 🎞️ Banner đổi ảnh tự động
const bannerImages = [
  { src: '/images/banner_1.png', link: '/category/sweater' },
  { src: '/images/banner_2.png', link: '/category/glasses' },
  { src: '/images/banner_3.png', link: '/category/jacket' },
];

function BannerCarousel () {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % bannerImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className='mt-5 text-center'>
      <a href={bannerImages[current].link}>
        <img
          src={bannerImages[current].src}
          alt={`Banner ${current + 1}`}
          className='img-fluid rounded shadow'
          style={{ maxHeight: '300px', transition: 'all 0.5s ease-in-out' }}
        />
      </a>
    </div>
  );
}

function Home () {
  const [products, setProducts] = useState([]);
  // const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;
  const { addToCart } = useCart();

  const handleAddToCart = (e, product) => {
    const img = e.target.closest('.card').querySelector('img');
    const imgClone = img.cloneNode(true);
    const cartIcon = document.querySelector('.cart-icon');

    const rect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    imgClone.style.position = 'fixed';
    imgClone.style.top = rect.top + 'px';
    imgClone.style.left = rect.left + 'px';
    imgClone.style.width = img.width + 'px';
    imgClone.style.transition = 'all 0.7s ease-in-out';
    imgClone.style.zIndex = 999;
    document.body.appendChild(imgClone);

    setTimeout(() => {
      imgClone.style.top = cartRect.top + 'px';
      imgClone.style.left = cartRect.left + 'px';
      imgClone.style.width = '20px';
      imgClone.style.opacity = '0.5';
    }, 0);

    setTimeout(() => {
      document.body.removeChild(imgClone);
    }, 700);

    addToCart(product);
  };

  // ✅ Gọi API lấy sản phẩm có phân trang (không lọc)
  const fetchProducts = useCallback(() => {
    const url = `http://localhost:5000/api/products?page=${page}&limit=${limit}`;

    axios
      .get(url)
      .then(res => {
        const { products, total } = res.data;
        setProducts(products);
        setTotalPages(Math.ceil(total / limit));
      })
      .catch(err => console.log(err));
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ✅ Lấy thương hiệu 1 lần
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/brands')
      // .then(res => setBrands(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className='container mt-5'>
      {/* Banner */}
      <img src='/images/slider_1.png' alt='Banner' width='100%' />{' '}
      <hr className='mt-5' />
      <BannerCarousel />
      {/* Thương hiệu */}
      {/* <div className='row mt-5 text-center'>
        {brands.length === 0 ? (
          <p>Đang tải thương hiệu...</p>
        ) : (
          brands.map((brand, index) => (
            <div className='col-md-3 col-6 mb-4' key={index}>
              <img src={brand.image} alt={brand.name} className='img-fluid' />
            </div>
          ))
        )}
      </div> */}
      <hr />
      <h1 className='text-center fs-4 fw-bold m-4'>SẢN PHẨM</h1>
      {/* Danh sách sản phẩm */}
      <div className='row'>
        {products.length === 0 ? (
          <p className='text-center'>Không có sản phẩm nào.</p>
        ) : (
          products.map((product, index) => (
            <div className='col-md-3 col-sm-6 mb-4' key={index}>
              <div className='card border-0 shadow-sm h-100'>
                <a href={`/product/${product._id}`}>
                  <img
                    src={product.image}
                    className='card-img-top'
                    alt={product.name}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                </a>
                <div className='card-body text-center'>
                  <p className='card-text'>{product.name}</p>
                  <h5 className='font-weight-bold'>
                    {product.price.toLocaleString()} VNĐ
                  </h5>
                  <button
                    className='btn btn-dark btn-sm px-3'
                    onClick={e => handleAddToCart(e, product)}
                  >
                    🛒 Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Phân trang */}
      {totalPages > 1 && (
        <div className='text-center mt-4'>
          <button
            className='btn btn-outline-dark btn-sm me-2'
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
          >
            ← Trang trước
          </button>
          <span className='mx-2'>
            Trang {page} / {totalPages}
          </span>
          <button
            className='btn btn-outline-dark btn-sm ms-2'
            disabled={page === totalPages}
            onClick={() => setPage(prev => prev + 1)}
          >
            Trang tiếp →
          </button>
        </div>
      )}
      {/* Nút xem tất cả sản phẩm */}
      <div className='text-center mt-4'>
        <Link to='/products' className='btn btn-dark px-4'>
          🔎 Xem tất cả sản phẩm
        </Link>
      </div>
      {/* Về chúng tôi */}
      <div className='about-content text-center mt-5'>
        <p className='fs-5'>VỀ CHÚNG TÔI</p>
        <p className='about-p-2'>
          Linh Kiện Store chuyên cung cấp thiết bị điện tử - IOT - học tập lập
          trình... Cam kết chất lượng, sản phẩm chính hãng và hỗ trợ kỹ thuật
          tận tình.
        </p>
      </div>
    </div>
  );
}

export default Home;
