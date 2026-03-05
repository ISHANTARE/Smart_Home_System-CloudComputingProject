import React, { useState, useEffect } from 'react';
import { Clock, Monitor, Plug, Home, Shield, Loader2 } from 'lucide-react';
import { api } from '../utils/api';

const iconMap = {
    login: Shield,
    add: Plug,
    delete: Monitor,
    update: Home,
};

function RecentPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getActivity(50)
            .then(setLogs)
            .catch(() => setLogs([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={28} className="animate-spin text-accent-blue" />
            </div>
        );
    }

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6">
            <h2 className="text-[22px] font-bold text-text-white mb-6">Recent Activity</h2>

            {logs.length === 0 ? (
                <div className="bg-bg-card rounded-2xl p-8 border border-border-line/60 text-center">
                    <Clock size={32} className="text-text-muted mx-auto mb-3" />
                    <p className="text-text-muted text-[14px]">No activity recorded yet.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {logs.map((log) => {
                        const Icon = iconMap[log.action] || Clock;
                        return (
                            <div
                                key={log.id}
                                className="bg-bg-card rounded-xl p-4 border border-border-line/40 flex items-center gap-4
                           hover:border-border-light transition-all"
                            >
                                <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
                                    <Icon size={18} className="text-accent-blue" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-text-white text-[13px] font-medium truncate">
                                        {log.detail || `${log.action} ${log.target}`}
                                    </p>
                                    <p className="text-text-dark text-[11px] mt-0.5">
                                        {new Date(log.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <span className="text-[11px] text-text-muted bg-bg-card-inner px-2 py-1 rounded-lg capitalize flex-shrink-0">
                                    {log.action}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default RecentPage;
