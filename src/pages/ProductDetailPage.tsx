import { ArrowLeft, ShoppingBasket, Tag } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { ProductImage } from "../components/ProductImage";
import { addToCart } from "../features/cart/cartSlice";
import { getCategoryLabel } from "../utils/category";
import {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from "../features/products/productsSlice";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function ProductDetailPage() {
  const { id } = useParams();
  const productId = Number(id);
  const product = useAppSelector(selectProducts).find((item) => item.id === productId);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const dispatch = useAppDispatch();

  if (status === "loading" && !product) {
    return <div className="page-message" role="status">Đang tìm sản phẩm…</div>;
  }

  if (status === "failed" && !product) {
    return (
      <div className="page-message page-message-error" role="alert">
        <h1>Chưa tải được sản phẩm</h1>
        <p>{error}</p>
        <button
          type="button"
          className="button button-primary"
          onClick={() => void dispatch(fetchProducts())}
        >
          Thử tải lại
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-message">
        <h1>Không tìm thấy món này</h1>
        <p>Sản phẩm có thể đã rời khỏi gian hàng.</p>
        <Link className="button button-secondary" to="/">Quay lại gian hàng</Link>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={17} />
        Trở lại gian hàng
      </Link>
      <article className="product-detail">
        <div className="detail-image-wrap">
          <span className="detail-image-label"><Tag size={15} /> {getCategoryLabel(product.category)}</span>
          <ProductImage src={product.image} alt={product.title} />
        </div>
        <div className="detail-copy">
          <h1>{product.title}</h1>
          <p className="detail-price">{priceFormatter.format(product.price)}</p>
          <p className="detail-description">{product.description}</p>
          <button
            type="button"
            className="button button-primary detail-add-button"
            onClick={() => dispatch(addToCart(product))}
          >
            <ShoppingBasket size={19} />
            Thêm vào giỏ
          </button>
          <p className="detail-note">Giá hiển thị bằng USD · Đây là cửa hàng mô phỏng.</p>
        </div>
      </article>
    </div>
  );
}
