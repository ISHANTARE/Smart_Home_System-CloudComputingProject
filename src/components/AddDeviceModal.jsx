import React, { useState, useRef, useEffect } from 'react';
import { X, Plug } from 'lucide-react';

const DEVICE_ICONS = [
    'Monitor', 'Speaker', 'Router', 'Wifi', 'Flame', 'Plug',
    'Fan', 'Wind', 'Tv', 'Cpu', 'Gamepad2', 'Refrigerator',
    'Droplets', 'AlarmClock', 'BatteryCharging', 'Radio',
    'Projector', 'Volume2', 'GlassWater', 'CookingPot',
];

function AddDeviceModal({ isOpen, onClose, onAdd, roomName }) {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('Plug');
    const [power, setPower] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setIcon('Plug');
            setPower('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdd(roomName, {
            name: name.trim(),
            icon,
            power: power ? `${power}Kwh` : '0Kwh',
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-bg-card border border-border-line rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl anim-scale">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-muted hover:text-text-white transition-colors"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                <div className="w-12 h-12 rounded-xl bg-accent-purple/15 flex items-center justify-center mb-4">
                    <Plug size={22} className="text-accent-purple" />
                </div>

                <h2 className="text-lg font-bold text-text-white mb-1">Add Device</h2>
                <p className="text-text-muted text-[13px] mb-5">
                    Add a new device to <span className="text-text-white font-medium">{roomName}</span>.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Device name */}
                    <div>
                        <label className="text-text-gray text-[12px] font-medium mb-1.5 block">Device Name</label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Smart Lamp"
                            className="w-full bg-bg-card-inner border border-border-line rounded-xl
                         py-2.5 px-4 text-[14px] text-text-white placeholder-text-dark
                         focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20
                         transition-all"
                            maxLength={25}
                        />
                    </div>

                    {/* Icon selector */}
                    <div>
                        <label className="text-text-gray text-[12px] font-medium mb-1.5 block">Device Icon</label>
                        <div className="grid grid-cols-5 gap-1.5 max-h-[120px] overflow-y-auto scrollbar-hide">
                            {DEVICE_ICONS.map((ic) => (
                                <button
                                    key={ic}
                                    type="button"
                                    onClick={() => setIcon(ic)}
                                    className={`
                    py-2 rounded-lg text-[11px] font-medium transition-all truncate px-1
                    ${icon === ic
                                            ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/25'
                                            : 'bg-bg-card-inner text-text-muted hover:text-text-gray border border-border-line/40'
                                        }
                  `}
                                >
                                    {ic}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Power rating */}
                    <div>
                        <label className="text-text-gray text-[12px] font-medium mb-1.5 block">Power Rating (Kwh)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={power}
                            onChange={(e) => setPower(e.target.value)}
                            placeholder="e.g. 5"
                            className="w-full bg-bg-card-inner border border-border-line rounded-xl
                         py-2.5 px-4 text-[14px] text-text-white placeholder-text-dark
                         focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20
                         transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold
                         bg-bg-card-inner border border-border-line text-text-gray
                         hover:text-text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold
                         bg-accent-blue text-white shadow-lg shadow-accent-blue/25
                         hover:brightness-110 transition-all
                         disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Add Device
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddDeviceModal;
