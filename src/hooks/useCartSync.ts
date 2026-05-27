'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/useCartStore';
import { syncCartAction } from '@/app/actions/cartActions';
import { toast } from 'sonner';

/**
 * Custom Hook: useCartSync (Tái cấu trúc bảo mật sử dụng Server Actions)
 * Quản lý đồng bộ giỏ hàng an toàn phía Server.
 * 
 * TIÊU CHUẨN AN NINH THỰC TẾ (Production Security Standard):
 * 1. Client KHÔNG tự tính giá, KHÔNG tự gửi giá bán (price) lên máy chủ.
 * 2. Client chuyển đổi dữ liệu giỏ hàng Zustand thành mảng Payload tối giản: { productId, variantId, quantity }.
 * 3. Giao tiếp an toàn thông qua Next.js Server Action (`syncCartAction`).
 * 4. Nhận danh sách giỏ hàng sau khi Server đã xác thực danh tính, hợp nhất và định giá lại từ DB.
 * 5. Cập nhật đồng bộ ngược lại Zustand để UI hiển thị mượt mà.
 */
export function useCartSync() {
  const { data: session, status } = useSession();
  const { cart, clearCart } = useCartStore();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Chỉ kích hoạt đồng bộ khi trạng thái session đã xác thực (authenticated) thành công
    if (status !== 'authenticated' || !session?.user) return;
    
    const userId = (session.user as any).id;
    if (!userId) return;

    const syncCart = async () => {
      // Sử dụng cờ hiệu check localStorage để tránh việc gọi đồng bộ lặp đi lặp lại vô tận
      const syncKey = `cart_synced_${userId}`;
      if (localStorage.getItem(syncKey) === 'true') {
        return; // Đã đồng bộ thành công cho session này, bỏ qua
      }

      setIsSyncing(true);
      const toastId = toast.loading('Đang đồng bộ giỏ hàng bảo mật...');

      try {
        // Chuẩn bị payload tối giản gửi lên Server Action (Không có price!)
        const localItems = cart.map((item) => ({
          productId: item.product.id,
          variantId: item.variantId,
          quantity: item.quantity,
        }));

        // Gọi Server Action an toàn (Không lộ API Endpoint, bảo mật cao)
        const result = await syncCartAction(localItems);

        if (!result.success) {
          throw new Error(result.error || 'Đồng bộ thất bại phía Server.');
        }

        const mergedCartList = result.data || [];

        // Xóa giỏ hàng cũ ở local và ghi đè danh sách mới nhất đã được Server phê duyệt giá
        clearCart();
        
        const cartStore = useCartStore.getState();
        for (const item of mergedCartList) {
          cartStore.addItem(item.product, item.quantity, {
            unitPrice: item.unitPrice,
            stockLimit: item.stockLimit,
            variant: item.variantId ? { 
              id: item.variantId, 
              sku: '', 
              price: item.unitPrice, 
              stock: item.stockLimit || 999, 
              name: item.variantName 
            } : null
          });
        }

        // Đánh dấu đã đồng bộ thành công vào LocalStorage cho phiên này
        localStorage.setItem(syncKey, 'true');
        toast.success('Đồng bộ giỏ hàng an toàn thành công!', { id: toastId });
      } catch (error: any) {
        console.error('[Client-side Cart Sync Error]:', error);
        toast.error(`Lỗi đồng bộ giỏ hàng: ${error.message || 'Lỗi hệ thống'}`, { id: toastId });
      } finally {
        setIsSyncing(false);
      }
    };

    syncCart();
  }, [status, session, cart, clearCart]);

  return { isSyncing };
}
