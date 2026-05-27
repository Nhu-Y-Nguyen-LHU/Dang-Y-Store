'use client';

import { useCallback, useMemo } from 'react';
import type { Product, ProductVariant } from '@/types/product';
import { formatCurrencyVND } from '@/store/useCartStore';
import styles from './VariantSelector.module.scss';

interface VariantSelectorProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
}

export default function VariantSelector({
  product,
  selectedVariant,
  onVariantChange,
}: VariantSelectorProps) {
  const variants = useMemo(() => product.variants ?? [], [product.variants]);

  // Group variants by attribute
  const colors = useMemo(() => {
    const uniqueColors = new Set(variants.filter((v) => v.color).map((v) => v.color));
    return Array.from(uniqueColors) as string[];
  }, [variants]);

  const sizes = useMemo(() => {
    const uniqueSizes = new Set(variants.filter((v) => v.size).map((v) => v.size));
    return Array.from(uniqueSizes) as string[];
  }, [variants]);

  const materials = useMemo(() => {
    const uniqueMaterials = new Set(
      variants.filter((v) => v.material).map((v) => v.material),
    );
    return Array.from(uniqueMaterials) as string[];
  }, [variants]);

  // Helper to get variant by criteria
  const getVariantByCriteria = useCallback((criteria: Partial<ProductVariant>) => {
    return variants.find((v) => {
      return (
        (criteria.color === undefined || v.color === criteria.color) &&
        (criteria.size === undefined || v.size === criteria.size) &&
        (criteria.material === undefined || v.material === criteria.material)
      );
    });
  }, [variants]);

  const handleColorChange = (color: string) => {
    const variant = getVariantByCriteria({
      color,
      size: selectedVariant?.size,
      material: selectedVariant?.material,
    });
    if (variant) onVariantChange(variant);
  };

  const handleSizeChange = (size: string) => {
    const variant = getVariantByCriteria({
      color: selectedVariant?.color,
      size,
      material: selectedVariant?.material,
    });
    if (variant) onVariantChange(variant);
  };

  const handleMaterialChange = (material: string) => {
    const variant = getVariantByCriteria({
      color: selectedVariant?.color,
      size: selectedVariant?.size,
      material,
    });
    if (variant) onVariantChange(variant);
  };

  // Get available colors for current selection
  const availableColors = useMemo(() => {
    return colors.filter((color) => {
      const variant = getVariantByCriteria({
        color,
        size: selectedVariant?.size,
        material: selectedVariant?.material,
      });
      return variant && variant.stock > 0;
    });
  }, [colors, selectedVariant, getVariantByCriteria]);

  // Get available sizes for current selection
  const availableSizes = useMemo(() => {
    return sizes.filter((size) => {
      const variant = getVariantByCriteria({
        color: selectedVariant?.color,
        size,
        material: selectedVariant?.material,
      });
      return variant && variant.stock > 0;
    });
  }, [sizes, selectedVariant, getVariantByCriteria]);

  // Get available materials for current selection
  const availableMaterials = useMemo(() => {
    return materials.filter((material) => {
      const variant = getVariantByCriteria({
        color: selectedVariant?.color,
        size: selectedVariant?.size,
        material,
      });
      return variant && variant.stock > 0;
    });
  }, [materials, selectedVariant, getVariantByCriteria]);

  if (variants.length === 0) {
    return <div className={styles.noVariants}>Sản phẩm không có lựa chọn biến thể</div>;
  }

  return (
    <div className={styles.variantSelector}>
      {/* Color Options */}
      {colors.length > 0 && (
        <div className={styles.variantGroup}>
          <div className={styles.variantLabel}>
            Màu sắc
            {selectedVariant?.color && (
              <span className={styles.selectedValue}>{selectedVariant.color}</span>
            )}
          </div>
          <div className={styles.variantOptions}>
            {colors.map((color) => {
              const isSelected = selectedVariant?.color === color;
              const isAvailable = availableColors.includes(color);
              // Ánh xạ bảng màu thương hiệu Dáng Ý Store
              const getColorValue = (colorName: string) => {
                const lower = colorName.toLowerCase();
                if (lower.includes('đỏ') || lower.includes('red') || lower.includes('rượu')) {
                  return '#722F37'; // Màu đỏ rượu vang quý phái của tiêu đề Dáng Ý
                }
                if (lower.includes('vàng') || lower.includes('gold')) return '#D4AF37';
                if (lower.includes('bạc') || lower.includes('silver')) return '#C0C0C0';
                if (lower.includes('đen') || lower.includes('black')) return '#1F2937';
                if (lower.includes('trắng') || lower.includes('white')) return '#F3F4F6';
                if (lower.includes('xanh') || lower.includes('blue')) return '#0369A1';
                
                const colorMap: { [key: string]: string } = {
                  Vàng: '#D4AF37',
                  Bạc: '#C0C0C0',
                  Đen: '#1F2937',
                  Trắng: '#F3F4F6',
                  Xanh: '#0369A1',
                  Đỏ: '#722F37',
                };
                return colorMap[colorName] || colorName;
              };

              // Kiểm tra xem đây có phải là tông màu sáng hay không để đổi màu dấu check
              const isLightColor = (colorName: string) => {
                const lower = colorName.toLowerCase();
                return (
                  lower.includes('trắng') ||
                  lower.includes('white') ||
                  lower.includes('bạc') ||
                  lower.includes('silver') ||
                  lower.includes('vàng') ||
                  lower.includes('gold') ||
                  lower.includes('f3f4f6') ||
                  lower.includes('ffffff')
                );
              };

              return (
                <button
                  key={color}
                  onClick={() => isAvailable && handleColorChange(color)}
                  className={`${styles.colorOption} ${isSelected ? styles.selected : ''} ${
                    !isAvailable ? styles.disabled : ''
                  }`}
                  style={{
                    backgroundColor: getColorValue(color),
                    border: isSelected ? '2px solid #722F37' : '2px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={color}
                  disabled={!isAvailable}
                  aria-label={`Select color ${color}`}
                >
                  {isSelected && (
                    <span
                      style={{
                        color: isLightColor(color) ? '#722F37' : '#ffffff', // Đúng màu rượu đỏ thương hiệu trên nền sáng!
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        textShadow: isLightColor(color) ? 'none' : '0 0 3px rgba(0,0,0,0.5)',
                        lineHeight: 1,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Options */}
      {sizes.length > 0 && (
        <div className={styles.variantGroup}>
          <div className={styles.variantLabel}>
            Kích cỡ
            {selectedVariant?.size && (
              <span className={styles.selectedValue}>{selectedVariant.size}</span>
            )}
          </div>
          <div className={styles.variantOptions}>
            {sizes.map((size) => {
              const isSelected = selectedVariant?.size === size;
              const isAvailable = availableSizes.includes(size);

              return (
                <button
                  key={size}
                  onClick={() => isAvailable && handleSizeChange(size)}
                  className={`${styles.optionButton} ${isSelected ? styles.selected : ''} ${
                    !isAvailable ? styles.outOfStock : ''
                  }`}
                  disabled={!isAvailable}
                  aria-label={`Select size ${size}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Material Options */}
      {materials.length > 0 && (
        <div className={styles.variantGroup}>
          <div className={styles.variantLabel}>
            Chất liệu
            {selectedVariant?.material && (
              <span className={styles.selectedValue}>{selectedVariant.material}</span>
            )}
          </div>
          <div className={styles.variantOptions}>
            {materials.map((material) => {
              const isSelected = selectedVariant?.material === material;
              const isAvailable = availableMaterials.includes(material);

              return (
                <button
                  key={material}
                  onClick={() => isAvailable && handleMaterialChange(material)}
                  className={`${styles.optionButton} ${isSelected ? styles.selected : ''} ${
                    !isAvailable ? styles.outOfStock : ''
                  }`}
                  disabled={!isAvailable}
                  aria-label={`Select material ${material}`}
                >
                  {material}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Variant Info */}
      {selectedVariant && (
        <div className={styles.variantInfo}>
          <div className={styles.infoContent}>
            <div className={styles.variantName}>
              {selectedVariant.name || [selectedVariant.color, selectedVariant.size, selectedVariant.material]
                .filter(Boolean)
                .join(' - ')}
            </div>
            {selectedVariant.sku && <div className={styles.variantSku}>SKU: {selectedVariant.sku}</div>}
          </div>
          <div className={styles.variantPrice}>{formatCurrencyVND(selectedVariant.price)}</div>
          <div
            className={`${styles.stockStatus} ${
              selectedVariant.stock > 10
                ? styles.inStock
                : selectedVariant.stock > 0
                  ? styles.lowStock
                  : styles.outOfStock
            }`}
          >
            {selectedVariant.stock > 0
              ? selectedVariant.stock > 10
                ? 'Còn hàng'
                : `Còn ${selectedVariant.stock} cái`
              : 'Hết hàng'}
          </div>
        </div>
      )}
    </div>
  );
}
