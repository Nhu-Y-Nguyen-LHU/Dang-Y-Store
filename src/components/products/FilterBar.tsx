'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { formatCurrencyVND } from '@/store/useCartStore';
import styles from './FilterBar.module.scss';

export type SortOption = 'newest' | 'price-asc' | 'price-desc';

export type ProductFilters = {
  query: string;
  collections: string[];
  materials: string[];
  priceMin: number;
  priceMax: number;
  sort: SortOption;
};

type FilterBarProps = {
  products: Product[];
  value: ProductFilters;
  onChange: (next: ProductFilters) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function FilterBar({ products, value, onChange }: FilterBarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const collections = useMemo(() => {
    const set = new Set(products.map((p) => p.collection).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
  }, [products]);

  const filterMaterials = useMemo(() => {
    return ['Vàng', 'Bạc', 'Kim cương'];
  }, []);

  const maxPrice = useMemo(() => {
    return products.reduce((max, p) => Math.max(max, p.price), 0);
  }, [products]);

  const suggestions = useMemo(() => {
    const q = value.query.trim().toLowerCase();
    if (!q) return [];

    return products
      .filter((p) => {
        const haystack = `${p.name} ${p.category} ${p.collection}`.toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 6);
  }, [products, value.query]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSuggestOpen(false);
        setIsFiltersOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const update = (patch: Partial<ProductFilters>) => {
    onChange({ ...value, ...patch });
  };

  const toggleArrayValue = (
    key: 'collections' | 'materials',
    item: string,
  ) => {
    const current = value[key];
    const next = current.includes(item)
      ? current.filter((x) => x !== item)
      : [...current, item];

    update({ [key]: next } as any);
  };

  const priceMin = clamp(value.priceMin, 0, Math.max(0, value.priceMax));
  const priceMax = clamp(value.priceMax, Math.max(0, value.priceMin), maxPrice);

  useEffect(() => {
    if (priceMin !== value.priceMin || priceMax !== value.priceMax) {
      update({ priceMin, priceMax });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceMin, priceMax]);

  const isSuggestionPanelVisible = isSuggestOpen && suggestions.length > 0;
  const isBackdropVisible = isFiltersOpen || isSuggestionPanelVisible;

  return (
    <div className={styles.wrapper}>
      {isBackdropVisible && (
        <button
          type="button"
          className={styles.backdrop}
          onClick={() => {
            setIsSuggestOpen(false);
            setIsFiltersOpen(false);
          }}
          aria-label="Đóng"
        />
      )}

      <div className={styles.topRow}>
        <div className={styles.searchWrap}>
          <input
            ref={inputRef}
            value={value.query}
            onChange={(e) => {
              update({ query: e.target.value });
              setIsSuggestOpen(Boolean(e.target.value.trim()));
            }}
            onFocus={() => setIsSuggestOpen(Boolean(value.query.trim()))}
            placeholder="Tìm kiếm theo tên, bộ sưu tập…"
            className={styles.searchInput}
            aria-label="Tìm kiếm sản phẩm"
            autoComplete="off"
          />

          {isSuggestionPanelVisible && (
            <div className={styles.suggestionPanel} role="listbox">
              <div className={styles.suggestionHeader}>Gợi ý</div>
              <div className={styles.suggestionList}
              >
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className={styles.suggestionItem}
                    onClick={() => setIsSuggestOpen(false)}
                  >
                    <span className={styles.suggestionName}>{p.name}</span>
                    <span className={styles.suggestionPrice}>
                      {formatCurrencyVND(p.price)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <label className={styles.sortWrap}>
            <span className={styles.sortLabel}>Sắp xếp</span>
            <select
              className={styles.sortSelect}
              value={value.sort}
              onChange={(e) => update({ sort: e.target.value as SortOption })}
              aria-label="Sắp xếp"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </label>

          <button
            type="button"
            className={styles.filterButton}
            onClick={() => setIsFiltersOpen(true)}
          >
            Bộ lọc
          </button>
        </div>
      </div>

      <aside
        className={`${styles.sidebar} ${isFiltersOpen ? styles.sidebarOpen : ''}`}
        aria-label="Bộ lọc"
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarTitle}>Bộ lọc</div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setIsFiltersOpen(false)}
            aria-label="Đóng bộ lọc"
          >
            Đóng
          </button>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Bộ sưu tập</div>
          <div className={styles.checkboxGrid}>
            {collections.map((c) => (
              <label key={c} className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={value.collections.includes(c)}
                  onChange={() => toggleArrayValue('collections', c)}
                />
                <span>{c}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Chất liệu</div>
          <div className={styles.checkboxGrid}>
            {filterMaterials.map((m) => (
              <label key={m} className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={value.materials.includes(m)}
                  onChange={() => toggleArrayValue('materials', m)}
                />
                <span>{m}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Khoảng giá</div>
          <div className={styles.rangeMeta}>
            <span>{formatCurrencyVND(priceMin)}</span>
            <span className={styles.rangeDash}>—</span>
            <span>{formatCurrencyVND(priceMax)}</span>
          </div>

          <div className={styles.rangeWrap}>
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={10000}
              value={priceMin}
              onChange={(e) =>
                update({ priceMin: Number(e.target.value) })
              }
              className={styles.range}
              aria-label="Giá tối thiểu"
            />
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={10000}
              value={priceMax}
              onChange={(e) =>
                update({ priceMax: Number(e.target.value) })
              }
              className={styles.range}
              aria-label="Giá tối đa"
            />
          </div>

          <button
            type="button"
            className={styles.resetButton}
            onClick={() =>
              onChange({
                query: '',
                collections: [],
                materials: [],
                priceMin: 0,
                priceMax: maxPrice,
                sort: 'newest',
              })
            }
          >
            Đặt lại
          </button>
        </div>
      </aside>
    </div>
  );
}
