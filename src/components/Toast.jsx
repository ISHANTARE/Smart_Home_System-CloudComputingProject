import React from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
    success: CheckCircle2,
    info: Info,
    warning: AlertTriangle,
};

const colors = {
    success: 'border-accent-green/40 bg-accent-green/10 text-accent-green',
    info: 'border-accent-blue/40 bg-accent-blue/10 text-accent-blue',
    warning: 'border-accent-orange/40 bg-accent-orange/10 text-accent-orange',
};

function Toast({ toasts }) {
    if (!toasts.length) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map((t) => {
                const Icon = icons[t.type] || icons.success;
                return (
                    <div
                        key={t.id}
                        className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3
              rounded-xl border backdrop-blur-xl shadow-lg
              animate-toast text-[13px] font-medium
              ${colors[t.type] || colors.success}
            `}
                    >
                        <Icon size={16} className="flex-shrink-0" />
                        <span>{t.message}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default Toast;
