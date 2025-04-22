import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

function ProductDetail () {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  const handleAddToCart = (e, product) => {
    const img =
      e.target.closest('.card')?.querySelector('img') ||
      document.querySelector('.img-fluid');
    const imgClone = img.cloneNode(true);
    const cartIcon = document.querySelector('.cart-icon');

    if (!cartIcon || !img) return;

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
      .get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!product) return <p className='text-center mt-5'>Đang tải sản phẩm...</p>;

  return (
    <div className='container mt-5'>
      <div className='row'>
        <div className='col-md-5'>
          <img
            src={product.image}
            className='img-fluid rounded border'
            alt={product.name}
          />
        </div>
        <div className='col-md-7'>
          <h2 className='mb-3'>{product.name}</h2>
          <p>{product.description}</p>
          <h4 className='text-danger'>{product.price.toLocaleString()} VNĐ</h4>
          <p>
            Còn <strong>{product.stock}</strong> sản phẩm
          </p>
          <button
            className='btn btn-dark btn-sm px-3 mt-3'
            onClick={e => handleAddToCart(e, product)}
          >
            🛒 Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
