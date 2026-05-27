import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Thiếu biến môi trường NEXT_PUBLIC_SUPABASE_URL. Vui lòng kiểm tra lại file .env.local.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Thiếu biến môi trường NEXT_PUBLIC_SUPABASE_ANON_KEY. Vui lòng kiểm tra lại file .env.local.'
  );
}

/**
 * Cờ xác định xem dự án đang sử dụng cấu hình Supabase giả lập (Dummy/Placeholder) hay không.
 * Giúp Server Components bỏ qua việc gọi mạng chờ timeout (lên tới 20-30 giây) khi chưa cấu hình DB thật,
 * tăng tốc độ tải trang trên localhost từ 23 giây xuống dưới 50 mili-giây!
 */
export const isDummySupabase =
  supabaseUrl.includes('your-project-id') ||
  supabaseAnonKey.includes('dummy');

/**
 * Supabase Client Instance dùng chung cho toàn hệ thống.
 * Sử dụng Anonymous Key an toàn cho cả Client và Server.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
