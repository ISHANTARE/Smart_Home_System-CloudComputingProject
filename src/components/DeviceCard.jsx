import React from 'react';
import * as Icons from 'lucide-react';
import { Trash2, Star } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';
import { useSmartHome } from '../context/SmartHomeContext';
import { api } from '../utils/api';

function DeviceCard({ device, roomName }) {
  const { toggleDevice, removeDevice, addToast } = useSmartHome();
  const Icon = Icons[device.icon] || Icons.Plug;

  const handleToggle = () => toggleDevice(roomName, device.id);
  const handleDelete = () => removeDevice(roomName, device.id);
  const handleBookmark = async () => {
    try {
      const res = await api.toggleBookmark(device.id);
      addToast(res.bookmarked ? `"${device.name}" bookmarked` : `"${device.name}" removed from bookmarks`, 'info');
    } catch (err) {
      addToast(err.message, 'warning');
    }
  };

  return (
    <div
      className={`
        bg-bg-card-inner rounded-2xl p-4 border transition-all duration-300 group relative
        ${device.isOn
          ? 'border-border-light/60 hover:border-accent-blue/30'
          : 'border-border-line/30 opacity-70 hover:opacity-90'
        }
      `}
    >
      {/* Action buttons (visible on hover) */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleBookmark}
          className="w-7 h-7 rounded-lg bg-bg-card/80 flex items-center justify-center
                     text-text-muted hover:text-accent-amber transition-colors"
          title="Bookmark"
        >
          <Star size={12} />
        </button>
        <button
          onClick={handleDelete}
          className="w-7 h-7 rounded-lg bg-bg-card/80 flex items-center justify-center
                     text-text-muted hover:text-accent-red transition-colors"
          title="Delete device"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Top */}
      <div className="flex items-start justify-between mb-5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center
                     transition-transform duration-200 group-hover:scale-105"
          style={{ backgroundColor: `${device.color}18` }}
        >
          <Icon size={20} style={{ color: device.color }} />
        </div>
        <ToggleSwitch
          isOn={device.isOn}
          onToggle={handleToggle}
          label={`Toggle ${device.name}`}
          size="sm"
        />
      </div>

      {/* Bottom */}
      <div className="flex items-end justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="text-text-white font-semibold text-[13px] truncate">{device.name}</h4>
          <p className="text-text-dark text-[11px] mt-0.5 truncate">
            {device.isOn ? device.status : 'Turned off'}
          </p>
        </div>
        <div className="flex-shrink-0 ml-2 text-right">
          <p className="text-text-white font-semibold text-[13px]">
            {device.isOn ? device.power : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DeviceCard;