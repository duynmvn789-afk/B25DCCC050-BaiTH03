import { Check, PackageCheck, ShoppingBasket } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearCart, selectCartCount, selectCartItems, selectCartTotal } from "../features/cart/cartSlice";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartCount);
  const total = useAppSelector(selectCartTotal);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0) {
      return;
    }
    dispatch(clearCart());
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <section className="order-success page-message" role="status">
        <span className="success-mark"><Check size={30} /></span>
        <h1>Cảm ơn bạn đã ghé chợ!</h1>
        <p>Đơn hàng mô phỏng đã được ghi nhận. Giỏ hàng của bạn đã được làm mới.</p>
        <Link className="button button-primary" to="/">Quay lại gian hàng</Link>
        <span className="simulation-note">Đây là trải nghiệm demo — không có thanh toán thực tế.</span>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="page-message">
        <span className="empty-basket-mark"><ShoppingBasket size={30} /></span>
        <h1>Chưa có gì để đặt</h1>
        <p>Hãy thêm ít nhất một món vào giỏ trước khi thanh toán.</p>
        <Link className="button button-primary" to="/">Xem gian hàng</Link>
      </section>
    );
  }

  return (
    <div className="checkout-page">
      <div className="cart-heading">
        <div>
          <h1>Thông tin nhận hàng</h1>
        </div>
        <div className="checkout-summary-count">
          <PackageCheck size={18} />
          <span>{itemCount} món · {priceFormatter.format(total)}</span>
        </div>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section-heading">
            <div>
              <h2>Người nhận</h2>
              <p>Thông tin chỉ dùng trong phiên demo này.</p>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="recipient">Họ và tên</label>
            <input id="recipient" name="recipient" autoComplete="name" required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="form-field">
            <label htmlFor="address">Địa chỉ nhận hàng</label>
            <textarea id="address" name="address" autoComplete="street-address" rows={3} required />
          </div>
          <button className="button button-primary place-order-button" type="submit">
            <ShoppingBasket size={19} />
            Đặt hàng
          </button>
          <p className="checkout-disclaimer">Đơn hàng mô phỏng, không thu thập hay gửi thông tin của bạn.</p>
        </form>

        <aside className="checkout-order-summary">
          <h2>Trong giỏ của bạn</h2>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <span>{item.title} <small>× {item.quantity}</small></span>
                <strong>{priceFormatter.format(item.price * item.quantity)}</strong>
              </li>
            ))}
          </ul>
          <div className="summary-total">
            <span>Tổng cộng</span>
            <strong>{priceFormatter.format(total)}</strong>
          </div>
          <p className="summary-note">Không xử lý vận chuyển thực tế.</p>
        </aside>
      </div>
    </div>
  );
}
