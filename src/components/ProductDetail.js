import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p className="text-center mt-5">Đang tải sản phẩm...</p>;

  return (
    <div className="container mt-5">
      <div className="row">
        {/* ẢNH SẢN PHẨM */}
        <div className="col-md-6">
          <img src={product.image} className="img-fluid mb-3" alt={product.name} />
          <div className="d-flex gap-2">
            {product.images?.map((img, idx) => (
              <img key={idx} src={img} width="80" alt={`thumb-${idx}`} className="img-thumbnail" />
            ))}
          </div>
        </div>

        {/* THÔNG TIN */}
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p>Mã sản phẩm: {product.code || 'Đang cập nhật'}</p>
          <h3 className="text-danger">{product.price?.toLocaleString()} VNĐ</h3>
          <p>Trạng thái: {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</p>

          <div className="my-3">
            <label>Số lượng:</label>
            <input type="number" value={1} min={1} className="form-control w-25" />
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-danger">🛒 Đặt hàng</button>
            <button className="btn btn-outline-dark">Thanh toán</button>
          </div>
        </div>
      </div>

      {/* MÔ TẢ / VIDEO / THÔNG SỐ / LIÊN QUAN */}
      <hr className="my-4" />

      {product.video && (
        <div className="product-video text-center mb-4">
          <h4>Video Review</h4>
         <iframe
  width="100%"
  height="400"
  src={product.video}
  title="video-review"
  style={{ border: 'none' }}
  allowFullScreen
></iframe>

        </div>
      )}

      <div className="mt-4">
        <h4>Mô tả sản phẩm</h4>
        <p>{product.description}</p>
      </div>

      {product.specs && (
        <div className="mt-4">
          <h4>Thông số kỹ thuật</h4>
          <table className="table table-bordered">
            <tbody>
              {product.specs.map((item, index) => (
                <tr key={index}>
                  <td>{item.key}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
