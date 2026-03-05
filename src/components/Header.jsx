import React, { useState, useRef, useEffect } from 'react';
import { Search, HelpCircle, Bell, ChevronDown, Menu, X, LogOut } from 'lucide-react';

const notifications = [
  { id: 1, text: 'Living Room AC set to 24°C', time: '2 min ago', read: false },
  { id: 2, text: 'Smart TV turned off automatically', time: '15 min ago', read: false },
  { id: 3, text: 'Energy usage peaked at 30kw', time: '1 hour ago', read: true },
  { id: 4, text: 'Kitchen Exhaust filter needs cleaning', time: '3 hours ago', read: true },
];

function Header({ onMenuToggle, searchQuery, onSearchChange, user, onLogout }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const initial = user?.name?.[0]?.toUpperCase() || 'U';
  const avatarColor = user?.avatarColor || '#4F6EF7';

  return (
    <header className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-[72px] border-b border-border-line/40 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-text-gray hover:text-text-white transition-colors"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-[22px] md:text-[26px] font-bold text-text-white">Dashboard</h1>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-sm mx-8">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search devices..."
            className="w-full bg-bg-input border border-border-line rounded-full
                       py-2.5 pl-5 pr-11 text-[13px] text-text-gray placeholder-text-dark
                       focus:outline-none focus:border-accent-blue/40 focus:ring-1 focus:ring-accent-blue/20
                       transition-all duration-200"
            id="search-input"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-white transition-colors"
            >
              <X size={14} />
            </button>
          ) : (
            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dark" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          className="w-9 h-9 rounded-full border border-border-line flex items-center justify-center
                     text-text-muted hover:text-text-white hover:border-accent-blue/40 transition-all"
          aria-label="Help"
        >
          <HelpCircle size={16} />
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotif((v) => !v); setShowProfile(false); }}
            className="w-9 h-9 rounded-full border border-border-line flex items-center justify-center
                       text-text-muted hover:text-text-white hover:border-accent-blue/40 transition-all relative"
            id="notifications-btn"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full ring-2 ring-bg-main" />
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-bg-card border border-border-line rounded-2xl shadow-2xl z-50 anim-scale overflow-hidden">
              <div className="px-4 py-3 border-b border-border-line/40">
                <p className="text-[14px] font-semibold text-text-white">Notifications</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-border-line/20 hover:bg-bg-card-inner/40 transition-colors
                      ${!n.read ? 'bg-accent-blue/5' : ''}`}
                  >
                    <p className={`text-[12px] ${!n.read ? 'text-text-white font-medium' : 'text-text-gray'}`}>
                      {n.text}
                    </p>
                    <p className="text-[11px] text-text-dark mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile((v) => !v); setShowNotif(false); }}
            className="flex items-center gap-2 ml-2 group"
            id="profile-btn"
          >
            <div
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-border-light group-hover:border-accent-blue/40 transition-all flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${avatarColor}, #22D3EE)` }}
            >
              <span className="text-white text-[14px] font-bold">{initial}</span>
            </div>
            <span className="hidden md:block text-[13px] font-semibold text-text-white group-hover:text-accent-blue transition-colors">
              {user?.name || 'User'}
            </span>
            <ChevronDown size={14} className={`hidden md:block text-text-muted transition-transform ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-56 bg-bg-card border border-border-line rounded-2xl shadow-2xl z-50 anim-scale overflow-hidden">
              <div className="px-4 py-3 border-b border-border-line/40">
                <p className="text-[13px] font-semibold text-text-white">{user?.name}</p>
                <p className="text-[11px] text-text-muted">{user?.email}</p>
              </div>
              <button
                className="w-full text-left px-4 py-2.5 text-[12px] text-text-gray hover:bg-bg-card-inner/40 hover:text-text-white transition-colors"
              >
                My Profile
              </button>
              <button
                className="w-full text-left px-4 py-2.5 text-[12px] text-text-gray hover:bg-bg-card-inner/40 hover:text-text-white transition-colors"
              >
                Preferences
              </button>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2.5 text-[12px] text-accent-red hover:bg-accent-red/10
                           border-t border-border-line/40 flex items-center gap-2 transition-colors"
              >
                <LogOut size={12} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;