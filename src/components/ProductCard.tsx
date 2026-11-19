import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { addToCart } from "../features/cart/cartSlice";
import type { Product } from "../types";
import { getCategoryLabel } from "../utils/category";
import { ProductImage } from "./ProductImage";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    dispatch(addToCart(product));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="product-card">
      <Link
        className="product-card-image"
        to={`/products/${product.id}`}
        aria-label={`Xem ${product.title}`}
      >
        <span className="product-card-category">{getCategoryLabel(product.category)}</span>
        <ProductImage src={product.image} alt={product.title} />
      </Link>
      <div className="product-card-copy">
        <Link className="product-card-title" to={`/products/${product.id}`}>
          {product.title}
        </Link>
        <div className="product-card-buyline">
          <strong>{priceFormatter.format(product.price)}</strong>
          <button
            type="button"
            className={`add-button${added ? " is-added" : ""}`}
            onClick={handleAdd}
            aria-label={`${added ? "Đã thêm" : "Thêm"} ${product.title} vào giỏ`}
          >
            {added ? <Check size={17} /> : <Plus size={17} />}
            <span aria-live="polite">{added ? "Đã thêm" : "Thêm giỏ"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
