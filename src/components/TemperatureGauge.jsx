import React, { useRef, useCallback, useState } from 'react';

/**
 * Circular arc gauge for temperature control.
 * Mimics the screenshot's circular dial with gradient arc.
 */
function TemperatureGauge({ temperature, setTemperature, isOn, min = 16, max = 32 }) {
  const svgRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 80;
  const strokeWidth = 8;

  // Arc spans from 135° to 405° (270° sweep)
  const startAngle = 135;
  const sweepAngle = 270;
  const endAngle = startAngle + sweepAngle;

  const tempRange = max - min;
  const fraction = (temperature - min) / tempRange;
  const activeAngle = startAngle + fraction * sweepAngle;

  // Convert angle to SVG coordinates
  const polarToCartesian = (angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  // Build arc path
  const describeArc = (startA, endA) => {
    const start = polarToCartesian(endA);
    const end = polarToCartesian(startA);
    const sweep = endA - startA <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${sweep} 0 ${end.x} ${end.y}`;
  };

  const bgArc = describeArc(startAngle, endAngle);
  const activeArc = describeArc(startAngle, activeAngle);
  const thumbPos = polarToCartesian(activeAngle);

  // Tick marks
  const ticks = [];
  const tickCount = 16;
  for (let i = 0; i <= tickCount; i++) {
    const angle = startAngle + (i / tickCount) * sweepAngle;
    const innerR = radius - 14;
    const outerR = radius - 8;
    const rad = ((angle - 90) * Math.PI) / 180;
    ticks.push({
      x1: cx + innerR * Math.cos(rad),
      y1: cy + innerR * Math.sin(rad),
      x2: cx + outerR * Math.cos(rad),
      y2: cy + outerR * Math.sin(rad),
      active: (angle - startAngle) / sweepAngle <= fraction,
    });
  }

  // Drag handler
  const handlePointerEvent = useCallback(
    (e) => {
      if (!isOn || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - cx * (rect.width / size);
      const y = e.clientY - rect.top - cy * (rect.height / size);
      let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
      if (angle < 0) angle += 360;

      // Clamp to arc range
      if (angle < startAngle && angle > startAngle - 45) angle = startAngle;
      if (angle > endAngle - 360 && angle < endAngle - 360 + 45) angle = endAngle;

      // Normalize
      if (angle < startAngle) angle += 360;
      if (angle > endAngle) return;

      const frac = (angle - startAngle) / sweepAngle;
      const newTemp = Math.round(min + frac * tempRange);
      setTemperature(Math.max(min, Math.min(max, newTemp)));
    },
    [isOn, min, max, tempRange, setTemperature]
  );

  return (
    <div className="flex items-center justify-center no-select">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="cursor-pointer"
        onPointerDown={(e) => {
          if (!isOn) return;
          setIsDragging(true);
          svgRef.current?.setPointerCapture(e.pointerId);
          handlePointerEvent(e);
        }}
        onPointerMove={(e) => isDragging && handlePointerEvent(e)}
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => setIsDragging(false)}
      >
        {/* Background arc */}
        <path
          d={bgArc}
          fill="none"
          stroke="#1E2235"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Active arc with gradient */}
        {isOn && fraction > 0 && (
          <>
            <defs>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4F6EF7" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
            <path
              d={activeArc}
              fill="none"
              stroke="url(#arcGrad)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="temp-arc"
              style={{ filter: 'drop-shadow(0 0 6px rgba(79,110,247,0.4))' }}
            />
          </>
        )}

        {/* Tick marks */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={isOn && t.active ? '#4F6EF7' : '#262A3D'}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        ))}

        {/* Thumb */}
        {isOn && (
          <circle
            cx={thumbPos.x}
            cy={thumbPos.y}
            r={10}
            fill="#22D3EE"
            stroke="#0B0D15"
            strokeWidth={3}
            style={{ filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.5))' }}
            className="cursor-grab active:cursor-grabbing"
          />
        )}

        {/* Center text */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          className="text-[42px] font-light"
          fill={isOn ? '#FFFFFF' : '#475569'}
        >
          {temperature}°C
        </text>
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          className="text-[12px]"
          fill="#64748B"
        >
          Temperature
        </text>
      </svg>
    </div>
  );
}

export default TemperatureGauge;