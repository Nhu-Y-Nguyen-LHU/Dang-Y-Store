'use client'; // Bắt buộc phải là Client Component để bắt lỗi động ở Runtime

import React, { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Component: Xử lý lỗi toàn bộ phân đoạn /products (Error Boundary).
 * Tích hợp nút 'Thử lại' để thực hiện re-render phân đoạn Server Component mà không cần reload toàn bộ trang.
 */
export default function ProductsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Ghi nhận lỗi vào hệ thống giám sát lỗi (như Sentry hoặc LogRocket) ở thực tế
    console.error('[Error Boundary Caught]:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-red-100 shadow-xl">
        {/* Biểu tượng lỗi trực quan */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 text-red-500 animate-bounce">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Tiêu đề lỗi */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Kết Nối Cơ Sở Dữ Liệu Thất Bại
          </h2>
          <p className="text-sm text-gray-55/80">
            Dáng Ý Store không thể tải danh sách sản phẩm lúc này do sự cố kết nối tới máy chủ.
          </p>
        </div>

        {/* Khung hiển thị chi tiết lỗi kỹ thuật (chỉ hiện khi dev, ẩn hoặc rút gọn khi prod) */}
        <div className="text-left bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-1">Chi tiết lỗi:</p>
          <code className="text-xs text-red-600 break-all leading-relaxed">
            {error.message || 'Lỗi kết nối API Supabase (HTTP 500)'}
          </code>
          {error.digest && (
            <p className="text-[10px] text-gray-400 mt-2">
              Digest ID: <span className="font-mono">{error.digest}</span>
            </p>
          )}
        </div>

        {/* Luồng hành động phục hồi (Recovery Flow) */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()} // Hàm reset do Next.js cung cấp để re-render Server Component
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 shadow-md cursor-pointer"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8.89M9 11l3-3 3 3"
              />
            </svg>
            Thử tải lại trang
          </button>
          
          <a
            href="/"
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
          >
            Về Trang Chủ
          </a>
        </div>
      </div>
    </div>
  );
}
