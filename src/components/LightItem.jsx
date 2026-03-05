import React, { useState, useCallback } from 'react';
import { Sun, SunDim } from 'lucide-react';
import DotSlider from './DotSlider';
import { useSmartHome } from '../context/SmartHomeContext';

function LightItem({ light, roomName }) {
  const { updateLight } = useSmartHome();
  const [savedBrightness, setSavedBrightness] = useState(light.brightness);

  const handleToggle = useCallback(() => {
    if (light.isOn) {
      setSavedBrightness(light.brightness);
      updateLight(roomName, light.id, { isOn: false, brightness: 0 });
    } else {
      const restored = savedBrightness > 0 ? savedBrightness : 50;
      updateLight(roomName, light.id, { isOn: true, brightness: restored });
    }
  }, [light.isOn, light.brightness, light.id, roomName, savedBrightness, updateLight]);

  const handleBrightnessChange = useCallback(
    (val) => {
      const updates = { brightness: val };
      if (val > 0 && !light.isOn) updates.isOn = true;
      if (val === 0 && light.isOn) updates.isOn = false;
      updateLight(roomName, light.id, updates);
    },
    [light.isOn, light.id, roomName, updateLight]
  );

  const displayVal = light.isOn ? light.brightness : 0;
  const glowIntensity = light.isOn ? Math.max(0.15, light.brightness / 100) : 0;

  return (
    <div className="flex items-center gap-3 py-2 px-1.5 rounded-xl hover:bg-bg-hover/40 transition-colors duration-200">
      {/* Toggle icon */}
      <button
        onClick={handleToggle}
        className={`
          w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
          transition-all duration-300 relative border
          ${light.isOn
            ? 'bg-dot-active/10 border-dot-active/30 text-dot-active'
            : 'bg-bg-card-inner border-border-line/40 text-text-dark hover:text-text-muted'
          }
        `}
        style={light.isOn ? {
          boxShadow: `0 0 ${10 * glowIntensity}px rgba(34,211,238,${glowIntensity * 0.5})`
        } : {}}
        aria-label={`Toggle ${light.name} ${light.isOn ? 'off' : 'on'}`}
        title={light.isOn ? `Turn off ${light.name}` : `Turn on ${light.name}`}
      >
        {light.isOn ? <Sun size={16} /> : <SunDim size={16} />}
      </button>

      {/* Name + dot slider */}
      <div className="flex-1 min-w-0">
        <p className={`text-[12px] font-medium truncate ${light.isOn ? 'text-text-white' : 'text-text-muted'}`}>
          {light.name}
        </p>
        <DotSlider value={displayVal} onChange={handleBrightnessChange} />
      </div>

      {/* Percentage */}
      <span className={`
        text-[13px] font-semibold w-9 text-right tabular-nums flex-shrink-0
        ${light.isOn ? 'text-text-white' : 'text-text-dark'}
      `}>
        {displayVal}%
      </span>
    </div>
  );
}

export default LightItem;