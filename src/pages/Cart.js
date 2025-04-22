import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    decreaseQuantity,
  } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2>🛒 Giỏ hàng của bạn đang trống</h2>
        <Link to="/products" className="btn btn-dark mt-4 px-4">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">🛒 Giỏ hàng</h2>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr className="table-dark">
              <th>#</th>
              <th>Sản phẩm</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th>Xoá</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, idx) => (
              <tr key={item._id}>
                <td>{idx + 1}</td>
                <td>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 60, height: 60, objectFit: 'cover' }}
                  />
                </td>
                <td>
                  <Link to={`/product/${item._id}`} className="text-dark">
                    {item.name}
                  </Link>
                </td>
                <td>{item.price.toLocaleString()} VNĐ</td>
                <td>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-dark btn-sm px-2"
                      onClick={() => decreaseQuantity(item._id)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="btn btn-outline-dark btn-sm px-2"
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{(item.price * item.quantity).toLocaleString()} VNĐ</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item._id)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={5} className="text-end fw-bold">
                Tổng cộng
              </td>
              <td className="fw-bold">{total.toLocaleString()} VNĐ</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-outline-danger" onClick={clearCart}>
          🗑 Xoá toàn bộ giỏ hàng
        </button>
        <Link to="/checkout" className="btn btn-success px-4">
          ✅ Tiến hành đặt hàng
        </Link>
      </div>
    </div>
  );
}

export default Cart;
