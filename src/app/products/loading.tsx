import React from 'react';

/**
 * Loading Component: Skeleton Loader cho trang Danh sách sản phẩm.
 * Sử dụng Tailwind CSS để tạo hiệu ứng nhấp nháy (animate-pulse) sang trọng.
 * Đây là linh hồn của mô hình Loading State trong Next.js App Router, tự động kích hoạt
 * khi Server Component đang tải dữ liệu từ API.
 */
export default function ProductsLoading() {
  // Tạo mảng gồm 8 phần tử giả để giả lập grid sản phẩm
  const skeletonCards = Array.from({ length: 8 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* 1. Header Skeleton */}
      <div className="mb-8 space-y-3">
        <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-4 w-96 bg-gray-200 rounded-md animate-pulse" />
      </div>

      {/* 2. Grid Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {skeletonCards.map((_, index) => (
          <div
            key={index}
            className="flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm"
          >
            {/* Giả lập Ảnh sản phẩm */}
            <div className="relative w-full aspect-[4/5] bg-gray-200 animate-pulse flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Giả lập Nội dung thẻ sản phẩm */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                {/* Giả lập Category */}
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                {/* Giả lập Title */}
                <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-4/5 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Giả lập Dòng giá tiền và Nút mua hàng */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-55/10">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
