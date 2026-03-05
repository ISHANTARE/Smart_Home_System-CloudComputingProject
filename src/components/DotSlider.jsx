import React, { useRef, useCallback, useState } from 'react';

/**
 * Draggable dot-bar slider for brightness control.
 * Click or drag anywhere along the dots to change brightness.
 * Keyboard accessible with arrow keys.
 */
function DotSlider({ value, onChange, disabled = false, totalDots = 12 }) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const activeDots = Math.round((value / 100) * totalDots);

  const posToValue = useCallback(
    (clientX) => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      return Math.round(Math.max(0, Math.min(100, (x / rect.width) * 100)));
    },
    [value]
  );

  const handleDown = useCallback(
    (e) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
      onChange(posToValue(e.clientX));
      trackRef.current?.setPointerCapture(e.pointerId);
    },
    [disabled, onChange, posToValue]
  );

  const handleMove = useCallback(
    (e) => {
      if (!isDragging || disabled) return;
      onChange(posToValue(e.clientX));
    },
    [isDragging, disabled, onChange, posToValue]
  );

  const handleUp = useCallback(() => setIsDragging(false), []);

  const step = Math.round(100 / totalDots);

  return (
    <div
      ref={trackRef}
      className={`
        flex items-center gap-[4px] py-1.5 no-select
        ${disabled ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerLeave={handleUp}
      role="slider"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Brightness"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          onChange(Math.min(100, value + step));
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          onChange(Math.max(0, value - step));
        }
      }}
    >
      {Array.from({ length: totalDots }, (_, i) => {
        const isActive = i < activeDots;
        const isThumb = i === activeDots - 1 && !disabled && value > 0;
        return (
          <div
            key={i}
            className={`
              rounded-full transition-all duration-150
              ${isActive && !disabled
                ? isThumb
                  ? 'w-2 h-2 bg-dot-active dot-pulse'
                  : 'w-[5px] h-[5px] bg-dot-active'
                : 'w-[5px] h-[5px] bg-dot-inactive'
              }
            `}
          />
        );
      })}
    </div>
  );
}

export default DotSlider;