import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

function NotFoundPage({ onGoHome }) {
    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center px-4">
            <div className="text-center">
                <div className="text-[120px] font-bold text-bg-card-inner leading-none select-none">404</div>
                <h2 className="text-xl font-bold text-text-white mb-2 -mt-4">Page Not Found</h2>
                <p className="text-text-muted text-[14px] mb-6 max-w-sm mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <button
                    onClick={onGoHome}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold
                     bg-accent-blue text-white shadow-lg shadow-accent-blue/25
                     hover:brightness-110 transition-all"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default NotFoundPage;
