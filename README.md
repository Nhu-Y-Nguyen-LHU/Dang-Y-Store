🛒 Dáng Ý Store - Hệ thống Thương mại điện tử E-commerce
Đồ án Giữa kỳ môn Lập trình Front-End

Một nền tảng thương mại điện tử giao diện người dùng (Front-end) tập trung vào hiệu năng tải trang và trải nghiệm mua sắm mượt mà, ứng dụng kiến trúc Server-First của Next.js.

👥 Đội ngũ thực hiện
Sinh viên thực hiện & Chịu trách nhiệm chính: Nguyễn Thị Như Ý

Quá trình phát triển: Đồ án được lập trình độc lập. Tuy nhiên, luồng trải nghiệm người dùng (UX) và logic quản lý trạng thái đã được tối ưu hóa thông qua các vòng tham vấn chuyên môn và đánh giá chéo (Peer-Review) cùng cộng sự ngoại khóa để đảm bảo tính thực tiễn cao nhất.

🎯 Mô tả dự án
Dáng Ý Store là một giải pháp Front-end cho hệ thống bán lẻ trực tuyến, hướng đến tệp khách hàng Gen Z và dân văn phòng. Dự án giải quyết bài toán cân bằng giữa Tối ưu hóa công cụ tìm kiếm (SEO) thông qua Server-Side Rendering (SSR) và Trải nghiệm tương tác thời gian thực (Real-time UX) ở phía Client.

Luồng mua sắm được thiết kế liền mạch theo phễu chuyển đổi: từ khám phá danh mục, lọc sản phẩm động, tùy chọn biến thể phức tạp, đến quản lý giỏ hàng toàn cục (Global Cart) mà không cần tải lại trang.

🚀 Công nghệ sử dụng
Dự án được xây dựng trên hệ sinh thái Front-end hiện đại nhất:

Core Framework: Next.js 16 (App Router) & React 19

Ngôn ngữ: TypeScript (Đảm bảo Type-safety)

Giao diện & Styling:

Tailwind CSS v4 (Utility-first cho bố cục linh hoạt)

Ant Design 6 (Hỗ trợ các UI Components phức tạp: Drawer, Dropdown)

Quản lý trạng thái (State Management): Zustand (Xử lý Global State cho Giỏ hàng cực nhẹ và tránh re-render thừa)

Hiệu ứng (Animation): Framer Motion & Lenis (Smooth scrolling)

Dữ liệu: Tích hợp API Mocking thông qua Next.js Route Handlers (/api/products) kết hợp dữ liệu JSON nội bộ.

⚙️ Các chức năng cốt lõi
Duyệt & Lọc sản phẩm: Lọc đa tiêu chí mà không làm gián đoạn luồng cuộn trang.

Xử lý biến thể động: Tự động tính toán giá và hiển thị tồn kho dựa trên tổ hợp Kích thước - Màu sắc được chọn.

Giỏ hàng động (Dynamic Cart Drawer): Thêm, xóa, sửa số lượng sản phẩm tức thời ở mọi trang nhờ sức mạnh của Zustand.

Responsive 100%: Giao diện hiển thị hoàn hảo trên cả Mobile, Tablet và Desktop.

🛠 Hướng dẫn cài đặt và chạy trên Localhost
Yêu cầu môi trường: Cài đặt sẵn Node.js (>= 20.x) và npm (>= 10.x).

Bước 1: Clone repository về máy

Bash
git clone https://github.com/Nhu-Y-Nguyen-LHU/Dang-Y-Store.git
cd Dang-Y-Store
Bước 2: Cài đặt các thư viện phụ thuộc (Dependencies)

Bash
npm install
Bước 3: Khởi chạy máy chủ phát triển (Development Server)

Bash
npm run dev
Bước 4: Trải nghiệm
Mở trình duyệt và truy cập vào: http://localhost:3000

🎥 Video Demo
(Video trình bày trực tiếp các luồng điều hướng, giải thích kiến trúc thư mục mã nguồn và minh chứng hệ thống chạy thực tế trên Localhost)

Link Thư mục Drive chứa Video: https://drive.google.com/drive/folders/116KlrZRK0XaNkEDqD-qW8jzB3Yvuyvz3?usp=drive_link

Lưu ý cho Kiểm thử viên / Giảng viên:
Do hệ thống hiện đang sử dụng Mock Data, các thao tác tải trang sẽ diễn ra gần như tức thì. Để quan sát rõ các hiệu ứng Loading Skeleton hoặc Error Boundary, vui lòng sử dụng tab Network trong Chrome DevTools và chuyển sang chế độ "Slow 3G".