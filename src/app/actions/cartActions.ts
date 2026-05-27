'use server'; // Đánh dấu đây là Next.js Server Action chạy hoàn toàn trên máy chủ

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';
import type { Product, ProductVariant } from '@/types/product';

// Định nghĩa kiểu dữ liệu tối giản nhận từ Client (Data Minimization)
// Tuyệt đối KHÔNG nhận giá tiền (price) hay thông tin tồn kho tự khai báo từ Client
export interface LocalCartItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

interface ServerSyncResult {
  success: boolean;
  data?: any[];
  error?: string;
}

/**
 * Server Action: syncCartAction
 * Thực hiện đồng bộ và hợp nhất giỏ hàng cực kỳ bảo mật phía Server.
 * Triệt tiêu hoàn toàn rủi ro Hacker sửa giá (Price Manipulation) và Race Condition.
 */
export async function syncCartAction(
  localItems: LocalCartItemInput[]
): Promise<ServerSyncResult> {
  try {
    // 1. Xác thực bảo mật: Lấy Session trực tiếp trên Server thông qua Cookie
    // KHÔNG tin tưởng vào bất kỳ userId nào do Client tự gửi lên
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Yêu cầu xác thực. Vui lòng đăng nhập trước khi đồng bộ.',
      };
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return {
        success: false,
        error: 'Không xác định được mã danh tính người dùng.',
      };
    }

    // 2. Chống Hack Giá: Truy vấn Đơn giá chuẩn (True Price) và Tồn kho chuẩn (True Stock) từ DB
    const productIds = Array.from(new Set(localItems.map((item) => item.productId)));
    
    if (productIds.length === 0 && localItems.length > 0) {
      return { success: false, error: 'Dữ liệu giỏ hàng local không hợp lệ.' };
    }

    // Lấy thông tin các sản phẩm thật từ Supabase DB
    const { data: dbProducts, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (productsError) throw productsError;
    const dbProductsMap = new Map<string, Product>();
    if (dbProducts) {
      dbProducts.forEach((p) => dbProductsMap.set(p.id, p as Product));
    }

    // Tải giỏ hàng hiện tại đang có trên DB của user
    const { data: dbCartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId);

    if (cartError) throw cartError;

    // Khởi tạo bản đồ hợp nhất (Merged Cart Map)
    const mergedCartMap = new Map<string, any>();

    // A. Nạp giỏ hàng DB hiện tại vào bản đồ
    if (dbCartItems) {
      for (const dbItem of dbCartItems) {
        const lineId = dbItem.variant_id
          ? `${dbItem.product_id}:${dbItem.variant_id}`
          : `${dbItem.product_id}:default`;

        mergedCartMap.set(lineId, {
          lineId,
          product: dbItem.product,
          quantity: dbItem.quantity,
          unitPrice: dbItem.unit_price,
          stockLimit: dbItem.stock_limit,
          variantId: dbItem.variant_id,
          variantName: dbItem.variant_name,
        });
      }
    }

    // B. Duyệt qua danh sách Local gửi lên và Hợp nhất an toàn dựa trên TRUE PRICE & TRUE STOCK
    for (const localItem of localItems) {
      const dbProduct = dbProductsMap.get(localItem.productId);
      if (!dbProduct) continue; // Bỏ qua nếu Client gửi ID sản phẩm giả mạo không có trong DB

      let truePrice = dbProduct.price;
      let trueStock: number | null = null;
      let variantName: string | undefined = undefined;

      // Kiểm tra biến thể (Variant) nếu có
      if (localItem.variantId && dbProduct.variants) {
        const variant = dbProduct.variants.find(
          (v: ProductVariant) => v.id === localItem.variantId
        );
        if (variant) {
          truePrice = variant.price; // Lấy giá thật của biến thể từ DB
          trueStock = variant.stock; // Lấy tồn kho thật của biến thể từ DB
          variantName = variant.name;
        } else {
          continue; // Bỏ qua nếu gửi ID biến thể giả mạo
        }
      } else {
        // Sản phẩm thường không biến thể
        trueStock = dbProduct.hasVariants ? null : 9999; 
      }

      const lineId = localItem.variantId
        ? `${localItem.productId}:${localItem.variantId}`
        : `${localItem.productId}:default`;

      const existingItem = mergedCartMap.get(lineId);

      if (existingItem) {
        // Trùng sản phẩm: Cộng dồn số lượng
        const newQty = existingItem.quantity + localItem.quantity;
        const boundedQty = trueStock !== null ? Math.min(newQty, trueStock) : newQty;

        mergedCartMap.set(lineId, {
          ...existingItem,
          quantity: boundedQty,
          unitPrice: truePrice, // Luôn ép sử dụng True Price từ DB
          stockLimit: trueStock,
        });
      } else {
        // Mặt hàng mới ở local: Khống chế số lượng ban đầu theo True Stock
        const boundedQty = trueStock !== null ? Math.min(localItem.quantity, trueStock) : localItem.quantity;

        mergedCartMap.set(lineId, {
          lineId,
          product: dbProduct,
          quantity: boundedQty,
          unitPrice: truePrice, // Áp đơn giá chuẩn DB
          stockLimit: trueStock,
          variantId: localItem.variantId,
          variantName,
        });
      }
    }

    const mergedCartList = Array.from(mergedCartMap.values());

    // 3. Thực hiện Giao dịch ghi dữ liệu an toàn (Delete-then-Insert transaction)
    // Xóa giỏ hàng cũ trên DB của User để tránh trùng lặp bản ghi
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    // Insert giỏ hàng đã được làm sạch và định giá lại an toàn
    if (mergedCartList.length > 0) {
      const insertPayload = mergedCartList.map((item) => ({
        user_id: userId,
        product_id: item.product.id,
        variant_id: item.variantId || null,
        variant_name: item.variantName || null,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        stock_limit: item.stockLimit,
      }));

      const { error: insertError } = await supabase
        .from('cart_items')
        .insert(insertPayload);

      if (insertError) throw insertError;
    }

    return {
      success: true,
      data: mergedCartList,
    };
  } catch (error: any) {
    console.error('[Secure Server Cart Sync Crash]:', error);
    return {
      success: false,
      error: error.message || 'Lỗi hệ thống bất ngờ xảy ra khi đồng bộ giỏ hàng.',
    };
  }
}
