import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

/**
 * NextAuth.js Configuration for Dáng Ý Store.
 * Hỗ trợ hai phương thức xác thực:
 * 1. Google OAuth (Production-Ready)
 * 2. Credentials Provider (Mock Account) giúp việc chấm đồ án trực quan, không cần cài đặt client ID phức tạp.
 */
const handler = NextAuth({
  providers: [
    // 1. Google Authentication Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret',
    }),
    
    // 2. Credentials Provider - Phục vụ demo hội đồng chấm đồ án
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'demo@dangy.vn' },
        password: { label: 'Mật khẩu', type: 'password' },
      },
      async authorize(credentials) {
        // Tài khoản demo mặc định để hội đồng dễ dàng thao tác kiểm thử
        if (credentials?.email === 'demo@dangy.vn' && credentials?.password === '123456') {
          return {
            id: '550e8400-e29b-41d4-a716-446655440000', // Định dạng UUID đồng bộ với Supabase
            name: 'Khách Hàng Dáng Ý',
            email: 'demo@dangy.vn',
            role: 'customer',
          };
        }
        
        // Trả về null nếu thông tin đăng nhập không chính xác
        return null;
      },
    }),
  ],
  
  // Callbacks cấu hình JWT và Session để chuyển tiếp thông tin User ID và Role sang Client-side
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'customer';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  
  // Các trang tùy chỉnh
  pages: {
    signIn: '/login', // Định tuyến về trang login tùy chỉnh của Dáng Ý Store
  },
  
  // Secret Key ký Token JWT (Lưu trong .env.local ở môi trường thực tế)
  secret: process.env.NEXTAUTH_SECRET || 'dang-y-store-secret-key-2026',
  
  session: {
    strategy: 'jwt', // Sử dụng JSON Web Tokens để quản lý phiên đăng nhập không trạng thái (Stateless)
  },
});

export { handler as GET, handler as POST };
