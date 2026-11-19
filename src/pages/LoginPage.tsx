import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  PackageCheck,
  Search,
  ShoppingBasket,
  Store,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface LoginNavigationState {
  from?: {
    pathname?: string;
  };
}

export function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const routeState = location.state as LoginNavigationState | null;
  const returnTo = routeState?.from?.pathname;
  const destination =
    returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";
  const isReturningToCheckout = destination === "/checkout";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!login(username, password)) {
      setError("Thông tin chưa đúng. Thử lại với mật khẩu demo 123456 nhé.");
      return;
    }
    navigate(destination, { replace: true });
  };

  return (
    <div className="auth-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={17} />
        Về gian hàng
      </Link>
      <div className="auth-layout">
        <section className="auth-panel" aria-labelledby="login-title">
          <div className="auth-panel-heading">
            <div className="auth-mark" aria-hidden="true"><Store size={23} /></div>
            <h1 id="login-title">Chào mừng<br />bạn quay lại.</h1>
            <p className="auth-intro">
              {isReturningToCheckout
                ? "Đăng nhập để tiếp tục đến bước thanh toán."
                : "Đăng nhập để tiếp tục hành trình mua sắm mô phỏng."}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="username">Tên đăng nhập</label>
              <div className="auth-input-wrap">
                <Store size={18} aria-hidden="true" />
                <input
                  autoComplete="username"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setError("");
                  }}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Mật khẩu</label>
              <div className="auth-input-wrap auth-password-wrap">
                <KeyRound size={18} aria-hidden="true" />
                <input
                  autoComplete="current-password"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="Nhập mật khẩu"
                  aria-describedby="password-hint"
                  required
                />
                <button
                  className="auth-password-toggle"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  aria-pressed={showPassword}
                >
                  {showPassword
                    ? <EyeOff size={19} aria-hidden="true" />
                    : <Eye size={19} aria-hidden="true" />}
                </button>
              </div>
            </div>

            <p className="demo-hint" id="password-hint">
              <KeyRound size={15} aria-hidden="true" />
              <span>Mật khẩu demo <strong>123456</strong></span>
            </p>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-primary auth-submit" type="submit">
              <span>Đăng nhập</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <p className="auth-footnote">Nhập tên bất kỳ · Chỉ dùng để trải nghiệm demo</p>
          </form>
        </section>

        <aside className="auth-story" aria-labelledby="auth-story-title">
          <div className="auth-story-brand" aria-hidden="true">
            <span className="auth-story-mark"><ShoppingBasket size={19} /></span>
            <span>shop<span>mini</span></span>
          </div>
          <div className="auth-story-copy">
            <h2 id="auth-story-title">Từ khám phá<br />đến đặt hàng.</h2>
            <p>Dạo qua các sản phẩm, chọn món bạn thích rồi hoàn tất đơn hàng mô phỏng.</p>
          </div>
          <div className="auth-journey" aria-label="Ba bước mua sắm mô phỏng">
            <div className="auth-receipt-heading">
              <span>Hành trình mua sắm</span>
              <span className="auth-receipt-stamp" aria-hidden="true">
                <Store size={17} />
              </span>
            </div>
            <div className="auth-step">
              <span className="auth-step-icon"><Search size={17} aria-hidden="true" /></span>
              <span>Khám phá sản phẩm</span>
              <span className="auth-step-check" aria-hidden="true">01</span>
            </div>
            <div className="auth-step">
              <span className="auth-step-icon"><ShoppingBasket size={17} aria-hidden="true" /></span>
              <span>Chọn món bạn thích</span>
              <span className="auth-step-check" aria-hidden="true">02</span>
            </div>
            <div className="auth-step">
              <span className="auth-step-icon"><PackageCheck size={17} aria-hidden="true" /></span>
              <span>Đặt hàng mô phỏng</span>
              <span className="auth-step-check" aria-hidden="true">03</span>
            </div>
          </div>
          <p className="auth-story-note">Trải nghiệm mô phỏng · Không xử lý thanh toán</p>
        </aside>
      </div>
    </div>
  );
}
