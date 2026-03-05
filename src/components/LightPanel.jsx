import React from 'react';
import LightItem from './LightItem';

function LightPanel({ lights, roomName }) {
  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-border-line/60 h-full flex flex-col">
      <h3 className="text-[17px] font-semibold text-text-white mb-3">Light</h3>
      <div className="space-y-0.5 flex-1">
        {lights.map((light) => (
          <LightItem key={light.id} light={light} roomName={roomName} />
        ))}
      </div>
    </div>
  );
}

export default LightPanel;