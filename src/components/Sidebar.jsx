import React from 'react';
import {
  LayoutDashboard, Clock, Bookmark, Download,
  HelpCircle, Settings, X, Home, LogOut,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Clock, label: 'Recent' },
  { icon: Bookmark, label: 'Bookmark' },
  { icon: Download, label: 'Downloaded' },
  { icon: HelpCircle, label: 'Support' },
  { icon: Settings, label: 'Settings' },
];

function Sidebar({ isOpen, onClose, activePage, onNavigate, user, onLogout }) {
  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-[240px] bg-bg-sidebar
        border-r border-border-line/60
        flex flex-col z-50 transition-transform duration-300
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-6 h-[72px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
            <Home size={20} className="text-white" />
          </div>
          <span className="text-text-white font-bold text-xl tracking-tight">SmartH</span>
        </div>
        <button
          className="lg:hidden text-text-gray hover:text-text-white transition-colors"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 mt-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.label;
            return (
              <li key={item.label}>
                <button
                  onClick={() => onNavigate(item.label)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium
                    transition-all duration-200 text-left
                    ${isActive
                      ? 'bg-bg-card-inner text-text-white'
                      : 'text-text-muted hover:text-text-gray hover:bg-bg-card-inner/40'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={isActive ? 'text-accent-blue' : ''}
                  />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User & Logout */}
      <div className="px-4 pb-3">
        {user && (
          <div className="flex items-center gap-3 px-4 py-2.5 mb-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${user.avatarColor || '#4F6EF7'}, #22D3EE)` }}
            >
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-text-white text-[12px] font-semibold truncate">{user.name}</p>
              <p className="text-text-dark text-[10px] truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium
                     text-accent-red/80 hover:text-accent-red hover:bg-accent-red/10 transition-all"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>

      <div className="px-6 py-3 border-t border-border-line/40">
        <p className="text-[11px] text-text-dark">SmartH v2.4</p>
      </div>
    </aside>
  );
}

export default Sidebar;