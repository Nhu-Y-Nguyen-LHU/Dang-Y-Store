import { InputNumber } from 'antd';

interface QuantitySelectorProps {
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: 'small' | 'middle' | 'large';
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 999,
  size = 'middle',
}: QuantitySelectorProps) {
  return (
    <InputNumber
      min={min}
      max={max}
      value={value}
      onChange={(val) => onChange(Number(val) || min)}
      size={size}
    />
  );
}
