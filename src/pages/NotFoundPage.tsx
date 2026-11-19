import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="not-found-page page-message">
      <span className="empty-basket-mark"><SearchX size={29} /></span>
      <h1>Không tìm thấy trang này.</h1>
      <p>Đường dẫn có thể đã đổi. Mình đưa bạn về lại gian hàng nhé.</p>
      <Link className="button button-primary" to="/">
        <ArrowLeft size={17} />
        Về trang chủ
      </Link>
    </section>
  );
}
