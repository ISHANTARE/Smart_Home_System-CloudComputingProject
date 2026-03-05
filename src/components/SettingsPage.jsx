import React, { useState } from 'react';
import {
    User, Palette, Shield, Bell, Cloud, Info,
    Save, Loader2, CheckCircle2, Moon, Sun,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { useSmartHome } from '../context/SmartHomeContext';

function SettingsPage() {
    const { user, updateProfile } = useAuth();
    const { addToast } = useSmartHome();
    const [activeSection, setActiveSection] = useState(null);

    // Profile form
    const [profileName, setProfileName] = useState(user?.name || '');
    const [profileEmail, setProfileEmail] = useState(user?.email || '');
    const [profileLoading, setProfileLoading] = useState(false);

    // Password form
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [pwLoading, setPwLoading] = useState(false);

    // Notifications
    const [notifDevice, setNotifDevice] = useState(() => localStorage.getItem('notif_device') !== 'false');
    const [notifEnergy, setNotifEnergy] = useState(() => localStorage.getItem('notif_energy') !== 'false');
    const [notifSecurity, setNotifSecurity] = useState(() => localStorage.getItem('notif_security') !== 'false');

    // Theme
    const [theme, setTheme] = useState(() => localStorage.getItem('smarth_theme') || 'dark');

    const handleProfileSave = async () => {
        setProfileLoading(true);
        try {
            await updateProfile({ name: profileName, email: profileEmail });
            addToast('Profile updated successfully');
        } catch (err) {
            addToast(err.message, 'warning');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (newPw !== confirmPw) { addToast('Passwords do not match', 'warning'); return; }
        if (newPw.length < 6) { addToast('Password must be at least 6 characters', 'warning'); return; }
        setPwLoading(true);
        try {
            await api.changePassword({ currentPassword: currentPw, newPassword: newPw });
            addToast('Password changed successfully');
            setCurrentPw(''); setNewPw(''); setConfirmPw('');
        } catch (err) {
            addToast(err.message, 'warning');
        } finally {
            setPwLoading(false);
        }
    };

    const toggleNotif = (key, value, setter) => {
        setter(value);
        localStorage.setItem(key, value);
    };

    const sections = [
        {
            id: 'profile', icon: User, title: 'Profile',
            description: 'Manage your account information', color: '#4F6EF7',
            content: (
                <div className="space-y-3 mt-4">
                    <div>
                        <label className="text-text-gray text-[12px] font-medium mb-1 block">Name</label>
                        <input value={profileName} onChange={(e) => setProfileName(e.target.value)}
                            className="w-full bg-bg-card-inner border border-border-line rounded-xl py-2.5 px-4 text-[14px] text-text-white
                         focus:outline-none focus:border-accent-blue/50 transition-all" />
                    </div>
                    <div>
                        <label className="text-text-gray text-[12px] font-medium mb-1 block">Email</label>
                        <input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)}
                            className="w-full bg-bg-card-inner border border-border-line rounded-xl py-2.5 px-4 text-[14px] text-text-white
                         focus:outline-none focus:border-accent-blue/50 transition-all" />
                    </div>
                    <button onClick={handleProfileSave} disabled={profileLoading}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold
                       bg-accent-blue text-white shadow-lg shadow-accent-blue/25 hover:brightness-110 transition-all disabled:opacity-50">
                        {profileLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Save Changes
                    </button>
                </div>
            ),
        },
        {
            id: 'notifications', icon: Bell, title: 'Notifications',
            description: 'Configure notification preferences', color: '#22D3EE',
            content: (
                <div className="space-y-3 mt-4">
                    {[
                        { label: 'Device Status Changes', key: 'notif_device', val: notifDevice, setter: setNotifDevice },
                        { label: 'Energy Usage Alerts', key: 'notif_energy', val: notifEnergy, setter: setNotifEnergy },
                        { label: 'Security Alerts', key: 'notif_security', val: notifSecurity, setter: setNotifSecurity },
                    ].map((n) => (
                        <div key={n.key} className="flex items-center justify-between py-2">
                            <span className="text-text-white text-[13px]">{n.label}</span>
                            <button
                                onClick={() => toggleNotif(n.key, !n.val, n.setter)}
                                className={`w-11 h-[22px] rounded-full relative flex-shrink-0 transition-colors duration-300
                  ${n.val ? 'bg-accent-blue' : 'bg-border-light'}`}
                            >
                                <div className={`absolute top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white
                                 transition-transform duration-300 shadow-sm
                                 ${n.val ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            id: 'appearance', icon: Palette, title: 'Appearance',
            description: 'Customize theme and display options', color: '#8B5CF6',
            content: (
                <div className="mt-4">
                    <p className="text-text-gray text-[12px] font-medium mb-2">Theme</p>
                    <div className="flex gap-3">
                        {[
                            { id: 'dark', label: 'Dark', icon: Moon },
                            { id: 'light', label: 'Light (Coming Soon)', icon: Sun, disabled: true },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => { if (!t.disabled) { setTheme(t.id); localStorage.setItem('smarth_theme', t.id); } }}
                                disabled={t.disabled}
                                className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-medium transition-all
                  ${theme === t.id ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/25' : 'bg-bg-card-inner text-text-muted border border-border-line/40'}
                  ${t.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                                <t.icon size={16} /> {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            id: 'security', icon: Shield, title: 'Security',
            description: 'Change password and access control', color: '#22C55E',
            content: (
                <div className="space-y-3 mt-4">
                    <div>
                        <label className="text-text-gray text-[12px] font-medium mb-1 block">Current Password</label>
                        <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
                            className="w-full bg-bg-card-inner border border-border-line rounded-xl py-2.5 px-4 text-[14px] text-text-white
                         focus:outline-none focus:border-accent-blue/50 transition-all" />
                    </div>
                    <div>
                        <label className="text-text-gray text-[12px] font-medium mb-1 block">New Password</label>
                        <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
                            className="w-full bg-bg-card-inner border border-border-line rounded-xl py-2.5 px-4 text-[14px] text-text-white
                         focus:outline-none focus:border-accent-blue/50 transition-all" />
                    </div>
                    <div>
                        <label className="text-text-gray text-[12px] font-medium mb-1 block">Confirm New Password</label>
                        <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                            className="w-full bg-bg-card-inner border border-border-line rounded-xl py-2.5 px-4 text-[14px] text-text-white
                         focus:outline-none focus:border-accent-blue/50 transition-all" />
                    </div>
                    <button onClick={handlePasswordChange} disabled={pwLoading}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold
                       bg-accent-green text-white shadow-lg shadow-accent-green/25 hover:brightness-110 transition-all disabled:opacity-50">
                        {pwLoading ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
                        Change Password
                    </button>
                </div>
            ),
        },
        {
            id: 'cloud', icon: Cloud, title: 'Cloud & Sync',
            description: 'AWS IoT Core integration and sync', color: '#F97316',
            content: (
                <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-bg-card-inner rounded-xl border border-border-line/40">
                        <CheckCircle2 size={18} className="text-accent-green flex-shrink-0" />
                        <div>
                            <p className="text-text-white text-[13px] font-medium">Backend Connected</p>
                            <p className="text-text-dark text-[11px]">Local SQLite — Ready for AWS migration</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Database', value: 'SQLite (Local)' },
                            { label: 'API Server', value: 'Express.js' },
                            { label: 'Auth', value: 'JWT + bcrypt' },
                            { label: 'AWS Status', value: 'Ready to deploy' },
                        ].map((item) => (
                            <div key={item.label} className="p-3 bg-bg-card-inner rounded-xl border border-border-line/40">
                                <p className="text-text-muted text-[11px]">{item.label}</p>
                                <p className="text-text-white text-[13px] font-semibold mt-0.5">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            id: 'about', icon: Info, title: 'About',
            description: 'SmartH Dashboard v2.4', color: '#64748B',
            content: (
                <div className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: 'Version', value: 'v2.4.0' },
                            { label: 'Frontend', value: 'React 18' },
                            { label: 'Backend', value: 'Express.js' },
                            { label: 'Database', value: 'SQLite' },
                        ].map((item) => (
                            <div key={item.label} className="p-3 bg-bg-card-inner rounded-xl border border-border-line/40">
                                <p className="text-text-muted text-[11px]">{item.label}</p>
                                <p className="text-text-white text-[13px] font-semibold mt-0.5">{item.value}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-text-dark text-[11px] mt-4">
                        Cloud Computing Project — B.Tech CSE 3rd Year © 2026
                    </p>
                </div>
            ),
        },
    ];

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6">
            <h2 className="text-[22px] font-bold text-text-white mb-6">Settings</h2>

            <div className="space-y-3">
                {sections.map((section) => {
                    const Icon = section.icon;
                    const isOpen = activeSection === section.id;
                    return (
                        <div
                            key={section.id}
                            className="bg-bg-card rounded-2xl border border-border-line/60 overflow-hidden transition-all"
                        >
                            <button
                                onClick={() => setActiveSection(isOpen ? null : section.id)}
                                className="w-full p-5 flex items-center gap-4 text-left hover:bg-bg-card-inner/30 transition-colors"
                            >
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: `${section.color}18` }}
                                >
                                    <Icon size={20} style={{ color: section.color }} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[15px] font-semibold text-text-white">{section.title}</h3>
                                    <p className="text-[13px] text-text-muted">{section.description}</p>
                                </div>
                                <div className={`text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </div>
                            </button>
                            {isOpen && (
                                <div className="px-5 pb-5 anim-fade">
                                    {section.content}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SettingsPage;
