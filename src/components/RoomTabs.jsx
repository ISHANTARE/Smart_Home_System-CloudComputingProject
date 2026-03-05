import React from 'react';
import { Plus, X as XIcon } from 'lucide-react';

function RoomTabs({ rooms, activeRoom, onRoomChange, onAddRoom, onAddDevice, onDeleteRoom }) {
  return (
    <div className="flex items-center justify-between mt-5 gap-3">
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
        {rooms.map((room) => (
          <div key={room} className="relative group flex-shrink-0">
            <button
              onClick={() => onRoomChange(room)}
              className={`
                px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap
                transition-all duration-250 pr-${activeRoom === room && rooms.length > 1 ? '7' : '4'}
                ${activeRoom === room
                  ? 'bg-tab-red text-white shadow-lg shadow-tab-red/30'
                  : 'text-text-muted hover:text-text-gray hover:bg-bg-card-inner/50'
                }
              `}
            >
              {room}
            </button>
            {/* Delete button on active tab (only if more than 1 room) */}
            {activeRoom === room && rooms.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteRoom(room); }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full
                           bg-white/20 hover:bg-white/40 flex items-center justify-center
                           transition-all text-white/80 hover:text-white"
                title={`Delete ${room}`}
              >
                <XIcon size={10} />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={onAddRoom}
          className="flex items-center gap-1 px-3 py-2 text-[13px] font-medium
                     text-text-muted hover:text-accent-blue transition-colors whitespace-nowrap flex-shrink-0"
          id="add-room-btn"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      <button
        onClick={onAddDevice}
        className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold
                   bg-bg-card-inner border border-border-light text-text-gray
                   hover:text-text-white hover:border-accent-blue/30
                   transition-all duration-200 whitespace-nowrap flex-shrink-0"
        id="add-device-btn"
      >
        <Plus size={14} />
        Add Device
      </button>
    </div>
  );
}

export default RoomTabs;