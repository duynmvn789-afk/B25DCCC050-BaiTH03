import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { ProductCard } from "../components/ProductCard";
import {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from "../features/products/productsSlice";
import { getCategoryLabel } from "../utils/category";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function HomePage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  );

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return products.filter((product) => {
      const matchesName = product.title.toLocaleLowerCase().includes(normalizedQuery);
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;
      return matchesName && matchesCategory;
    });
  }, [activeCategory, products, query]);
  const statsReady = status === "succeeded" || products.length > 0;
  const heroStats = [
    { label: "Sản phẩm", value: statsReady ? String(products.length) : "—" },
    { label: "Danh mục", value: statsReady ? String(categories.length) : "—" },
    {
      label: "Giá từ (USD)",
      value:
        statsReady && products.length > 0
          ? priceFormatter.format(Math.min(...products.map((product) => product.price)))
          : "—",
    },
  ];

  return (
    <div className="home-page">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">ShopMini · Cửa hàng nhỏ, món hay</p>
            <h1 id="hero-title">Món hay,<br />tìm ở đây.</h1>
            <p className="hero-description">
              Khám phá những món đồ thiết thực, chọn món hợp ý rồi thêm vào giỏ.
            </p>
            <div className="hero-actions">
              <a className="hero-button hero-button-primary" href="#catalog">
                Khám phá sản phẩm
              </a>
              <Link className="hero-button hero-button-secondary" to="/cart">
                Xem giỏ hàng
              </Link>
            </div>
            <dl className="hero-stats" aria-label="Thông tin gian hàng">
              {heroStats.map((stat) => (
                <div className="hero-stat" key={stat.label}>
                  <dd>{stat.value}</dd>
                  <dt>{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="catalog" className="catalog-section" aria-labelledby="products-heading">
        <div className="catalog-heading">
          <div>
            <h2 id="products-heading">Khám phá sản phẩm</h2>
          </div>
          {status === "succeeded" && (
            <p className="results-count">{visibleProducts.length} sản phẩm</p>
          )}
        </div>

        <div className="shop-tools">
          <label className="search-field">
            <Search size={19} aria-hidden="true" />
            <span className="visually-hidden">Tìm sản phẩm theo tên</span>
            <input
              type="search"
              placeholder="Bạn đang tìm món gì?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="department-label">
            <SlidersHorizontal size={17} aria-hidden="true" />
            <span>Danh mục</span>
          </div>
          <div className="category-list" role="group" aria-label="Lọc theo danh mục">
            <button
              type="button"
              className={`category-chip${activeCategory === "all" ? " is-active" : ""}`}
              aria-pressed={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                type="button"
                className={`category-chip${activeCategory === category ? " is-active" : ""}`}
                aria-pressed={activeCategory === category}
                key={category}
                onClick={() => setActiveCategory(category)}
              >
                {getCategoryLabel(category)}
              </button>
            ))}
          </div>
        </div>

        {status === "loading" && products.length === 0 && (
          <div className="catalog-state" role="status">
            <span className="loader-mark" aria-hidden="true" />
            <p>Đang mở gian hàng…</p>
          </div>
        )}

        {status === "failed" && products.length === 0 && (
          <div className="catalog-state catalog-error" role="alert">
            <h3>Chưa mở được gian hàng</h3>
            <p>{error}</p>
            <button
              className="button button-primary"
              type="button"
              onClick={() => void dispatch(fetchProducts())}
            >
              Thử tải lại
            </button>
          </div>
        )}

        {status === "loading" && products.length > 0 && (
          <p className="inline-status" role="status">Đang cập nhật gian hàng…</p>
        )}

        {status !== "failed" && products.length > 0 && visibleProducts.length > 0 && (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {status === "succeeded" && visibleProducts.length === 0 && (
          <div className="empty-search">
            <h3>Chưa tìm thấy sản phẩm</h3>
            <p>Thử từ khóa khác hoặc chọn một danh mục khác nhé.</p>
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setQuery("");
                setActiveCategory("all");
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
