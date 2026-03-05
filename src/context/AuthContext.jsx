import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('smarth_token'));
    const [loading, setLoading] = useState(true);

    // validate token on mount
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        api.getMe()
            .then((userData) => {
                setUser(userData);
            })
            .catch(() => {
                // token invalid — clear it
                localStorage.removeItem('smarth_token');
                setToken(null);
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, [token]);

    const login = useCallback(async (email, password) => {
        const data = await api.login({ email, password });
        localStorage.setItem('smarth_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
    }, []);

    const register = useCallback(async (name, email, password) => {
        await api.register({ name, email, password });
        // auto-login after register
        return login(email, password);
    }, [login]);

    const logout = useCallback(() => {
        localStorage.removeItem('smarth_token');
        setToken(null);
        setUser(null);
    }, []);

    const updateProfile = useCallback(async (updates) => {
        const data = await api.updateProfile(updates);
        setUser((prev) => ({ ...prev, name: data.name, email: data.email }));
        return data;
    }, []);

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
