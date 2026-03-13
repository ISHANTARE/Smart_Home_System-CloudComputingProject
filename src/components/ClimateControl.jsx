import React, { useState } from 'react';
import {
  Snowflake, Zap, Fan, Droplets, Moon,
} from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';
import TemperatureGauge from './TemperatureGauge';
import { useSmartHome } from '../context/SmartHomeContext';

const acModes = [
  { icon: Snowflake, label: 'Cool' },
  { icon: Zap, label: 'Energy' },
  { icon: Fan, label: 'Fan' },
  { icon: Droplets, label: 'Dry' },
  { icon: Moon, label: 'Sleep' },
];

const speedLabels = ['Off', 'Low', 'Med', 'High', 'Turbo'];

function ClimateControl({ config, roomName }) {
  const { updateClimate } = useSmartHome();
  const [activeMode, setActiveMode] = useState('Cool');

  const isOn = config.isOn;
  const temperature = config.defaultTemp || 24;
  const speed = config.defaultSpeed || 2;
  const isAC = config.type === 'ac';

  const handleToggle = () => {
    updateClimate(roomName, { isOn: !isOn });
  };

  const handleTempChange = (temp) => {
    updateClimate(roomName, { defaultTemp: temp });
  };

  const handleSpeedChange = (spd) => {
    // If speed is 0 (Off)
    if (spd === 0) {
      updateClimate(roomName, { isOn: false, defaultSpeed: 0 });
      return;
    }
    
    // If turning on to a specific speed from off state
    if (!isOn) {
      updateClimate(roomName, { isOn: true, defaultSpeed: spd });
      return;
    }

    // Changing speed while already on
    updateClimate(roomName, { defaultSpeed: spd });
  };

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-border-line/60 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-text-white">{config.name}</h3>
        <ToggleSwitch
          isOn={isOn}
          onToggle={handleToggle}
          label={`${config.name} power`}
        />
      </div>

      {isAC ? (
        <>
          {/* Temperature Gauge */}
          <div className="flex-1 flex items-center justify-center py-2">
            <TemperatureGauge
              temperature={temperature}
              setTemperature={handleTempChange}
              isOn={isOn}
            />
          </div>

          {/* Mode buttons */}
          <div className="flex items-center gap-2 mt-3">
            {acModes.map((mode) => {
              const Icon = mode.icon;
              const active = activeMode === mode.label;
              return (
                <button
                  key={mode.label}
                  onClick={() => {
                    if (!isOn) {
                      updateClimate(roomName, { isOn: true });
                    }
                    setActiveMode(mode.label);
                  }}
                  className={`
                    flex-1 aspect-square max-w-[44px] rounded-xl flex items-center justify-center
                    transition-all duration-200
                    ${active && isOn
                      ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/30 scale-105'
                      : 'bg-bg-card-inner text-text-muted hover:text-text-white hover:border hover:border-border-line'
                    }
                    ${!isOn ? 'opacity-50' : ''}
                  `}
                  aria-label={`${mode.label} mode`}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Exhaust visual */}
          <div className="flex-1 flex flex-col items-center justify-center py-4">
            <div className={isOn ? 'spin-slow' : ''} style={{ animationDuration: `${2 / Math.max(speed, 0.5)}s` }}>
              <Fan size={72} className={isOn ? 'text-accent-cyan' : 'text-text-dark'} />
            </div>
            <p className="text-4xl font-light text-text-white mt-4">
              Speed {speed}
            </p>
            <p className="text-text-muted text-[13px] mt-1">
              {speedLabels[speed]}
            </p>
          </div>

          {/* Speed buttons */}
          <div className="flex items-center gap-1.5 mt-3">
            {speedLabels.map((label, i) => (
              <button
                key={label}
                onClick={() => handleSpeedChange(i)}
                className={`
                  flex-1 py-2 rounded-xl text-[11px] font-semibold
                  transition-all duration-200
                  ${speed === i && isOn
                    ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/30'
                    : 'bg-bg-card-inner text-text-muted hover:text-text-gray'
                  }
                  ${speed === 0 && !isOn ? 'bg-bg-card-inner text-white border border-border-line' : ''}
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ClimateControl;