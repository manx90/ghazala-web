'use client';

import { type CSSProperties, type ReactNode, useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  estimateSize?: number;
  gap?: number;
  className?: string;
  overscan?: number;
  scrollToIndex?: number;
  getItemId?: (item: T) => string;
}

export function VirtualList<T>({
  items,
  renderItem,
  estimateSize = 72,
  gap = 8,
  className,
  overscan = 5,
  scrollToIndex,
  getItemId,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize + gap,
    overscan,
    getItemKey: (index) => (getItemId ? getItemId(items[index]) : index),
  });

  useEffect(() => {
    if (scrollToIndex !== undefined && scrollToIndex >= 0) {
      virtualizer.scrollToIndex(scrollToIndex, { align: 'end' });
    }
  }, [scrollToIndex, virtualizer]);

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className={cn('overflow-auto', className)}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index];
          const style: CSSProperties = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${virtualItem.start}px)`,
          };
          return (
            <div key={virtualItem.key} style={style} data-index={virtualItem.index}>
              {renderItem(item, virtualItem.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
