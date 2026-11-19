import { ArrowLeft, Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  removeFromCart,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from "../features/cart/cartSlice";
import { ProductImage } from "../components/ProductImage";
import { getCategoryLabel } from "../utils/category";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartCount);
  const total = useAppSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <section className="cart-empty page-message">
        <span className="empty-basket-mark"><ShoppingBasket size={30} /></span>
        <h1>Giỏ hàng đang trống</h1>
        <p>Đi dạo một vòng rồi chọn món bạn thích nhé.</p>
        <Link className="button button-primary" to="/">Khám phá gian hàng</Link>
      </section>
    );
  }

  return (
    <div className="cart-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={17} />
        Tiếp tục xem hàng
      </Link>
      <div className="cart-heading">
        <div>
          <h1>Giỏ hàng của bạn</h1>
        </div>
        <span className="cart-item-total">{itemCount} món</span>
      </div>

      <div className="cart-layout">
        <section className="cart-items" aria-label="Sản phẩm trong giỏ">
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <Link className="cart-item-image" to={`/products/${item.id}`}>
                <ProductImage src={item.image} alt={item.title} />
              </Link>
              <div className="cart-item-copy">
                <span className="cart-item-category">{getCategoryLabel(item.category)}</span>
                <Link to={`/products/${item.id}`} className="cart-item-title">
                  {item.title}
                </Link>
                <strong className="cart-item-price">{priceFormatter.format(item.price)}</strong>
              </div>
              <div className="quantity-control" aria-label={`Số lượng ${item.title}`}>
                <button
                  type="button"
                  aria-label={`Giảm số lượng ${item.title}`}
                  onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                >
                  <Minus size={15} />
                </button>
                <span aria-live="polite">{item.quantity}</span>
                <button
                  type="button"
                  aria-label={`Tăng số lượng ${item.title}`}
                  onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                >
                  <Plus size={15} />
                </button>
              </div>
              <strong className="cart-line-total">
                {priceFormatter.format(item.price * item.quantity)}
              </strong>
              <button
                type="button"
                className="remove-item"
                aria-label={`Xóa ${item.title} khỏi giỏ`}
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                <Trash2 size={17} />
              </button>
            </article>
          ))}
        </section>

        <aside className="order-summary">
          <h2>Tóm tắt đơn hàng</h2>
          <div className="summary-row">
            <span>Tạm tính · {itemCount} món</span>
            <strong>{priceFormatter.format(total)}</strong>
          </div>
          <div className="summary-row summary-shipping">
            <span>Vận chuyển</span>
            <span>Không áp dụng</span>
          </div>
          <div className="summary-total">
            <span>Tổng cộng</span>
            <strong>{priceFormatter.format(total)}</strong>
          </div>
          <p className="summary-note">Đơn hàng mô phỏng, chưa xử lý thanh toán.</p>
          <Link className="button button-primary checkout-button" to="/checkout">
            Tiến hành đặt hàng
          </Link>
        </aside>
      </div>
    </div>
  );
}
