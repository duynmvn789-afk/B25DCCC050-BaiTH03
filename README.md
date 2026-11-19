# ShopMini

ShopMini là cửa hàng mini dùng React, TypeScript, Vite, Context API và Redux Toolkit để minh họa luồng xem sản phẩm, quản lý giỏ hàng, đăng nhập giả lập và thanh toán mô phỏng.

## Chạy dự án

```bash
npm install
npm run dev
```

Kiểm tra trước khi build:

```bash
npm run lint
npm run build
```

Sản phẩm được tải từ [Fake Store API](https://fakestoreapi.com/products). Đăng nhập demo chấp nhận mật khẩu `123456`; ứng dụng không thực hiện thanh toán thật.

## Quyết định quản lý state

Chọn nơi lưu state theo phạm vi sử dụng và vòng đời của dữ liệu:

- **`useState`** cho state tạm thời, chỉ có ý nghĩa trong một component.
- **Context API** cho state dùng xuyên nhiều khu vực của ứng dụng nhưng không cần các tính năng quản lý state theo miền như Redux.
- **Redux Toolkit** cho dữ liệu nghiệp vụ dùng chung giữa nhiều trang, đặc biệt là dữ liệu sản phẩm bất đồng bộ và giỏ hàng.

Context không tự quản lý state: `ThemeProvider` và `AuthProvider` dùng `useState` bên trong rồi cung cấp giá trị qua Context. Vì các component ở nhiều nhánh cần truy cập chúng, theme và user được xếp vào nhóm state chia sẻ qua Context, thay vì state cục bộ của một component.

| Nơi lưu | Dữ liệu trong ShopMini | Lý do |
| --- | --- | --- |
| `useState` cục bộ | Trang chủ: từ khóa tìm kiếm và danh mục đang chọn. | Chỉ điều khiển bộ lọc tại trang chủ; không cần chia sẻ giữa các trang. |
| `useState` cục bộ | Đăng nhập: tên đăng nhập, mật khẩu, lỗi biểu mẫu và trạng thái hiện/ẩn mật khẩu. | Dữ liệu nhập và trạng thái trình bày tạm thời; chỉ biểu mẫu đăng nhập cần biết. Tài khoản sau khi đăng nhập được chuyển vào Auth Context. |
| `useState` cục bộ | Thanh toán: trạng thái đơn hàng đã được xác nhận (`orderPlaced`). | Chỉ điều khiển màn hình thành công của trang thanh toán. |
| `useState` cục bộ | Thẻ sản phẩm: phản hồi “Đã thêm”; ảnh sản phẩm: trạng thái tải ảnh thất bại. | Đây là phản hồi giao diện của từng component, không phải dữ liệu giỏ hàng hay sản phẩm dùng chung. |
| `useState` cục bộ | Header: cờ `logoutPending` trong lúc điều hướng trước khi đăng xuất. | Chỉ điều phối một tương tác tạm thời của Header. |
| Context API | `theme` và `toggleTheme` trong `ThemeContext`. | Theme được Header thay đổi và cần áp dụng cho toàn ứng dụng; Context giúp chia sẻ mà không truyền props qua nhiều cấp. |
| Context API | `user`, `login()` và `logout()` trong `AuthContext`. | Thông tin phiên đăng nhập được Header và `ProtectedRoute` cùng sử dụng để hiển thị người dùng và bảo vệ trang checkout. |
| Redux Toolkit | Danh sách sản phẩm, trạng thái tải (`idle`, `loading`, `succeeded`, `failed`) và lỗi trong `productsSlice`. | Sản phẩm được tải bất đồng bộ từ API và dùng ở trang chủ lẫn trang chi tiết; Redux giữ một nguồn dữ liệu chung cho các trang. |
| Redux Toolkit | Các mặt hàng trong `cartSlice` cùng `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`. | Giỏ hàng được đọc hoặc cập nhật từ thẻ sản phẩm, Header, trang giỏ hàng và thanh toán; state cần nhất quán khi chuyển trang. |

### Dữ liệu được tính thay vì lưu riêng

- Danh mục, sản phẩm sau lọc và số liệu trên hero được tính từ danh sách sản phẩm trong Redux cùng bộ lọc cục bộ của trang chủ. Không lưu thêm bản sao của các giá trị này.
- Tổng số lượng và tổng tiền giỏ hàng được tính bằng selector trong `cartSlice`, tránh lưu các con số có thể lệch với danh sách mặt hàng.
- Trường người nhận trong form thanh toán do trình duyệt quản lý; bản demo hiện không lưu, gửi hoặc xử lý các thông tin đó.
- URL do React Router quản lý. Khi cần đăng nhập để vào checkout, đường dẫn cần quay lại được giữ trong `location.state`, không đưa vào Context hay Redux vì đây là dữ liệu điều hướng.

### Các điểm vào state

- `src/contexts/ThemeContext.tsx` và `src/contexts/AuthContext.tsx`: Context và custom hooks `useTheme()` / `useAuth()`.
- `src/app/store.ts` và `src/app/hooks.ts`: cấu hình Redux store cùng hooks có kiểu.
- `src/features/products/productsSlice.ts`: tải và chọn dữ liệu sản phẩm.
- `src/features/cart/cartSlice.ts`: thao tác với giỏ hàng và selector tổng hợp.
- `src/main.tsx`: đặt Redux Provider, các Context Provider và Router quanh ứng dụng.

State của theme, người dùng và giỏ hàng hiện chỉ tồn tại trong phiên chạy ứng dụng; chưa được lưu vào `localStorage` hoặc backend.
