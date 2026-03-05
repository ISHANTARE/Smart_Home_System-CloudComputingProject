import React from 'react';

function ToggleSwitch({ isOn, onToggle, label, size = 'md' }) {
  const dims = size === 'sm'
    ? { track: 'w-9 h-[18px]', thumb: 'w-3.5 h-3.5', translate: isOn ? 'translate-x-[18px]' : 'translate-x-[2px]' }
    : { track: 'w-11 h-[22px]', thumb: 'w-[18px] h-[18px]', translate: isOn ? 'translate-x-[22px]' : 'translate-x-[2px]' };

  return (
    <button
      onClick={onToggle}
      className={`
        ${dims.track} rounded-full relative flex-shrink-0
        transition-colors duration-300
        ${isOn ? 'bg-accent-blue' : 'bg-border-light'}
      `}
      role="switch"
      aria-checked={isOn}
      aria-label={label}
    >
      <div
        className={`
          absolute top-1/2 -translate-y-1/2 ${dims.thumb} rounded-full bg-white
          transition-transform duration-300 shadow-sm
          ${dims.translate}
        `}
      />
    </button>
  );
}

export default ToggleSwitch;