import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectProductsStatus, fetchProducts } from "../features/products/productsSlice";
import { Header } from "../components/Header";

export function MainLayout() {
  const dispatch = useAppDispatch();
  const productsStatus = useAppSelector(selectProductsStatus);
  const isHomePage = useLocation().pathname === "/";

  useEffect(() => {
    if (productsStatus === "idle") {
      void dispatch(fetchProducts());
    }
  }, [dispatch, productsStatus]);

  return (
    <>
      <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
      <Header />
      <main
        id="main-content"
        className={`page-shell${isHomePage ? " page-shell-home" : ""}`}
      >
        <Outlet />
      </main>
      <footer className="site-footer">
        <Link className="footer-brand" to="/">shopmini</Link>
        <p>Một cửa hàng nhỏ để thực hành một hành trình mua sắm trọn vẹn.</p>
        <span className="footer-note">Đơn hàng mô phỏng · Không xử lý thanh toán</span>
      </footer>
    </>
  );
}
