import React from 'react';
import DeviceCard from './DeviceCard';

function MyDevices({ devices, roomName }) {
  return (
    <div>
      <h3 className="text-[17px] font-semibold text-text-white mb-4">My Devices</h3>
      {devices.length === 0 ? (
        <div className="bg-bg-card rounded-2xl p-8 border border-border-line/60 text-center">
          <p className="text-text-muted text-[14px]">No devices found. Click "+ Add Device" to add one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {devices.map((device, i) => (
            <div key={device.id} className="anim-scale" style={{ animationDelay: `${i * 0.05}s` }}>
              <DeviceCard device={device} roomName={roomName} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyDevices;