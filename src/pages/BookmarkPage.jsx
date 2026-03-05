import React, { useState, useEffect } from 'react';
import { Bookmark, Star, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { api } from '../utils/api';

function BookmarkPage() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookmarks = () => {
        api.getBookmarks()
            .then(setBookmarks)
            .catch(() => setBookmarks([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchBookmarks(); }, []);

    const handleRemove = async (deviceId) => {
        try {
            await api.toggleBookmark(deviceId);
            setBookmarks((prev) => prev.filter((b) => b.id !== deviceId));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={28} className="animate-spin text-accent-blue" />
            </div>
        );
    }

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6">
            <h2 className="text-[22px] font-bold text-text-white mb-2">Bookmarked Devices</h2>
            <p className="text-text-muted text-[13px] mb-6">Your favorite devices across all rooms</p>

            {bookmarks.length === 0 ? (
                <div className="bg-bg-card rounded-2xl p-8 border border-border-line/60 text-center">
                    <Bookmark size={32} className="text-text-muted mx-auto mb-3" />
                    <p className="text-text-muted text-[14px]">No bookmarked devices yet.</p>
                    <p className="text-text-dark text-[12px] mt-1">
                        Click the star icon on any device card to bookmark it.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {bookmarks.map((device) => {
                        const Icon = Icons[device.icon] || Icons.Plug;
                        return (
                            <div
                                key={device.id}
                                className="bg-bg-card-inner rounded-2xl p-4 border border-border-light/60 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${device.color}18` }}
                                    >
                                        <Icon size={20} style={{ color: device.color }} />
                                    </div>
                                    <button
                                        onClick={() => handleRemove(device.id)}
                                        className="text-accent-amber hover:text-accent-red transition-colors"
                                        title="Remove bookmark"
                                    >
                                        <Star size={16} fill="currentColor" />
                                    </button>
                                </div>
                                <h4 className="text-text-white font-semibold text-[13px]">{device.name}</h4>
                                <p className="text-text-dark text-[11px] mt-0.5">{device.roomName}</p>
                                <p className="text-text-muted text-[11px] mt-1">{device.power}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default BookmarkPage;
