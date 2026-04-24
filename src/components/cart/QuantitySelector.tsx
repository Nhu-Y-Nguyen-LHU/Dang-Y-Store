'use client';

import { Minus, Plus } from 'lucide-react';
import styles from './QuantitySelector.module.scss';

interface QuantitySelectorProps {
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: 'default' | 'large' | 'compact';
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 999,
  size = 'default',
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - 1);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + 1);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Only update if it's a valid number
    if (input === '') return;

    const num = parseInt(input, 10);
    if (!isNaN(num)) {
      const clamped = Math.max(min, Math.min(max, num));
      onChange(clamped);
    }
  };

  const handleInputBlur = () => {
    if (!Number.isFinite(value)) {
      onChange(min);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    }
  };

  const sizeClass = size === 'default' ? '' : styles[size];

  return (
    <div className={`${styles.quantitySelector} ${sizeClass}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className={styles.button}
        aria-label="Giảm số lượng"
        title="Giảm"
      >
        <Minus size={size === 'compact' ? 14 : 16} />
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        className={styles.input}
        aria-label="Số lượng"
        min={min}
        max={max}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className={styles.button}
        aria-label="Tăng số lượng"
        title="Tăng"
      >
        <Plus size={size === 'compact' ? 14 : 16} />
      </button>
    </div>
  );
}
