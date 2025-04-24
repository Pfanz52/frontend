import './Home.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaMicrochip } from 'react-icons/fa';

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
          style={{ maxHeight: '360px', transition: 'all 0.5s ease-in-out' }}
        />
      </a>
    </div>
  );
}

function Home () {
  const [products, setProducts] = useState([]);
  const [slideIndex, setSlideIndex] = useState({});
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

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products?limit=10000')
      .then(res => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];
        setProducts(data);
        // Khởi tạo index trượt mỗi category
        const catIndex = {};
        data.forEach(p => {
          if (!catIndex[p.category]) catIndex[p.category] = 0;
        });
        setSlideIndex(catIndex);
      })
      .catch(err => console.log(err));
  }, []);

  const handleSlide = (cat, direction, total) => {
    setSlideIndex(prev => {
      const current = prev[cat] || 0;
      const max = Math.max(0, total - 4);
      const next =
        direction === 'left'
          ? Math.max(0, current - 1)
          : Math.min(max, current + 1);
      return { ...prev, [cat]: next };
    });
  };

  return (
    <div className='container mt-5'>
      <img src='/images/slider_1.png' alt='Banner' width='100%' />
      <hr className='mt-5' />
      <BannerCarousel />
      <hr />
      <h1 className='text-center fs-4 fw-bold m-4'>SẢN PHẨM THEO DANH MỤC</h1>

      {[...new Set(products.map(p => p.category))].map((cat, i) => {
        const prods = products.filter(p => p.category === cat);
        const start = slideIndex[cat] || 0;
        const canLeft = start > 0;
        const canRight = start + 4 < prods.length;
        if (prods.length === 0) return null;
        return (
          <div key={cat} className='mb-5 position-relative'>
            {/* Tiêu đề danh mục kéo dài đẹp như BLK */}
            <div className='category-section-title mb-3'>
              <span className='cat-index'>{i + 1}</span>
              <FaMicrochip style={{ marginRight: 8, fontSize: 20 }} />
              {cat}
              <Link
                to={`/products?category=${encodeURIComponent(cat)}`}
                className='btn btn-outline-light btn-sm ms-auto'
                style={{ position: 'absolute', right: 12, top: 8, zIndex: 2 }}
              >
                Xem tất cả
              </Link>
            </div>

            {/* Nút trái */}
            {prods.length > 4 && (
              <button
                className='btn btn-dark btn-circle'
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '-16px',
                  transform: 'translateY(-50%)',
                  zIndex: 3,
                  opacity: canLeft ? 1 : 0.3,
                }}
                disabled={!canLeft}
                onClick={() => handleSlide(cat, 'left', prods.length)}
              >
                ‹
              </button>
            )}
            {/* Danh sách sản phẩm */}
            <div className='row'>
              {prods.slice(start, start + 4).map(product => (
                <div className='col-md-3 col-sm-6 mb-4' key={product._id}>
                  <div className='card border-0 shadow-sm h-100'>
                    <Link to={`/product/${product._id}`}>
                      <img
                        src={product.image}
                        className='card-img-top'
                        alt={product.name}
                        style={{ height: 180, objectFit: 'cover' }}
                      />
                    </Link>
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
              ))}
            </div>
            {/* Nút phải */}
            {prods.length > 4 && (
              <button
                className='btn btn-dark btn-circle'
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-16px',
                  transform: 'translateY(-50%)',
                  zIndex: 3,
                  opacity: canRight ? 1 : 0.3,
                }}
                disabled={!canRight}
                onClick={() => handleSlide(cat, 'right', prods.length)}
              >
                ›
              </button>
            )}
          </div>
        );
      })}

      <div className='text-center mt-4'>
        <Link to='/products' className='btn btn-dark px-4'>
          🔎 Xem tất cả sản phẩm
        </Link>
      </div>

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
