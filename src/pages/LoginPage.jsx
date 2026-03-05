import React, { useState } from 'react';
import { Home, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

function LoginPage({ onSwitch, onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { setError('Please fill in all fields'); return; }
        setError('');
        setLoading(true);
        try {
            await onLogin(email, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
                        <Home size={24} className="text-white" />
                    </div>
                    <span className="text-text-white font-bold text-2xl tracking-tight">SmartH</span>
                </div>

                <div className="bg-bg-card rounded-2xl p-7 border border-border-line/60 shadow-card">
                    <h2 className="text-xl font-bold text-text-white mb-1">Welcome Back</h2>
                    <p className="text-text-muted text-[13px] mb-6">Sign in to your smart home dashboard</p>

                    {error && (
                        <div className="bg-accent-red/10 border border-accent-red/30 rounded-xl px-4 py-2.5 mb-4">
                            <p className="text-accent-red text-[12px] font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-text-gray text-[12px] font-medium mb-1.5 block">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-bg-card-inner border border-border-line rounded-xl
                           py-3 px-4 text-[14px] text-text-white placeholder-text-dark
                           focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20
                           transition-all"
                                id="login-email"
                            />
                        </div>

                        <div>
                            <label className="text-text-gray text-[12px] font-medium mb-1.5 block">Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-bg-card-inner border border-border-line rounded-xl
                             py-3 px-4 pr-11 text-[14px] text-text-white placeholder-text-dark
                             focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20
                             transition-all"
                                    id="login-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-white transition-colors"
                                >
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl text-[14px] font-semibold
                         bg-accent-blue text-white shadow-lg shadow-accent-blue/25
                         hover:brightness-110 transition-all flex items-center justify-center gap-2
                         disabled:opacity-50"
                            id="login-submit"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <p className="text-text-muted text-[13px] text-center mt-5">
                        Don't have an account?{' '}
                        <button onClick={onSwitch} className="text-accent-blue font-semibold hover:underline">
                            Create one
                        </button>
                    </p>
                </div>

                <p className="text-text-dark text-[11px] text-center mt-4">
                    SmartH Dashboard — Cloud Computing Project © 2026
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
