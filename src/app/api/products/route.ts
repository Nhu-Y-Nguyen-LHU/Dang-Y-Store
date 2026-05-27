import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Định nghĩa kiểu dữ liệu phản hồi tiêu chuẩn của API (Standard API Response Wrapper)
// Giúp phía Client dễ dàng bắt lỗi và hiển thị UI Loading/Error tương ứng.
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    count: number;
    limit: number;
    offset: number;
  };
}

/**
 * API Route Handler: Lấy danh sách sản phẩm từ cơ sở dữ liệu Supabase.
 * Hỗ trợ các chức năng nâng cấp cho đồ án:
 * 1. Filter theo category (truy vấn qua query string: ?category=...)
 * 2. Tìm kiếm sản phẩm theo slug (truy vấn qua query string: ?slug=...)
 * 3. Phân trang cơ bản (limit, offset) giúp tối ưu hiệu năng Lighthouse.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    
    // Đọc tham số phân trang, thiết lập mặc định để tránh quá tải DB (Anti-pattern: Fetch All)
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Khởi tạo truy vấn từ table 'products' trong Supabase
    // Chúng ta select '*' và yêu cầu Supabase trả về tổng số lượng bản ghi khớp (count: 'exact')
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    // Áp dụng bộ lọc động nếu có tham số truyền vào từ client
    if (category) {
      // Ví dụ: ?category=ao-dai -> Lọc các sản phẩm thuộc danh mục áo dài
      query = query.eq('category', category);
    }

    if (slug) {
      // Lấy chi tiết 1 sản phẩm qua slug (Đảm bảo tính độc nhất)
      query = query.eq('slug', slug);
    }

    // Thiết lập phân trang (Supabase sử dụng index 0-based cho range)
    const from = offset;
    const to = offset + limit - 1;
    query = query.range(from, to);

    // Sắp xếp sản phẩm mới nhất lên đầu mặc định
    query = query.order('created_at', { ascending: false });

    // Thực hiện gọi sang Supabase qua giao thức REST (PostgREST) bất đồng bộ
    const { data, error, count } = await query;

    // Kiểm tra lỗi phản hồi từ hệ thống Supabase
    if (error) {
      console.error('[Supabase Error] Lỗi khi truy vấn sản phẩm:', error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: error.code,
            message: 'Không thể tải danh sách sản phẩm từ cơ sở dữ liệu.',
            details: error.message,
          },
        },
        { status: 500 }
      );
    }

    // Trả về kết quả thành công với định dạng chuẩn mực
    return NextResponse.json<ApiResponse<any[]>>(
      {
        success: true,
        data: data || [],
        pagination: {
          count: count || 0,
          limit,
          offset,
        },
      },
      {
        status: 200,
        headers: {
          // Cấu hình cache-control để tối ưu hóa hiệu năng LCP và điểm Lighthouse
          // S-maxage=60: Cho phép CDN cache trong 60 giây
          // Stale-while-revalidate=30: Trả về cache cũ trong lúc âm thầm tải mới ở background
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error: any) {
    // Bẫy lỗi ngoại lệ hệ thống không mong muốn (Crash, Mất mạng, Lỗi cú pháp)
    console.error('[API Products Crash]:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Hệ thống đã xảy ra sự cố ngoài ý muốn. Vui lòng liên hệ quản trị viên.',
          details: error.message || String(error),
        },
      },
      { status: 500 }
    );
  }
}
