import { useEffect, useState } from "react";
import { LogIn, LogOut, Moon, ShoppingBasket, Sun } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectCartCount } from "../features/cart/cartSlice";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export function Header() {
  const cartCount = useAppSelector(selectCartCount);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutPending, setLogoutPending] = useState(false);

  useEffect(() => {
    if (logoutPending && location.pathname === "/") {
      logout();
      setLogoutPending(false);
    }
  }, [location.pathname, logout, logoutPending]);

  const handleLogout = () => {
    setLogoutPending(true);
    navigate("/", { replace: true });
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="ShopMini — về trang chủ">
          <span className="brand-mark" aria-hidden="true">
            <ShoppingBasket size={23} strokeWidth={2.2} />
          </span>
          <span>shop<span>mini</span></span>
        </Link>

        <nav className="main-nav" aria-label="Điều hướng chính">
          <NavLink to="/" end>Cửa hàng</NavLink>
          <NavLink to="/cart">Giỏ hàng</NavLink>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="icon-button theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng"}
            title={theme === "light" ? "Giao diện tối" : "Giao diện sáng"}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          {user ? (
            <div className="account-actions">
              <span className="user-greeting">Xin chào, {user.username}</span>
              <button
                type="button"
                className="text-button"
                onClick={handleLogout}
                aria-label="Đăng xuất"
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <Link className="text-button login-link" to="/login">
              <LogIn size={17} />
              <span>Đăng nhập</span>
            </Link>
          )}
          <Link className="cart-link" to="/cart" aria-label={`Giỏ hàng, ${cartCount} sản phẩm`}>
            <ShoppingBasket size={19} />
            <span className="cart-link-label">Giỏ</span>
            <span className="cart-count">{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
