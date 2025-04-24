import { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Products () {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchKeyword = params.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

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
      })
      .catch(err => console.error('Lỗi tải sản phẩm:', err));
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  // Reset về trang 1 khi thay đổi filter/search
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, sortOrder, searchKeyword]);

  // Filter + Search + Sort
  const filteredProducts = products
    .filter(product => {
      const matchCategory = selectedCategory
        ? product.category === selectedCategory
        : true;

      const matchSearch = searchKeyword
        ? product.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchKeyword.toLowerCase())
        : true;

      let matchPrice = true;
      if (priceRange === 'low') matchPrice = product.price < 500000;
      else if (priceRange === 'mid')
        matchPrice = product.price >= 500000 && product.price <= 1000000;
      else if (priceRange === 'high') matchPrice = product.price > 1000000;

      return matchCategory && matchSearch && matchPrice;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      if (sortOrder === 'desc') return b.price - a.price;
      return 0;
    });

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className='container mt-5'>
      <h2 className='mb-4 text-center'>🛒 Danh sách sản phẩm</h2>

      {/* Bộ lọc */}
      <div className='row mb-4'>
        <div className='col-md-4 mb-2'>
          <select
            className='form-select'
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value=''>-- Danh mục --</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className='col-md-4 mb-2'>
          <select
            className='form-select'
            value={priceRange}
            onChange={e => setPriceRange(e.target.value)}
          >
            <option value=''>-- Giá --</option>
            <option value='low'>Dưới 500.000 VNĐ</option>
            <option value='mid'>500.000 - 1.000.000 VNĐ</option>
            <option value='high'>Trên 1.000.000 VNĐ</option>
          </select>
        </div>
        <div className='col-md-4 mb-2'>
          <select
            className='form-select'
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option value=''>-- Sắp xếp theo giá --</option>
            <option value='asc'>Thấp → Cao</option>
            <option value='desc'>Cao → Thấp</option>
          </select>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className='row'>
        {currentProducts.length === 0 ? (
          <p className='text-center'>Không có sản phẩm nào.</p>
        ) : (
          currentProducts.map(product => (
            <div className='col-md-3 col-sm-6 mb-4' key={product._id}>
              <div className='card h-100 shadow-sm border-0'>
                <Link
                  to={`/product/${product._id}`}
                  className='text-decoration-none text-dark'
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className='card-img-top'
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                  <div className='card-body text-center'>
                    <h6>{product.name}</h6>
                    <p>{product.price.toLocaleString()} VNĐ</p>
                  </div>
                </Link>
                <div className='text-center pb-3'>
                  <button
                    className='btn btn-dark btn-sm'
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
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            ← Trang trước
          </button>
          <span className='mx-2'>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            className='btn btn-outline-dark btn-sm ms-2'
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Trang tiếp →
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
