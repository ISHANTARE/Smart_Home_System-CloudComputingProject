import React, { useState, useRef, useEffect } from 'react';
import { X, Home } from 'lucide-react';

function AddRoomModal({ isOpen, onClose, onAdd, existingRooms }) {
    const [name, setName] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const duplicate = existingRooms.includes(name.trim());

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || duplicate) return;
        onAdd(name.trim());
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-bg-card border border-border-line rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl anim-scale">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-muted hover:text-text-white transition-colors"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-accent-blue/15 flex items-center justify-center mb-4">
                    <Home size={22} className="text-accent-blue" />
                </div>

                <h2 className="text-lg font-bold text-text-white mb-1">Add New Room</h2>
                <p className="text-text-muted text-[13px] mb-5">
                    Enter a name for the new room in your smart home.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Study Room"
                        className="w-full bg-bg-card-inner border border-border-line rounded-xl
                       py-3 px-4 text-[14px] text-text-white placeholder-text-dark
                       focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20
                       transition-all mb-2"
                        maxLength={30}
                    />

                    {duplicate && (
                        <p className="text-accent-red text-[12px] mb-2">A room with this name already exists.</p>
                    )}

                    <div className="flex items-center gap-3 mt-4">
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
                            disabled={!name.trim() || duplicate}
                            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold
                         bg-accent-blue text-white shadow-lg shadow-accent-blue/25
                         hover:brightness-110 transition-all
                         disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Add Room
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddRoomModal;
