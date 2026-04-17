'use client';

import { cn } from '@/lib/utils';

type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-zinc-200/60',
        'before:absolute before:inset-0',
        'before:-translate-x-full before:animate-[shimmer_1.2s_infinite]',
        'before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent',
        className,
      )}
    />
  );
}
